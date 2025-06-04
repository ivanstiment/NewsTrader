#!/bin/bash

echo "🔧 Django Post-Build Script"
echo "📍 Working directory: $(pwd)"
echo "🕒 Date: $(date)"

# 📋 Verificar entorno Python
echo "🐍 Python version: $(python --version)" || { echo "❌ Python no disponible"; exit 1; }

# ⚙️ Verificación de settings
DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE:-news_trader.settings}
export DJANGO_SETTINGS_MODULE
echo -e "\n⚙️ Usando configuración: $DJANGO_SETTINGS_MODULE"

# 🔗 Verificación de base de datos
# echo -e "\n🔎 Probando conexión a la base de datos..."
# python -c "
# import os
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', '$DJANGO_SETTINGS_MODULE')
# import django
# django.setup()
# from django.db import connection
# try:
#     with connection.cursor() as cursor:
#         cursor.execute('SELECT 1')
#         print('✅ Conexión a la base de datos exitosa')
# except Exception as e:
#     print(f'❌ ERROR de conexión a la base de datos: {e}')
# "

# 🧪 Test básico de import ANTES de hacer nada
echo "🧪 Test de importar Django..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', '$DJANGO_SETTINGS_MODULE')
try:
    import django
    django.setup()
    print('✅ Django importado correctamente')
except Exception as e:
    print(f'❌ Fallo al importar Django: {e}')
    exit(1)
" || { echo "❌ Fallo al hacer test importando Django"; exit 1; }

# 🛠️ Migraciones
echo -e "\n📦 Aplicando migraciones..."
python manage.py migrate --noinput || { echo '❌ Fallo al aplicar migraciones'; exit 1; }

# 🎨 RECOLECTAR ARCHIVOS ESTÁTICOS (CRÍTICO)
echo -e "\n🎨 Recolectando archivos estáticos..."
python manage.py collectstatic --noinput --clear || { echo '❌ Fallo en collectstatic'; exit 1; }


# ✅ Comprobación de seguridad
echo -e "\n🛡️ Ejecutando chequeo de despliegue seguro..."
python manage.py check --deploy --fail-level ERROR || { echo '❌ Fallo en check --deploy'; exit 1; }

# ✅ Ejecutar tests (si tienes definidos)
echo -e "\n🧪 Ejecutando pruebas automáticas..."
python manage.py test || { echo '❌ Fallo en pruebas automáticas'; exit 1; }

echo -e "\n✅ Post-build completado correctamente."