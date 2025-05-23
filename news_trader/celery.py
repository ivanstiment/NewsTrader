import os
from celery import Celery

# Definir variable de entorno para Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "news_trader.settings")

# Crear la instancia de Celery con el nombre de tu proyecto
app = Celery(
    "news_trader", broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
)

# Leer configuración desde Django settings, todas las claves CELERY_*
app.config_from_object("django.conf:settings", namespace="CELERY")

# Autodiscover de tareas en todas las INSTALLED_APPS
app.autodiscover_tasks()
