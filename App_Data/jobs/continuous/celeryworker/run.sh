#!/bin/bash
source /home/site/wwwroot/antenv/bin/activate
echo "Arrancando Celery Worker"
celery -A news_trader worker --loglevel=INFO