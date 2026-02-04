from fastapi import APIRouter,Depends,HTTPException,WebSocket
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.db import get_db,SessionLocal
from app.schemas.dumpSchema import dumpCreate,dumpReturn
from app.schemas.thoughtSchema import thoughtCreate,thoughtReturn
from app.schemas.categorySchema import categoryCreate,categoryReturn

from app.services import dumpServices as service
from app.celery_app import celery_app

from app.security.auth import get_current_user,decode_token
from starlette.concurrency import run_in_threadpool
import json

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

    return all_dumps


@router.get("/today",response_model=List[dumpReturn])
def get_user_daily_dumps(user=Depends(get_current_user),db:Session=Depends(get_db)):
    todays_dumps = service.get_user_daily_dumps(user,db)
    
    return todays_dumps

@router.get("/pairDumps",response_model=List[dumpReturn])
def get_pair_dumps(user=Depends(get_current_user),db:Session=Depends(get_db)):
    pair_dumps = service.get_pair_dumps(user,db)
    return pair_dumps

def log_connections():
    snapshot =[]
    for key,item in connections.items():
        snapshot.append((key,item))
    print("WS CONNECTIONS:", snapshot,flush=True)


connections = {}#TO DO: Need to switch this to redis - currently this assumes that all websocket requests get sent to the same worker as connections is local to one worker instance. Need a global
#way to store connections so all workers can view - use redis

@router.websocket("/ws/pair/{timeline_id}")
async def timeline_ws(ws: WebSocket, timeline_id: str):
    token = ws.query_params.get("token")
    user_id = decode_token(token) #only get the user_id not the full User object - this is because if we got the full orm User object than that user would be tied to the db session - meaning we would need 
    #to keep the db session open for the lifetime of the websocket as using user in ws_udpate_pair requires the db to be open still as user would be tied to the db. 

    if not user_id:
        await ws.close(code=1008)
        return
    await ws.accept()

    if timeline_id not in connections:

        connections[timeline_id] = []
    connections[timeline_id].append(ws)
    log_connections()

    try:
        while True:
            print("sup twin",flush=True)
            dump = await ws.receive_text()
            dumpData = json.loads(dump)


            db_accurate_dump = await run_in_threadpool(service.ws_update_pair,timeline_id, dumpData,user_id) #We use run_in_threadpool here so that we can pass of the sync work of update_pair to another thread.
            #This ensures that the event loop is not blocked while sync work is happening in the threadpool thread.
            for conn in connections[timeline_id]:
                await conn.send_text(json.dump({
                    "id":db_accurate_dump.id,
                    "user_id":db_accurate_dump.user_id,
                    "dump":db_accurate_dump.text,
                    "created_at":dumpData["created_at"]

                }))
    except Exception as e:
        print("WS ERROR:", type(e), e, flush=True)
        connections[timeline_id].remove(ws)
        if connections[timeline_id] == []:
            del connections[timeline_id]
 
        log_connections()




