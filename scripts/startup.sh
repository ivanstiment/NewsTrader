#!/bin/bash
set -e

echo "Aplicando migraciones de la base de datos..."
python manage.py migrate --noinput

echo "Recuperando archivos estáticos..."
python manage.py collectstatic --noinput

echo "Inicializando Gunicorn..."
gunicorn news_trader.wsgi:application \
    --bind=0.0.0.0:$PORT \
    --workers=4 \
    --timeout 600