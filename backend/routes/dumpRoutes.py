from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.schemas.dumpSchema import dumpCreate,dumpReturn
from backend.services import dumpServices as service

router = APIRouter(prefix = "/dump",tags=["Dump Routes"])

#CRUD Create-post Read-get Update-put/patch Delete-delete

@router.post("/",response_model=dumpReturn)
def create_dump_route(new_dump:dumpCreate,db:Session=Depends(get_db)):
    dump = service.create_dump(new_dump,db)
    if not dump:
        raise HTTPException(status_code=404)
    return dump


