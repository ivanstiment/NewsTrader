import os
from .settings import *
from .settings import BASE_DIR

print("loading deployment.py settings file...")

ALLOWED_HOSTS = [os.environ["WEBSITE_HOSTNAME"]]
CSRF_TRUSTED_ORIGINS = [
    "https://"+os.environ["WEBSITE_HOSTNAME"],
    "http://"+os.environ["WEBSITE_HOSTNAME"],
]
DEBUG = False
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

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

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["DBNAME"],
        "HOST": os.environ["DBHOST"],
        "USER": os.environ["DBUSER"],
        "PASSWORD": os.environ["DBPASS"],
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


CELERY_BROKER_URL = os.environ["CELERY_BROKER_URL"]
CELERY_RESULT_BACKEND = os.environ["CELERY_RESULT_BACKEND"]
