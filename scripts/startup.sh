#!/bin/bash
set -e
echo "Arrancando Gunicorn y Celery..."
# Arranca Gunicorn en segundo plano
gunicorn news_trader.wsgi:application --bind=0.0.0.0:8000 &
# Arranca Celery
celery -A news_trader worker --loglevel=INFO