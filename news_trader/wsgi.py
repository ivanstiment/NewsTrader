"""
WSGI config for news_trader project.
"""

import os

from django.core.wsgi import get_wsgi_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "news_trader.settings")

application = get_wsgi_application()
