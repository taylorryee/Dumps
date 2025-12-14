from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.models import User
from app.schemas.userSchema import userCreate,userReturn,userLogin,userLoginReturn
from coolname import generate_slug

from app.security.auth import hash_password,verify_password,create_access_token


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
    return userLoginReturn(username = cur_user.username,token=token)

