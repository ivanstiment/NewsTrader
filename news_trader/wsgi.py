"""
WSGI config for news_trader project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application



if 'WEBSITE_HOSTNAME' in os.environ:
    print(os.environ["WEBSITE_HOSTNAME"])
    settings_module = "news_trader.deployment"
else:
    settings_module = "news_trader.settings"
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)
print("✅ DJANGO_SETTINGS_MODULE =", os.environ.get("DJANGO_SETTINGS_MODULE"))

application = get_wsgi_application()
