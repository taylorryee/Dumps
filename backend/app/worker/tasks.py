from app.celery_app import celery_app
from sqlalchemy.orm import Session
from app.db import SessionLocal
#from backend.llm import process_dump_with_llm
from app.models.models import Dump,Thought



@celery_app.task
def process_dump(dump_id: int):
    db: Session = SessionLocal()

    dump = db.query(Dump).get(dump_id)

    dump.text = "Celery jus processed yo shit"

    db.add(dump)
    db.commit()
    db.close()
    return True

    #cleaned_thoughts = process_dump_with_llm(dump.text)

    # Save results (simplified example)
    #for thought in cleaned_thoughts:
        #t = Thought(
            #dump_id=dump.id,
            #text=thought.cleaned,
            #raw_text=thought.raw,
            #embedding=create_embedding(thought.cleaned)
        #)
        #db.add(t)

    #db.commit()
    #db.close()


