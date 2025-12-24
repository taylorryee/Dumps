# main.py
from fastapi import FastAPI, Depends
from app.db import SessionLocal
from app.routes.dumpRoutes import router as dumpRouter
from app.routes.userRoutes import router as userRouter
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


#this is frontend host that is allowed to talk with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(dumpRouter)
app.include_router(userRouter)
@app.get("/ping")
def ping():
    return {"message": "backend is alive"}



