from sqlalchemy.orm import Session,joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from datetime import date

from app.models.models import Dump, Thought,Category,User,DailyPair
from app.schemas.dumpSchema import dumpCreate,dumpReturn
from app.worker.tasks import process_dump
from app.db import SessionLocal

from sqlalchemy.orm import Session


def create_dump(new_dump:dumpCreate,user:User,db:Session):
    dump = Dump(text=new_dump.text,user_id=user.id)
    db.add(dump)

    try:
        db.commit()
        db.refresh(dump)
        #process_dump.delay(dump.id,user.id) # delay calls celery to package the function and input into a message that is then put 
        #into redis queue -> then create_dump is able to end without waiting on all the time intenseive work of processing the
        #dump. A celery worker is then able look at the redis queue and pull taks to do the llm work in the backgroud
        return dump
    except IntegrityError:
        db.rollback()
        return None

def get_dump(date:date,user:User,db:Session):

    dump = db.query(Dump).filter(Dump.user_id==user.id,func.date(Dump.created_at) == date).all() #find dump of the user on a specific date
    return dump

def get_thoughts(dump_id:int,db:Session):
    thought = db.query(Thought).filter(Thought.dump_id==dump_id).all()
    return thought

def get_category(category_id:int,db:Session):
    category = db.query(Category).filter(Category.id==category_id).first()
    return category.thoughts

def get_all_dumps(user:User,db:Session):
    #cur_user = db.query(User).filter(User.id==user_id).first()
    #if not cur_user:
     #   return None
    
    return user.dumps


def get_user_daily_dumps(user:User,db:Session):
    today = date.today()
    todays_dumps = db.query(Dump).filter(Dump.user_id==user.id).filter(func.date(Dump.created_at)==today).all()
    return todays_dumps


def get_pair_dumps(user:User,db:Session):
    today =date.today()
    pair = db.query(User).join(DailyPair,DailyPair.paired_user_id==User.id).options(joinedload(User.dumps)).filter(DailyPair.date==today).filter(DailyPair.user_id==user.id).first()
    #.options lets you tell sqlalchemy how to load relationships - in this instance we are pre loading the dumps relationship. joinedload loads the relationship in one query. Also here
    # we use an explicit join condition "(DailyPair,DailyPair.paired_user_id==User.id)" which specifies to join rows only on this condition - in our case were the paired_user_id==User.id
    return pair.dumps


def ws_update_pair(timeline_id:int,dumpData:Dump,user_id:int):
    db:Session = SessionLocal()
    user = db.query(User).get(user_id)
    newDump = Dump(text=dumpData.dump,user_id=user.id,created_at=dumpData.created_at)
    try:
        db.add(newDump)
        db.commit()
    except:
        db.rollback()
        raise
    finally:
        db.close()



