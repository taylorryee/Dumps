from sqlalchemy.orm import Session,joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_,case,and_
from datetime import date
from app.models.models import User
from app.schemas.userSchema import userCreate,userCreateReturn,userLogin,userLoginReturn,userProfileReturn
from coolname import generate_slug
from app.models.models import Dump, Thought,Category,User,DailyPair
from app.security.auth import hash_password,verify_password,create_access_token


def get_all_user_profiles(db):
    db_profiles = db.query(User).options(joinedload(User.dumps)).all() #This calls a join on the User and Dump table and autoloads the User.dumps field with the dumps

    profileReturn = []

    for profile in db_profiles:
        profileReturn.append(userProfileReturn(id=profile.id,username=profile.username,dumps=profile.dumps))
    
    testProfile = [] #test
    for i in range(10):
        testProfile+=profileReturn
    
    return profileReturn


def create_user(user:userCreate,db:Session):
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        return None
    hashed_password = hash_password(user.password)
    username = generate_slug()
    
    while db.query(User).filter(User.username==username).first():
        username = generate_slug()

    new_user = User(email=user.email,username = username, hashed_password=hashed_password)
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
        return new_user
    except IntegrityError:
        db.rollback()
        return None


def login(user:userLogin,db:Session):
    cur_user = db.query(User).filter(User.email==user.email).first()
    if not cur_user:
        return None

    if not verify_password(user.password,cur_user.hashed_password):
        return None
    
    data = {"sub":str(cur_user.id)}
    token = create_access_token(data)
    return userLoginReturn(id = cur_user.id, username = cur_user.username,token=token)

def get_user_profile(user:User,db:Session):
    dumps = db.query(Dump).filter(Dump.user_id == user.id).all()
    return userProfileReturn(id=user.id, username=user.username, dumps = dumps)


def get_daily_pair(user:int,db:Session):
    #pair_id = case(
     #   [(DailyPair.user_id_low==user.id,DailyPair.user_id_high),(DailyPair.user_id_high==user.id,DailyPair.user_id_low)]
    #)
    
    #pair = db.query(User).join(DailyPair,and_(DailyPair.date==date.today(),or_(DailyPair.user_id_high==user,DailyPair.user_id_low==user))).filter(and_(User.id!=user),or_(User.id==DailyPair.user_id_low,User.id==DailyPair.user_id_high)).first()

    daily_pair = db.query(DailyPair).filter(DailyPair.date==date.today(),or_(DailyPair.user_id_high==user,DailyPair.user_id_low==user)).first()
    
    if daily_pair.user_id_low==user:
        pair_id = daily_pair.user_id_high
    else:
        pair_id=daily_pair.user_id_low
    
    #return db.query(User).filter(User.id==pair_id).first()
    pair_user =  db.query(User).get(pair_id)
    return userProfileReturn(id=pair_user.id,username=pair_user.username,dumps=pair_user.dumps,timeline_id=daily_pair.id)


    #return pair
    




    