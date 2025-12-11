from app.celery_app import celery_app
from sqlalchemy.orm import Session
from app.db import SessionLocal
#from backend.llm import process_dump_with_llm
from app.models.models import Dump,Thought,Category,ThoughtCategory
from app.llm.services_llm import  summarize_text, extract_thoughts,extract_categories

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
        for category in categories.categories:
            existingCategory = db.query(Category).filter(Category.name == category.name).first()
            if existingCategory:
                thoughtCategory_id = existingCategory.id
            else:
                newCategory = Category(name = category.name)
                db.add(newCategory)
                db.flush()
                thoughtCategory_id = newCategory.id
        
            newThoughtCategory = ThoughtCategory(thought_id=newThought.id,category_id=thoughtCategory_id)
            db.add(newThoughtCategory)


    db.commit()
    db.close()
    return True




