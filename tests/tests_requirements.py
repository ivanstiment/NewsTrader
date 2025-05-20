"""
Módulo de Pruebas de Dependencias Ampliado

Este archivo contiene pruebas automatizadas para asegurar que todas las
librerías requeridas por el proyecto estén correctamente instaladas y
funcionan en su forma básica.
"""

import importlib

# Lista de paquetes a probar junto con una prueba básica por paquete
DEPENDENCIES = {
    "asgiref": lambda: importlib.import_module("asgiref") and print("✅ asgiref importado"),
    "beautifulsoup4": lambda: importlib.import_module("bs4") and print("✅ beautifulsoup4 importado"),
    "blinker": lambda: importlib.import_module("blinker") and print("✅ blinker importado"),
    "certifi": lambda: importlib.import_module("certifi") and print("✅ certifi importado"),
    "charset-normalizer": lambda: importlib.import_module("charset_normalizer") and print("✅ charset-normalizer importado"),
    "click": lambda: importlib.import_module("click") and print("✅ click importado"),
    "colorama": lambda: importlib.import_module("colorama") and print("✅ colorama importado"),
    "Django": lambda: importlib.import_module("django") and print("✅ Django importado"),
    "django-cors-headers": lambda: importlib.import_module("corsheaders") and print("✅ django-cors-headers importado"),
    "django-environ": lambda: importlib.import_module("environ") and print("✅ django-environ importado"),
    "django_celery_results": lambda: importlib.import_module("django_celery_results") and print("✅ django_celery_results importado"),
    "djangorestframework": lambda: importlib.import_module("rest_framework") and print("✅ djangorestframework importado"),
    "djangorestframework_simplejwt": lambda: importlib.import_module("rest_framework_simplejwt") and print("✅ simplejwt importado"),
    "et_xmlfile": lambda: importlib.import_module("et_xmlfile") and print("✅ et_xmlfile importado"),
    "Flask": lambda: importlib.import_module("flask") and print("✅ Flask importado"),
    "frozendict": lambda: importlib.import_module("frozendict") and print("✅ frozendict importado"),
    "idna": lambda: importlib.import_module("idna") and print("✅ idna importado"),
    "itsdangerous": lambda: importlib.import_module("itsdangerous") and print("✅ itsdangerous importado"),
    "Jinja2": lambda: importlib.import_module("jinja2") and print("✅ Jinja2 importado"),
    "joblib": lambda: importlib.import_module("joblib") and print("✅ joblib importado"),
    "MarkupSafe": lambda: importlib.import_module("markupsafe") and print("✅ MarkupSafe importado"),
    "multitasking": lambda: importlib.import_module("multitasking") and print("✅ multitasking importado"),
    "nltk": lambda: importlib.import_module("nltk") and print("✅ nltk importado"),
    "numpy": lambda: importlib.import_module("numpy") and print("✅ numpy importado"),
    "openpyxl": lambda: importlib.import_module("openpyxl") and print("✅ openpyxl importado"),
    "pandas": lambda: importlib.import_module("pandas") and print("✅ pandas importado"),
    "peewee": lambda: importlib.import_module("peewee") and print("✅ peewee importado"),
    "platformdirs": lambda: importlib.import_module("platformdirs") and print("✅ platformdirs importado"),
    "python-dateutil": lambda: importlib.import_module("dateutil") and print("✅ python-dateutil importado"),
    "pytz": lambda: importlib.import_module("pytz") and print("✅ pytz importado"),
    "regex": lambda: importlib.import_module("regex") and print("✅ regex importado"),
    "requests": lambda: importlib.import_module("requests") and print("✅ requests importado"),
    "setuptools": lambda: importlib.import_module("setuptools") and print("✅ setuptools importado"),
    "six": lambda: importlib.import_module("six") and print("✅ six importado"),
    "soupsieve": lambda: importlib.import_module("soupsieve") and print("✅ soupsieve importado"),
    "sqlparse": lambda: importlib.import_module("sqlparse") and print("✅ sqlparse importado"),
    "tqdm": lambda: importlib.import_module("tqdm") and print("✅ tqdm importado"),
    "typing_extensions": lambda: importlib.import_module("typing_extensions") and print("✅ typing_extensions importado"),
    "tzdata": lambda: importlib.import_module("tzdata") and print("✅ tzdata importado"),
    "urllib3": lambda: importlib.import_module("urllib3") and print("✅ urllib3 importado"),
    "vaderSentiment": lambda: importlib.import_module("vaderSentiment") and print("✅ vaderSentiment importado"),
    "Werkzeug": lambda: importlib.import_module("werkzeug") and print("✅ Werkzeug importado"),
    "yfinance": lambda: importlib.import_module("yfinance") and print("✅ yfinance importado"),
    "transformers": lambda: importlib.import_module("transformers") and print("✅ transformers importado"),
    "torch": lambda: importlib.import_module("torch") and print("✅ torch importado"),
    "celery": lambda: importlib.import_module("celery") and print("✅ celery importado"),
    "redis": lambda: importlib.import_module("redis") and print("✅ redis importado"),
    "gunicorn": lambda: importlib.import_module("gunicorn") and print("✅ gunicorn importado"),
}

def run_dependency_tests():
    print("\n🔍 Iniciando pruebas de dependencias...\n")
    for name, test_func in DEPENDENCIES.items():
        try:
            test_func()
        except Exception as e:
            print(f"❌ Error en {name}: {e}")

if __name__ == "__main__":
    run_dependency_tests()
