#!/bin/bash
set -e

echo "PWD: $(pwd)"

echo "Arrancando Gunicorn y Celery..."

# Lanza Gunicorn (web) en background
gunicorn news_trader.wsgi:application --bind=0.0.0.0:8000 &

# Lanza Celery worker (usa el venv actual, Oryx ya lo activó)
celery -A news_trader worker --loglevel=INFO