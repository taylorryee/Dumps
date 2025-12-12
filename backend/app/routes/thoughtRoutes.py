from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.db import get_db
from app.schemas.dumpSchema import dumpCreate,dumpReturn
from app.schemas.thoughtSchema import thoughtCreate,thoughtReturn
from app.schemas.categorySchema import categoryCreate,categoryReturn

from app.services import dumpServices as service
from app.celery_app import celery_app



router = APIRouter(prefix = "/thought",tags=["Thought Routes"])