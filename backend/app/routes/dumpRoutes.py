from fastapi import APIRouter,Depends,HTTPException,WebSocket
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.db import get_db
from app.schemas.dumpSchema import dumpCreate,dumpReturn
from app.schemas.thoughtSchema import thoughtCreate,thoughtReturn
from app.schemas.categorySchema import categoryCreate,categoryReturn

from app.services import dumpServices as service
from app.celery_app import celery_app

from app.security.auth import get_current_user



router = APIRouter(prefix = "/dump",tags=["Dump Routes"])

#CRUD Create-post Read-get Update-put/patch Delete-delete

@router.post("/",response_model=dumpReturn)
def create_dump_route(new_dump:dumpCreate,user=Depends(get_current_user),db:Session=Depends(get_db)):
    dump = service.create_dump(new_dump,user,db)
    if not dump:
        raise HTTPException(status_code=404)
    return dump


@router.get("/",response_model=List[dumpReturn])
def get_dump(date:date,user=Depends(get_current_user),db:Session=Depends(get_db)):
    dump = service.get_dump(date,user,db)

    if not dump:
        raise HTTPException(status_code=404)
    return dump

@router.get("/thoughts",response_model=List[thoughtReturn])
def get_thoughts(dump_id:int,db:Session=Depends(get_db)):
    thoughts = service.get_thoughts(dump_id,db)
    if not thoughts:
        raise HTTPException(status_code=404)
    return thoughts

@router.get("/categories",response_model=List[thoughtReturn])
def get_category(category_id:int,db:Session=Depends(get_db)):
    category = service.get_category(category_id,db)
    if not category:
        raise HTTPException(status_code=404)
    return category

@router.get("/all",response_model=List[dumpReturn])
def get_all_dumps(user=Depends(get_current_user),db:Session=Depends(get_db)):
    all_dumps = service.get_all_dumps(user,db)
    if not all_dumps:
        raise HTTPException(status_code=404)
    return all_dumps


@router.get("/today",response_model=List[dumpReturn])
def get_user_daily_dumps(user=Depends(get_current_user),db:Session=Depends(get_db)):
    todays_dumps = service.get_user_daily_dumps(user,db)
    
    return todays_dumps

@router.get("/pairDumps",response_model=List[dumpReturn])
def get_pair_dumps(user=Depends(get_current_user),db:Session=Depends(get_db)):
    pair_dumps = service.get_pair_dumps(user,db)
    return pair_dumps


connections = {}

@router.websocket("/ws/timeline/{timeline_id}")
async def timeline_ws(ws: WebSocket, timeline_id: str):
    await ws.accept()
    if timeline_id not in connections:
        connections[timeline_id] = []
    connections[timeline_id].append(ws)

    try:
        while True:
            data = await ws.receive_text()
            await service.ws_update_pair(timeline_id, data)
            for conn in connections[timeline_id]:
                await conn.send_text(data)
    except:
        connections[timeline_id].remove(ws)




