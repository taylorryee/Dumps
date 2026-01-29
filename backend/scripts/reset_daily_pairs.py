from app.db import SessionLocal
from sqlalchemy import text

def reset_daily_pairs():
    print("Executing nigga 1")
    db = SessionLocal()
    print("Db nigga exectued")
    try:
        print("bouta start da execute")
        db.execute(text("TRUNCATE TABLE daily_pairs RESTART IDENTITY"))
        print("yesir")

        db.commit()
        print("commited omg")
    finally:

        db.close()
        print("dbbb")

if __name__=="__main__":
    reset_daily_pairs()