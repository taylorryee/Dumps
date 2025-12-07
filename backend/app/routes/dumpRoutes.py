from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.db import get_db
from app.schemas.dumpSchema import dumpCreate,dumpReturn
from app.services import dumpServices as service
from app.celery_app import celery_app



router = APIRouter(prefix = "/dump",tags=["Dump Routes"])

#CRUD Create-post Read-get Update-put/patch Delete-delete

@router.post("/",response_model=dumpReturn)
def create_dump_route(new_dump:dumpCreate,db:Session=Depends(get_db)):
    dump = service.create_dump(new_dump,db)
    if not dump:
        raise HTTPException(status_code=404)
    return dump


@router.get("/",response_model=List[dumpReturn])
def get_dump(date:date,db:Session=Depends(get_db)):
    dump = service.get_dump(date,db)
    if not dump:
        raise HTTPException(status_code=404)
    return dump







