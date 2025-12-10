from app.celery_app import celery_app
from sqlalchemy.orm import Session
from app.db import SessionLocal
#from backend.llm import process_dump_with_llm
from app.models.models import Dump,Thought
from app.llm.services_llm import summarize_text, extract_thoughts,embed 




@celery_app.task
def process_dump(dump_id: int):
    db: Session = SessionLocal()

    dump = db.query(Dump).get(dump_id)
    summarized = summarize_text(dump.text)
    dump.text = summarized

    thoughts = extract_thoughts(summarized)
    #embeddings = []
    #for thought,content in thoughts:
          #embeddings.append()
          
    #for thought,content in thoughts:
            
            #newThought = Thought(cleaned_text = summarized,raw_text=dump.text,embedding = ,dump_id = dump.id)

    db.add(dump)
    db.commit()
    db.close()
    return True

    #cleaned_thoughts = process_dump_with_llm(dump.text)

    # Save results (simplified example)
    #for thought in cleaned_thoughts:
        #t = Thought(
            #dump_id=dump.id,
            #text=thought.cleaned,c
            #raw_text=thought.raw,
            #embedding=create_embedding(thought.cleaned)
        #)
        #db.add(t)

    #db.commit()
    #db.close()


