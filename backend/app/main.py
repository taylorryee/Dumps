# main.py
from fastapi import FastAPI, Depends
from app.db import SessionLocal
from app.routes.dumpRoutes import router as dumpRouter
app = FastAPI()

app.include_router(dumpRouter)
