from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.db import get_db
from app.schemas.dumpSchema import dumpCreate,dumpReturn
from app.schemas.thoughtSchema import thoughtCreate,thoughtReturn
from app.schemas.categorySchema import categoryCreate,categoryReturn
from app.schemas.userSchema import userCreate,userCreateReturn,userLogin,userLoginReturn,userProfileReturn


from app.services import userServices as service
from app.celery_app import celery_app

from app.security.auth import get_current_user
from app.models.models import Dump, Thought,Category,User,DailyPair

#CRUD - Create-Post, Read-Get
router = APIRouter(prefix="/user",tags=["User Routes"])

@router.get("/all",response_model = List[userProfileReturn])
def get_all_user_profiles(db:Session=Depends(get_db)):
    profiles = service.get_all_user_profiles(db)
    return profiles

@router.post("/create",response_model = userCreateReturn)
def create_user(user:userCreate,db:Session=Depends(get_db)):
    new_user = service.create_user(user,db)
    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with that email already exists."
        )
    return new_user


@router.post("/login",response_model=userLoginReturn)
def login(user:userLogin,db:Session=Depends(get_db)):
    logged_in = service.login(user,db)
    if not logged_in:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password."
        )

    return logged_in


@router.get("/profile",response_model = userProfileReturn)
def get_user_profile(user=Depends(get_current_user),db:Session=Depends(get_db)):
    user_profile = service.get_user_profile(user,db)
    if not user_profile:
        raise HTTPException()

    return user_profile

@router.get("/pair",response_model=userProfileReturn)
def get_daily_pair(user:int,db:Session=Depends(get_db)):
    pair = service.get_daily_pair(user,db)
    if not pair:
        raise HTTPException()

    return pair


@router.get("/pairTable",)
def test_pairs(db:Session=Depends(get_db)):
    return db.query(DailyPair).all()


