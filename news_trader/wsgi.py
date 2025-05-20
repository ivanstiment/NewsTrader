"""
WSGI config for news_trader project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

settings_module = (
    "news_trader.deployment"
    if "WEBSITE_HOSTNAME" in os.environ
    else "news_trader.settings"
)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

application = get_wsgi_application()
