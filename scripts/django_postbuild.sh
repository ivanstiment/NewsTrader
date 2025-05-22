#!/bin/bash

echo "🔧 Django Post-Build Script"
# echo "📍 Working directory: $(pwd)"
# echo "🕒 Date: $(date)"
# echo "🐍 Python version: $(python --version)"

# # ⚙️ Verificación de settings
# DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE:-news_trader.settings}
# export DJANGO_SETTINGS_MODULE
# echo -e "\n⚙️ Usando configuración: $DJANGO_SETTINGS_MODULE"

# # 🔗 Verificación de base de datos
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

# 🛠️ Aplicar migraciones
# echo -e "\n📦 Aplicando migraciones..."
# python manage.py migrate --noinput || { echo '❌ Fallo al aplicar migraciones'; exit 1; }

# 🛠️ Volcar los datos de la base de datos sqlite a la base de datos postgres
# echo -e "\n📦 Aplicando los datos de la base de datos sqlite auth_user... "
# python manage.py loaddata fixtures/auth_user.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# echo -e "\n📦 Aplicando los datos de la base de datos sqlite admin_logentry..."
# python manage.py loaddata fixtures/admin_logentry.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }
# -----------------

echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_new_001..."
python manage.py loaddata fixtures/news_new_001.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_new_002..."
# python manage.py loaddata fixtures/news_new_002.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_new_003..."
# python manage.py loaddata fixtures/news_new_003.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_new_004..."
# python manage.py loaddata fixtures/news_new_004.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_new_005..."
# python manage.py loaddata fixtures/news_new_005.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_new_006..."
# python manage.py loaddata fixtures/news_new_006.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_newsanalysis..."
# python manage.py loaddata fixtures/news_newsanalysis.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_stock..."
# python manage.py loaddata fixtures/news_stock.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# echo -e "\n📦 Aplicando los datos de la base de datos sqlite sessions_session..."
# python manage.py loaddata fixtures/sessions_session.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_historicalprice_001..."
# python manage.py loaddata fixtures/news_historicalprice_001.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }
# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_historicalprice_002..."
# python manage.py loaddata fixtures/news_historicalprice_002.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }
# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_historicalprice_003..."
# python manage.py loaddata fixtures/news_historicalprice_003.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }
# echo -e "\n📦 Aplicando los datos de la base de datos sqlite news_historicalprice_004..."
# python manage.py loaddata fixtures/news_historicalprice_004.json || { echo '❌ Fallo al cargar los datos de la base de datos sqlite'; exit 1; }

# ✅ Comprobación de seguridad
echo -e "\n🛡️ Ejecutando chequeo de despliegue seguro..."
python manage.py check --deploy --fail-level ERROR || { echo '❌ Fallo en check --deploy'; exit 1; }

# ✅ Ejecutar tests (si tienes definidos)
echo -e "\n🧪 Ejecutando pruebas automáticas..."
python manage.py test || { echo '❌ Fallo en pruebas automáticas'; exit 1; }

echo -e "\n✅ Post-build completado correctamente."