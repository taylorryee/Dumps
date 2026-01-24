#!/bin/sh
celery -A app.celery_app.celery_app worker --beat --loglevel=INFO




