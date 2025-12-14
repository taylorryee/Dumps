from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.db import get_db
from app.schemas.dumpSchema import dumpCreate,dumpReturn
from app.schemas.thoughtSchema import thoughtCreate,thoughtReturn
from app.schemas.categorySchema import categoryCreate,categoryReturn
from app.schemas.userSchema import userCreate,userReturn,userLogin,userLoginReturn

from app.services import userServices as service
from app.celery_app import celery_app

from fastapi.security import OAuth2PasswordRequestForm

#CRUD - Create-Post, Read-Get
router = APIRouter(prefix="/user",tags=["User Routes"])

@router.post("/create",response_model = userReturn)
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