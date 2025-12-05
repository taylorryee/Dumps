from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.models.models import Dump
from backend.schemas.dumpSchema import dumpCreate,dumpReturn


def create_dump(new_dump:dumpCreate,db:Session):
    dump = Dump(text=new_dump.text)
    db.add(dump)

    try:
        db.commit()
        db.refresh(dump)
        return dump
    except IntegrityError:
        db.rollback()
        return None

