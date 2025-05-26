# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# NewsTrader

![Logo](./docs/logo.png)

**NewsTrader** es una plataforma full-stack para leer, buscar y analizar noticias financieras en tiempo real y visualizar gráficos de precios históricos de acciones.

---

## 📑 Tabla de Contenidos

- [Demo](#demo)  
- [Características](#características)  
- [Tecnologías](#tecnologías)  
- [Arquitectura](#arquitectura)  
- [Instalación](#instalación)  
- [Uso](#uso)  
- [API](#api)  
- [Autenticación](#autenticación)  
- [Testing](#testing)  
- [Contribuir](#contribuir)  
- [Roadmap](#roadmap)  
- [Licencia](#licencia)  
- [Contacto](#contacto)  

---

## 🎥 Demo

![Captura principal](./docs/homepage.png)  
_Galería de vistas: noticias, login/register, gráficos candlestick._

---

## 🚀 Características

- **Listado de noticias** con título, fecha, editor y tipo.  
- **Búsqueda** por palabra clave o ticker relacionado.  
- **Autenticación JWT** con access & refresh tokens en HttpOnly cookies.  
- **Gráficos financieros** (velas y volumen) con ApexCharts.  
- **Panel lateral** reactivo con routing protegido.  

---

## 🛠 Tecnologías

- **Frontend**: React, React Router, Axios, React–ApexCharts, SCSS  
- **Backend**: Django 5.2, Django REST Framework, SimpleJWT  
- **Datos financieros**: yfinance (Python)  
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)  
- **Despliegue**: Azure Web App, GitHub Actions  

---

## 🏗 Arquitectura

news-trader/
├── backend/
│ ├── news_trader/ # Configuración Django
│ ├── news/ # Models, serializers, views, urls
│ └── commands/ # Fetch stock & historical data
└── frontend/
├── src/
│ ├── components/ # Login, Header, NavigationMenu, StockChart
│ ├── hooks/ # useAuth, useHistoricalPrice, useNewsByDate
│ ├── pages/ # Home, Login, Register, News, Stock, Search
│ └── api/ # axios config, news.api, stock.api
└── public/ # index.html, assets

---

## 💾 Instalación

### Requisitos

- Python
- Node.js y npm

### Backend

```bash
cd NewsTrader
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Frontend
```bash
cd NewsTrader/client
npm install
npm start
```
La aplicación estará disponible en http://localhost:3000 y la API en http://localhost:8000.

🖥 Uso
Regístrate o inicia sesión.

Navega a Noticias para leer y buscar.

Accede a Buscar y escribe un ticker (e.g. “MLGO”).

En la página de Stock, explora el gráfico candlestick y el volumen.

🔌 API
Método	Ruta	                        Descripción
POST	/api/token/	                    Obtención de access & refresh
POST	/api/token/refresh/	            Refrescar access token
GET	    /api/news/	                    Listar noticias (JWT required)
GET	    /api/stock/<symbol>/	        Detalle de stock
GET	    /api/historical-price/<symbol>/	Precios históricos
POST	/api/register/	                Creación de usuario

🔒 Autenticación
Access Token: expira en 2 horas.

Refresh Token: HttpOnly cookie, expira en 7 días.

Se maneja automáticamente con interceptores Axios para renovar credenciales.

🧪 Testing
```bash
cd backend
pytest
```

```bash
cd NewsTrader/client
npm test
```
🤝 Contribuir
Haz un fork del repositorio.

Crea una rama feature: git checkout -b feature/mi-nueva-funcionalidad.

Asegúrate de seguir el estilo de código (ESLint + Black).

Envía un pull request detallando cambios.

📈 Roadmap
 Soporte multilenguaje

 Charts con anotaciones interactivas

 Notificaciones en tiempo real

 Exportar informes (PDF/Excel)

📄 Licencia
UOC © 2025 — Iván Soto Cobos