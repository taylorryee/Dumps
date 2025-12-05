# main.py
from fastapi import FastAPI, Depends
from backend.db import SessionLocal
from backend.routes.dumpRoutes import router as dumpRouter
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/test-db")
def test_db(db = Depends(get_db)):
    return {"message": "DB connected!"}

app.include_router(dumpRouter)
