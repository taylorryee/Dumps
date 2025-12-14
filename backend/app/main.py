# main.py
from fastapi import FastAPI, Depends
from app.db import SessionLocal
from app.routes.dumpRoutes import router as dumpRouter
from app.routes.userRoutes import router as userRouter
from fastapi.openapi.models import APIKey
from fastapi.openapi.models import APIKeyIn
from fastapi.security import APIKeyHeader
app = FastAPI()

app.include_router(dumpRouter)
app.include_router(userRouter)


