![Logo](images/logo.png)

# NewsTrader
**Sistema automatizado de monitoreo y análisis de noticias para trading de small caps en tiempo real**

[![Explorar documentación »](https://img.shields.io/badge/Docs-Explorar-blue?style=for-the-badge)](https://ivanstiment.github.io/NewsTrader/)
[![Ver Demo](https://img.shields.io/badge/Demo-Ver%20Live-success?style=for-the-badge)](https://salmon-stone-0e4a4f410.6.azurestaticapps.net/)
[![Reportar Bug](https://img.shields.io/badge/Bug-Reportar-red?style=for-the-badge)](https://github.com/ivanstiment/NewsTrader/issues)
[![Solicitar Feature](https://img.shields.io/badge/Feature-Solicitar-yellow?style=for-the-badge)](https://github.com/ivanstiment/NewsTrader/issues)

---

## 📋 Tabla de Contenidos

- [Descripción del proyecto](#descripción-del-proyecto)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Características principales](#características-principales)
- [Instalación](#instalación)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Reconocimientos](#reconocimientos)

---

## 📖 Descripción del proyecto

NewsTrader es un sistema integral de análisis financiero especializado en **small caps** que combina:

🔍 **Extracción automatizada** de noticias financieras desde Yahoo Finance  
📊 **Análisis de sentimiento** utilizando diccionarios especializados Loughran-McDonald  
📈 **Visualización interactiva** con correlación noticia-precio mediante ApexCharts  
🤖 **Procesamiento asíncrono** con Celery y Redis para análisis en tiempo real  
🏗️ **Arquitectura cloud-native** desplegada en Microsoft Azure  

### 🎯 Objetivo Principal
Democratizar el acceso a análisis financiero de nivel profesional para trading de small caps, proporcionando herramientas tradicionalmente disponibles solo en terminales premium costosos como Bloomberg o Reuters.

### 📊 Métricas del Sistema
- **200** noticias financieras analizadas
- **20** stocks con información completa
- **1 año** de datos históricos diarios
- **Análisis de sentimiento automatizado** en tiempo real

---

## 🚀 Tecnologías utilizadas

### Backend
* ![Python](https://img.shields.io/badge/Python-3.13.3-blue?style=flat-square&logo=python) [Python 3.13.3](https://www.python.org/)
* ![Django](https://img.shields.io/badge/Django-5.2-green?style=flat-square&logo=django) [Django 5.2](https://www.djangoproject.com/)
* ![DRF](https://img.shields.io/badge/DRF-3.16.0-red?style=flat-square) [Django REST Framework 3.16.0](https://www.django-rest-framework.org/)
* ![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react) [React 19.0.0](https://reactjs.org/)
* ![Vite](https://img.shields.io/badge/Vite-6.3.1-yellow?style=flat-square&logo=vite) [Vite 6.3.1](https://vitejs.dev/)
* ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Azure-blue?style=flat-square&logo=postgresql) [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/)
* ![Redis](https://img.shields.io/badge/Redis-6.1.0-red?style=flat-square&logo=redis) [Redis 6.1.0](https://redis.io/)

### Frontend & Visualización
* ![Celery](https://img.shields.io/badge/Celery-5.5.2-green?style=flat-square) [Celery 5.5.2](https://docs.celeryq.dev/)
* ![ApexCharts](https://img.shields.io/badge/ApexCharts-4.7.0-orange?style=flat-square) [ApexCharts 4.7.0](https://apexcharts.com/)
* ![Axios](https://img.shields.io/badge/Axios-1.8.4-purple?style=flat-square) [Axios 1.8.4](https://axios-http.com/)
* ![JWT Decode](https://img.shields.io/badge/JWT%20Decode-4.0.0-orange?style=flat-square) [JWT Decode 4.0.0](https://github.com/auth0/jwt-decode)

### Cloud & Infrastructure
* ![Azure](https://img.shields.io/badge/Azure-Cloud-blue?style=flat-square&logo=microsoft-azure) [Microsoft Azure](https://azure.microsoft.com/)
* ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-black?style=flat-square&logo=github) [GitHub Actions](https://github.com/features/actions)

---

## ✨ Características principales

### 🔐 **Sistema de Autenticación Avanzado**
- Registro y login con validación robusta
- Autenticación JWT con tokens de acceso y refresh
- Gestión de sesiones seguras con blacklist de tokens

### 📰 **Análisis de Noticias Inteligente**
- Extracción automática desde Yahoo Finance
- Análisis de sentimiento especializado en terminología financiera
- Procesamiento asíncrono con Celery para análisis en tiempo real
- Estados visuales: Analizar → Analizando → Re-analizar

### 🔍 **Búsqueda de Stocks Avanzada**
- Filtrado inteligente por símbolo bursátil
- Validaciones multinivel con mensajes contextuales
- Catálogo visual de instrumentos disponibles

### 📊 **Terminal Financiero Completo**
- Métricas financieras de nivel Bloomberg
- Datos corporativos completos (balance, P&L, cash flow)
- Ratios de rentabilidad, liquidez y solvencia
- Enlaces contextuales a información oficial

### 📈 **Visualización Innovadora (Característica Estrella)**
- Gráficas interactivas con ApexCharts
- **Correlación visual única** entre noticias y movimientos de precios
- Candlestick charts profesionales con volumen sincronizado  
- Tooltips contextuales con información de noticias por fecha
- Navegación temporal flexible con zoom y pan

---

## 🛠️ Instalación

### Prerequisitos

**Backend (Django):**
- Python 3.8+
- pip actualizado

**Frontend (React + Vite):**
- Node.js 20.15.1
- npm 10.7.0

**Servicios adicionales:**
- Redis Server (para Celery)
- PostgreSQL (producción) / SQLite (desarrollo)

### Configuración paso a paso

1. **Clonar el repositorio**
  ```bash
  git clone https://github.com/ivanstiment/NewsTrader.git
  cd NewsTrader
  ```

2. **Configuración del Backend (Django)**
  ```bash
  # Crear entorno virtual
  python -m venv venv
  
  # Activar entorno virtual
  # Windows:
  venv\Scripts\activate
  # macOS/Linux:
  source venv/bin/activate
  
  # Instalar dependencias
  pip install -r requirements.txt
  
  # Realizar migraciones
  python manage.py migrate
  
  # Crear superusuario (opcional)
  python manage.py createsuperuser
  ```

3. **Configuración del Frontend (React + Vite)**
  ```bash
  cd client
  
  # Instalar dependencias
  npm install
  ```

4. **Variables de entorno**
  ```bash
  # Crear archivo .env en la raíz del proyecto
  cp .env.example .env
  
  # Configurar variables (ejemplo):
  # DATABASE_URL=tu_base_de_datos
  # SECRET_KEY=tu_clave_secreta_django
  # DEBUG=True
  # CELERY_BROKER_URL=redis://localhost:6379/0
  # CELERY_RESULT_BACKEND=redis://localhost:6379/0
  ```

5. **Ejecutar servicios**

  **Terminal 1 - Redis Server:**
  ```bash
  redis-server
  ```

  **Terminal 2 - Backend Django:**
  ```bash
  python manage.py runserver
  ```

  **Terminal 3 - Worker Celery:**
  ```bash
  celery -A news_trader worker --loglevel=info --events -P eventlet
  ```

  **Terminal 4 - Frontend React:**
  ```bash
  cd client
  npm run dev
  ```

### 🌐 URLs de acceso
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/
- **API Docs:** http://localhost:8000/api/docs/

---

## 💻 Uso

### 🎯 Flujo principal de usuario

1. **Registro/Login:** Sistema de autenticación con validación robusta
2. **Dashboard de Noticias:** Listado con análisis de sentimiento automático
3. **Búsqueda de Stocks:** Filtrado inteligente por símbolo bursátil  
4. **Análisis Detallado:** Terminal financiero con métricas completas
5. **Visualización Avanzada:** Gráficas con correlación noticia-precio

### 🔍 Análisis de Sentimiento
- **Automático:** Se ejecuta al cargar nuevas noticias
- **Manual:** Botón "Analizar" para análisis bajo demanda
- **Resultados:** POSITIVO/NEUTRAL/NEGATIVO con puntuación numérica

### 📊 Correlación Visual (Característica Única)
- Puntos amarillos indican días con noticias
- Tooltips muestran precios OHLCV + título de noticia
- Sincronización perfecta entre gráficas de precio y volumen
- Zoom temporal desde días individuales hasta meses completos

---

## 🔌 API Endpoints

La API REST está completamente documentada con OpenAPI 3.0:

### 🔑 Autenticación
```
POST /token/                    # Login (obtener tokens JWT)
POST /token/refresh/            # Renovar token de acceso
POST /logout/                   # Logout
POST /register/                 # Registro de usuario
```

### 📰 Noticias
```
GET  /news/                     # Listar noticias (con paginación)
GET  /news/{id}/                # Detalle de noticia
POST /news/{id}/analyze/        # Analizar sentimiento
```

### 📈 Stocks
```
GET  /stocks/                   # Listar stocks disponibles
GET  /stock/{symbol}/           # Detalle completo del stock
GET  /historical-price/{symbol}/ # Datos históricos de precios
```

### 📚 Documentación completa
- **Swagger UI:** [https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net/api/docs/](https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net/api/docs/)
- **Schema OpenAPI:** [https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net//api/schema/](https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net//api/schema/)

---

## ☁️ Despliegue

### Arquitectura en Azure

NewsTrader utiliza una arquitectura cloud-native en Microsoft Azure:

- **🌐 Frontend:** Azure Static Web Apps
- **⚡ Backend:** Azure App Service  
- **🗄️ Base de datos:** Azure Database for PostgreSQL
- **🔄 Cache:** Azure Cache for Redis
- **🔒 Red:** Virtual Network con endpoints privados
- **🚀 CI/CD:** GitHub Actions automatizado

### URLs de producción
- **🌟 Aplicación Live:** [https://salmon-stone-0e4a4f410.6.azurestaticapps.net/](https://salmon-stone-0e4a4f410.6.azurestaticapps.net/)
- **🔧 API Backend:** [https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net/](https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net/)
- **📖 Documentación:** [https://ivanstiment.github.io/NewsTrader/](https://ivanstiment.github.io/NewsTrader/)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas y muy apreciadas. Para contribuir:

1. **Fork** el proyecto
2. **Crea** tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### 🛣️ Roadmap futuro
- [ ] Sistema de alertas automatizadas
- [ ] Análisis predictivo con Machine Learning  
- [ ] Integración con brokers populares
- [ ] Aplicación móvil nativa
- [ ] Soporte para mercados internacionales
- [ ] Análisis de redes sociales (Twitter, Reddit)

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ve `LICENSE.txt` para más información.

---

## 📞 Contacto

**Iván Soto** - isotocos@uoc.edu

**🔗 Links del proyecto:**
- 🌟 **Demo Live:** [https://salmon-stone-0e4a4f410.6.azurestaticapps.net/](https://salmon-stone-0e4a4f410.6.azurestaticapps.net/)
- 📁 **Repositorio:** [https://github.com/ivanstiment/NewsTrader](https://github.com/ivanstiment/NewsTrader)
- 📖 **Documentación:** [https://ivanstiment.github.io/NewsTrader/](https://ivanstiment.github.io/NewsTrader/)
- 🔧 **API Docs:** [https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net/api/docs/](https://news-trader-django-azure-app-backend-aggfgbhrbyasaucd.spaincentral-01.azurewebsites.net/api/docs/)

---

## 🙏 Reconocimientos

Recursos y herramientas que hicieron posible este proyecto:

* [Yahoo Finance API](https://pypi.org/project/yfinance/) - Datos financieros
* [Loughran-McDonald Dictionary](https://sraf.nd.edu/textual-analysis/resources/) - Análisis de sentimiento financiero
* [ApexCharts](https://apexcharts.com/) - Visualizaciones interactivas
* [Django REST Framework](https://www.django-rest-framework.org/) - API REST robusta
* [Celery](https://docs.celeryq.dev/) - Procesamiento asíncrono
* [Microsoft Azure](https://azure.microsoft.com/) - Infraestructura cloud
* [GitHub Actions](https://github.com/features/actions) - CI/CD automatizado

---

<div align="center">

**⭐ Si este proyecto te resulta útil, considera darle una estrella ⭐**

[![Stargazers](https://img.shields.io/github/stars/ivanstiment/NewsTrader?style=social)](https://github.com/ivanstiment/NewsTrader/stargazers)
[![Follow](https://img.shields.io/github/followers/ivanstiment?style=social)](https://github.com/ivanstiment)

</div>
