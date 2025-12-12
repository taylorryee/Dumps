from app.celery_app import celery_app
from sqlalchemy.orm import Session
from app.db import SessionLocal
#from backend.llm import process_dump_with_llm
from app.models.models import Dump,Thought,Category,ThoughtCategory
from sqlalchemy import asc
from app.llm.services_llm import  summarize_text, extract_thoughts,extract_categories,embed_categories

def find_similar_category(embedding_vector:list[float],threshold,db:Session):
    return (
        db.query(Category)
        .filter(Category.embedding.cosine_distance(embedding_vector) < threshold)
        .order_by(asc(Category.embedding.cosine_distance(embedding_vector)))
        .first()
    )

@celery_app.task
def process_dump(dump_id: int):
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
        for i,name in enumerate(category_names):
            
            similar_category = find_similar_category(category_embeddings[i],0.4,db)
            if similar_category:
                category_id = similar_category.id
            else:
                newCategory = Category(name = name,embedding=category_embeddings[i])
                db.add(newCategory)
                db.flush()
                category_id = newCategory.id

            newThoughtCategory = ThoughtCategory(thought_id=newThought.id,category_id=category_id)
            db.add(newThoughtCategory)


    db.commit()
    db.close()
    return True




