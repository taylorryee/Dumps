#!/bin/sh
set -e

echo "Waiting for Postgres..."

while ! nc -z $DB_HOST $DB_PORT; do #this ensures that we are connected to DB before starting fastapi
    sleep 1
done

echo "Postgres is up."

alembic upgrade head

exec uvicorn app.main:app --host 0.0.0.0 --port 8000 

