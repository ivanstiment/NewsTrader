#!/bin/bash
set -e

echo "Verificando dependencias críticas..."
for pkg in django celery; do
  if ! python -c "import $pkg" &> /dev/null; then
    echo "❌ Dependencia faltante: $pkg"
    exit 1
  else
    echo "✅ Dependencia encontrada: $pkg"
  fi
done

echo "Aplicando migraciones de la base de datos..."
python manage.py migrate --noinput

echo "Recuperando archivos estáticos..."
python manage.py collectstatic --noinput

echo "Inicializando Gunicorn..."
gunicorn news_trader.wsgi:application \
    --bind=0.0.0.0:$PORT \
    --workers=4 \
    --timeout 600