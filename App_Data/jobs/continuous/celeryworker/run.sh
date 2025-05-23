#!/bin/bash
echo "Activando entorno virtual y ejecutando Celery..."
source /home/site/wwwroot/antenv/bin/activate
exec celery -A news_trader worker --loglevel=info