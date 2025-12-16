from app.celery_app import celery_app
from sqlalchemy.orm import Session
from app.db import SessionLocal
#from backend.llm import process_dump_with_llm
from app.models.models import Dump,Thought,Category,ThoughtCategory,User,UserCategory
from sqlalchemy import asc,func
from app.llm.services_llm import summarize_text, extract_thoughts,extract_categories,embed_categories

#user categories is subset of global categories

def find_similar_category(category_name:str,embedding_vector:list[float],threshold,db:Session):
    matching_category = db.query(Category).filter(func.lower(Category.name) == func.lower(category_name)).first()
    if matching_category:
        return matching_category
    return (
        db.query(Category)
        .filter(Category.embedding.cosine_distance(embedding_vector) < threshold)
        .order_by(asc(Category.embedding.cosine_distance(embedding_vector)))
        .first()
    )

def find_similar_user_category(category_name:str,user_id: int, embedding_vector, threshold: float, db: Session):
    matching_category = (db.query(Category)
                         .join(UserCategory,UserCategory.category_id==Category.id)
                         .filter(UserCategory.user_id==user_id)
                         .filter(func.lower(Category.name)==func.lower(category_name))
                         .first()
    )
    if matching_category:
        return matching_category
    return (
        db.query(Category)
        .join(UserCategory, UserCategory.category_id == Category.id)
        .filter(UserCategory.user_id == user_id)
        .order_by(Category.embedding.cosine_distance(embedding_vector))
        .filter(Category.embedding.cosine_distance(embedding_vector) < threshold)
        .first()
    )

    
@celery_app.task
def process_dump(dump_id: int, user_id:int):
    db: Session = SessionLocal()

    dump = db.query(Dump).get(dump_id)
    summarized = summarize_text(dump.text)
    dump.text = summarized
    db.add(dump)

    thoughts = extract_thoughts(dump.text)
    
    for thought in thoughts.thoughts:
        
        newThought = Thought(cleaned_text=thought.summary,raw_text=thought.original_text,dump_id=dump_id)
        db.add(newThought)
        db.flush()
        
        categories = extract_categories(newThought.cleaned_text)
        category_names = [c.name for c in categories.categories]
        category_embeddings = embed_categories(category_names)
        
        for i,name in enumerate(category_names):#iterate throught the categories that llm assigned to a dump.
            
            similar_user_category = find_similar_user_category(user_id,category_embeddings[i],0.4,db)#searches for a similar user category
            
            if similar_user_category:#if user has already has category then we know that global categories already has category as well
                category_id = similar_user_category.id
            else:
                similar_category = find_similar_category(category_embeddings[i],0.4,db) #searches through global categories and if there is a category/categories found within the embedding threshold it is returned
                
                if similar_category:#if there exists a global category already-add this category to users personal category list
                    newUserCategory = UserCategory(user_id=user_id,category_id=similar_category.id)
                    db.add(newUserCategory)
                    category_id = similar_category.id
                else:#if not global category exists create new global category, then also add this new global category to users personal category list
                    newCategory = Category(name = name,embedding=category_embeddings[i])
                    db.add(newCategory)
                    db.flush()
                    newUserCategory = UserCategory(user_id=user_id,category_id=newCategory.id)
                    db.add(newUserCategory)
                    category_id = newCategory.id

            newThoughtCategory = ThoughtCategory(thought_id=newThought.id,category_id=category_id)
            db.add(newThoughtCategory)


    db.commit()
    db.close()
    return True




