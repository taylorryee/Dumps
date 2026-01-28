from celery import Celery
from celery.schedules import crontab

celery_app = Celery(
    "brain_dump",
    broker="redis://redis:6379/0",#This tells Celery where your task queue lives (Redis)
    backend="redis://redis:6379/1"  # optional, for storing results
)



celery_app.conf.timezone = "UTC"
celery_app.conf.enable_utc = True

celery_app.conf.beat_schedule = {
    "pair-users-every-day": {
        "task": "app.worker.tasks.pair_users",
        "schedule": crontab(minute="*",hour="*"),  # midnight UTC
    },
}



from app.worker import tasks


