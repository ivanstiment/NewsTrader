# NewsTrader

Aplicación web para visualizar noticias y análisis de sentimiento relacionado con información bursátil.

## Características

*   Backend desarrollado con Django y Django REST Framework.
*   Frontend desarrollado con React y Vite.
*   Análisis de sentimiento de texto utilizando librerías de NLP (NLTK, transformers).
*   Gestión y visualización de noticias.
*   Obtención y visualización de datos históricos de precios de acciones.
*   Uso de Celery y Redis para tareas asíncronas o en segundo plano.
*   Configuración de CI/CD con GitHub Actions para Django y despliegue en Azure Web Apps.

## Tecnologías Utilizadas

**Backend:**

*   Python
*   Django
*   Django REST Framework
*   Celery
*   Redis
*   pandas
*   numpy
*   NLTK
*   transformers
*   torch

**Frontend:**

*   JavaScript
*   Vite
*   React

## Estructura del Proyecto

*   `sentiment_analysis/`: Contiene la lógica para el análisis de sentimiento.
*   `news/`: Contiene la aplicación Django para la gestión y visualización de noticias.
*   `client/`: Contiene el código fuente del frontend.
*   `.github/workflows/`: Archivos de configuración para GitHub Actions (CI/CD).
*   `requirements.txt`: Dependencias de Python.
*   `package.json`: Dependencias de Node.js para el frontend.

## Configuración e Instalación

Sigue estos pasos para configurar y ejecutar el proyecto localmente.

### Prerrequisitos

*   Python 3.x
*   pip (administrador de paquetes de Python)
*   Node.js y npm/yarn/pnpm (administrador de paquetes de Node.js)
*   Redis server (necesario para Celery)

### Backend

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/ivanstiment/NewsTrader.git
    cd newstrader
    ```
2.  Crea un entorno virtual (recomendado):
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
    ```
3.  Instala las dependencias de Python:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configura la base de datos (si aplica, por defecto Django usa SQLite):
    ```bash
    python manage.py migrate
    ```
5.  (Opcional) Carga datos iniciales o crea un superusuario:
    ```bash
    python manage.py createsuperuser
    ```

### Frontend

1.  Navega al directorio del cliente:
    ```bash
    cd client
    ```
2.  Instala las dependencias de Node.js (usa npm, yarn o pnpm según prefieras):
    ```bash
    npm install
    # o yarn install
    # o pnpm install
    ```

## Ejecución del Proyecto

### Backend

1.  Asegúrate de estar en el directorio raíz del proyecto.
2.  Inicia el servidor de desarrollo de Django:
    ```bash
    python manage.py runserver
    ```
    El backend estará disponible en `http://localhost:8000/`.

3.  Inicia el worker de Celery (en otra terminal):
    ```bash
    celery -A news_trader worker --loglevel=info --events -P eventlet

    ```

### Frontend

1.  Asegúrate de estar en el directorio `client/`.
2.  Inicia el servidor de desarrollo de Vite:
    ```bash
    npm run dev
    # o yarn dev
    # o pnpm dev
    ```
    El frontend estará disponible en `http://localhost:5173/` (o el puerto que configure Vite).

## CI/CD

El proyecto incluye flujos de trabajo de GitHub Actions en el directorio `.github/workflows/` para:

*   `django.yml`: Ejecutar tests y linting para el backend Django.
*   `azure-webapps-python.yml`: Desplegar la aplicación Python en Azure Web Apps.

Consulta estos archivos para más detalles sobre la configuración y los triggers.