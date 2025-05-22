import os
import sys
from .settings import *


print("🛠️  Cargando settings de despliegue...", file=sys.stderr)

REQUIRED_VARS = ["DJANGO_SECRET_KEY", "DBNAME", "DBUSER", "DBPASS", "DBHOST"]

missing = [v for v in REQUIRED_VARS if v not in os.environ]
if missing:
    raise RuntimeError(f"❌ Variables de entorno faltantes: {missing}")

# from .settings import BASE_DIR

# ALLOWED_HOSTS = [os.environ["WEBSITE_HOSTNAME"]]
ALLOWED_HOSTS = [
    "news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net",
    ".azurewebsites.net",
]

CSRF_TRUSTED_ORIGINS = [
    "https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net",
    "https://*.azurewebsites.net",
    "http://*.azurewebsites.net",
    "http://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net",
]
CSRF_ALLOWED_ORIGINS = [
    "https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net",
    "https://*.azurewebsites.net",
    "http://*.azurewebsites.net",
    "http://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net",
]
CORS_ORIGINS_WHITELIST = [
    "https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net",
    "https://*.azurewebsites.net",
    "http://*.azurewebsites.net",
    "http://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net",
]

print("⚙️  DB HOST:", os.environ["DBHOST"], file=sys.stderr)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "news.apps.NewsConfig",
    "sentiment_analysis.apps.SentimentAnalysisConfig",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "django_celery_results",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

DEBUG = True
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https,http")
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

STATIC_URL = "static/"

# CORS_ALLOWED_ORIGINS = [
# ]

# STORAGES = {
#     "default": {
#         "BACKEND": "django.core.files.storage.FileSystemStorage",
#     },
#     "staticfiles": {
#         "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
#     },
# }

STATICFILES_STORAGE = "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["DBNAME"],
        "HOST": os.environ["DBHOST"],
        "USER": os.environ["DBUSER"],
        "PASSWORD": os.environ["DBPASS"],
        "OPTIONS": {
            "sslmode": "require",
        },
    }
}

# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "handlers": {
#         "mail_admins": {
#             "level": "ERROR",
#             "class": "django.utils.log.AdminEmailHandler",
#         },
#     },
#     "loggers": {
#         "django": {
#             "handlers": ["mail_admins"],
#             "level": "ERROR",
#             "propagate": True,
#         },
#     },
# }


# ADMINS = [("Iván", "ivansostiment@gmail.com")]

# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST = "smtp.gmail.com"
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = os.environ.get("EMAIL_USER")
# EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_PASSWORD")
# DEFAULT_FROM_EMAIL = "default from email"

# STATIC_HOST = os.environ.get("WEBSITE_HOSTNAME")
# STATIC_URL = STATIC_HOST + "/static/"
# STATIC_ROOT = BASE_DIR/"staticfiles"

CELERY_BROKER_URL = os.environ["CELERY_BROKER_URL"]
CELERY_RESULT_BACKEND = os.environ["CELERY_RESULT_BACKEND"]
