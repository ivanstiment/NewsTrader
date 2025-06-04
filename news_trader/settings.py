#
# NewsTrader - Sistema automatizado de monitoreo y análisis de noticias
# Copyright 2025 Iván Soto Cobos
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

"""
Django settings for news_trader project.
"""

import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# -------------------------------
# 🔐 Seguridad y configuración básica
# -------------------------------
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-tq&z7$*sz9k^^4^b@_43c3ggo=lvrswuui2g@fjuy!1q%p006$",
)

# 🎯 Detectar entorno automáticamente
DEBUG = os.environ.get("DEBUG", "False").lower() in ("true", "1", "yes")
IS_PRODUCTION = os.environ.get("ENVIRONMENT", "development") == "production" or not DEBUG

print(f"🔧 Django inicializandose: DEBUG={DEBUG}, IS_PRODUCTION={IS_PRODUCTION}")
print(f"🌍 Entorno detectado: {'PRODUCCIÓN' if IS_PRODUCTION else 'DESARROLLO'}")

if IS_PRODUCTION:
    ALLOWED_HOSTS = [
        os.environ.get("WEBSITE_HOSTNAME"),
        "salmon-stone-0e4a4f410.6.azurestaticapps.net",
        ".azurewebsites.net",
        ".azurestaticapps.net",
        ".redis.cache.windows.net",
        "news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net"
    ] + [f"169.254.129.{i}" for i in range(1, 255)]
    print("ALLOWED_HOSTS:", ALLOWED_HOSTS)
    CSRF_COOKIE_SAMESITE = None
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = None
    SESSION_COOKIE_SECURE = True
    CORS_ALLOW_CREDENTIALS = True
    CORS_ORIGINS_WHITELIST = [
        os.environ.get("FRONTEND_URL"),
        os.environ.get("VITE_API_BASE_URL_PROD"),
        "https://salmon-stone-0e4a4f410.6.azurestaticapps.net",
        "https://*.azurewebsites.net",
        "https://*.azurestaticapps.net",
    ]
    print("CORS_ORIGINS_WHITELIST:", CORS_ORIGINS_WHITELIST)
    CORS_ALLOWED_ORIGINS = [
        os.environ.get("FRONTEND_URL"),
        "https://salmon-stone-0e4a4f410.6.azurestaticapps.net",
        "https://*.azurewebsites.net",
        "https://*.azurestaticapps.net",
    ]
    print("CORS_ALLOWED_ORIGINS:", CORS_ALLOWED_ORIGINS)
    CORS_ALLOW_HEADERS = [
        "accept",
        "content-type",
        "authorization",
        "x-csrftoken",
        "x-requested-with",
    ]
    print("CORS_ALLOW_HEADERS:", CORS_ALLOW_HEADERS)
    CSRF_TRUSTED_ORIGINS = [
        os.environ.get("FRONTEND_URL"),
        "https://salmon-stone-0e4a4f410.6.azurestaticapps.net",
    ] + [
        os.environ.get("FRONTEND_URL"),
        os.environ.get("VITE_API_BASE_URL_PROD"),
    ]
    print("CSRF_TRUSTED_ORIGINS:", CSRF_TRUSTED_ORIGINS)
    CSRF_ALLOWED_ORIGINS = [
        os.environ.get("FRONTEND_URL"),
        "https://salmon-stone-0e4a4f410.6.azurestaticapps.net",
        "https://*.azurewebsites.net",
        "https://*.azurestaticapps.net",
    ] + [
        os.environ.get("FRONTEND_URL"),
        os.environ.get("VITE_API_BASE_URL_PROD"),
    ]
    print("CSRF_ALLOWED_ORIGINS:", CSRF_ALLOWED_ORIGINS)
    CSRF_COOKIE_HTTPONLY = False
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
else:
    CSRF_COOKIE_SAMESITE = "Lax"
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False
    ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]
    CSRF_TRUSTED_ORIGINS = ["http://localhost:5173"]

# -------------------------------
# 🚦 Middleware y apps
# -------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    
    # Third-party ANTES de apps personalizadas
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "drf_spectacular",
    
    # Apps personalizadas AL FINAL
    "authentication.apps.AuthenticationConfig",
    "news.apps.NewsConfig",
    "sentiment_analysis.apps.SentimentAnalysisConfig",
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

# -------------------------------
# 🧠 Configuración de la base de datos
# Database (SQLite local / PostgreSQL en producción)
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
# -------------------------------
if IS_PRODUCTION:
    REQUIRED_ENV_VARS = ["DBNAME", "DBUSER", "DBPASS", "DBHOST"]
    missing = [var for var in REQUIRED_ENV_VARS if not os.environ.get(var)]
    if missing:
        raise RuntimeError(f"❌ Faltan variables de entorno: {missing}")

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ["DBNAME"],
            "USER": os.environ["DBUSER"],
            "PASSWORD": os.environ["DBPASS"],
            "HOST": os.environ["DBHOST"],
            "OPTIONS": {"sslmode": "require"},
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

ROOT_URLCONF = "news_trader.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "news_trader.wsgi.application"

# -------------------------------
# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
# -------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# -------------------------------
# 🌍 Internacionalización
# https://docs.djangoproject.com/en/5.2/topics/i18n/
# -------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# -------------------------------
# 🔗 CORS
# -------------------------------
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ["Content-Type", "X-CSRFToken"]

# -------------------------------
# ⚙️ Archivos estáticos (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/
# -------------------------------
STATIC_URL = "/static/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# 🔄 Para Azure App Service - usar ManifestStaticFilesStorage
if IS_PRODUCTION:
    STATICFILES_STORAGE = (
        "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"
    )
else:
    STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"

# 📂 Finders para recolectar archivos estáticos de diferentes fuentes
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

# -------------------------------
# 🔐 JWT y DRF
# -------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SIMPLE_JWT = {
    "BLACKLIST_AFTER_ROTATION": True,
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_COOKIE": "refresh_token",
    "AUTH_COOKIE_HTTP_ONLY": True,
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=2),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

# -------------------------------
# 🧵 Celery
# -------------------------------
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.environ.get(
    "CELERY_RESULT_BACKEND", "redis://localhost:6379/1"
)
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
