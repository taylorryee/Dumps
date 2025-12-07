from celery import Celery


celery_app = Celery(
    "brain_dump",
    broker="redis://redis:6379/0",#This tells Celery where your task queue lives (Redis)
    backend="redis://redis:6379/1"  # optional, for storing results
)




celery_app.autodiscover_tasks(['app'])

