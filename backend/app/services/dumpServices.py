from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from datetime import date

from app.models.models import Dump, Thought,Category,User
from app.schemas.dumpSchema import dumpCreate,dumpReturn
from app.worker.tasks import process_dump


def create_dump(new_dump:dumpCreate,user:User,db:Session):
    dump = Dump(text=new_dump.text,user_id=user.id)
    db.add(dump)

    try:
        db.commit()
        db.refresh(dump)
        process_dump.delay(dump.id) # delay calls celery to package the function and input into a message that is then put 
        #into redis queue -> then create_dump is able to end without waiting on all the time intenseive work of processing the
        #dump. A celery worker is then able look at the redis queue and pull taks to do the llm work in the backgroud
        return dump
    except IntegrityError:
        db.rollback()
        return None

def get_dump(date:date,user:User,db:Session):
    dump = db.query(Dump).filter(func.date(Dump.created_at) == date).all()
    return dump

def get_thoughts(dump_id:int,db:Session):
    thought = db.query(Thought).filter(Thought.dump_id==dump_id).all()
    return thought

def get_category(category_id:int,db:Session):
    category = db.query(Category).filter(Category.id==category_id).first()
    return category.thoughts