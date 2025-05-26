<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ivanstiment/NewsTrader">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">client</h3>

  <p align="center">
    Descripción del proyecto
    <br />
    <a href="https://github.com/ivanstiment/NewsTrader"><strong>Explorar documentación »</strong></a>
    <br />
    <br />
    <a href="https://salmon-stone-0e4a4f410.6.azurestaticapps.net/">Ver Demo</a>
    ·
    <a href="https://github.com/ivanstiment/NewsTrader/issues">Reportar Bug</a>
    ·
    <a href="https://github.com/ivanstiment/NewsTrader/issues">Solicitar Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de Contenidos</summary>
  <ol>
    <li>
      <a href="#acerca-del-proyecto">Acerca del Proyecto</a>
      <ul>
        <li><a href="#construido-con">Construido Con</a></li>
      </ul>
    </li>
    <li>
      <a href="#comenzando">Comenzando</a>
      <ul>
        <li><a href="#prerequisitos">Prerequisitos</a></li>
        <li><a href="#instalación">Instalación</a></li>
      </ul>
    </li>
    <li><a href="#uso">Uso</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contribuir">Contribuir</a></li>
    <li><a href="#licencia">Licencia</a></li>
    <li><a href="#contacto">Contacto</a></li>
    <li><a href="#reconocimientos">Reconocimientos</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## Acerca del Proyecto

[![Captura del Producto][product-screenshot]](https://salmon-stone-0e4a4f410.6.azurestaticapps.net/)

Descripción del proyecto

Aquí encontrarás información sobre este proyecto desarrollado con las siguientes tecnologías:

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

### Construido Con

Este proyecto fue desarrollado utilizando las siguientes tecnologías principales:

* [React.js](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [Axios](https://axios-http.com/)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

<!-- GETTING STARTED -->
## Comenzando

Para obtener una copia local funcionando, sigue estos pasos simples.

### Prerequisitos

Lista de software necesario y cómo instalarlo.

**Backend (Django):**
* Python 3.8+
  ```sh
  python --version
  ```
* pip
  ```sh
  pip install --upgrade pip
  ```

**Frontend (React + Vite):**
* Node.js 16+
  ```sh
  node --version
  ```
* npm
  ```sh
  npm install npm@latest -g
  ```

### Instalación

1. Clona el repositorio
   ```sh
   git clone https://github.com/ivanstiment/NewsTrader.git
   cd NewsTrader
   ```

2. **Configuración del Backend (Django):**
   ```sh
   # Crear entorno virtual
   python -m venv venv
   
   # Activar entorno virtual
   # En Windows:
   venv\Scripts\activate
   # En macOS/Linux:
   source venv/bin/activate
   
   # Instalar dependencias
   pip install -r requirements.txt
   
   # Realizar migraciones
   python manage.py migrate
   
   # Crear superusuario (opcional)
   python manage.py createsuperuser
   ```

3. **Configuración del Frontend (React + Vite):**
   ```sh
   cd client
   
   # Instalar dependencias
   npm install
   ```

4. **Variables de entorno:**
   ```sh
   # Crear archivo .env en la raíz del proyecto
   cp .env.example .env
   
   # Editar .env con tus configuraciones
   # DATABASE_URL=tu_base_de_datos
   # SECRET_KEY=tu_clave_secreta
   # DEBUG=True
   ```

5. **Ejecutar el proyecto:**
   
   **Terminal 1 - Backend (Django):**
   ```sh
   python manage.py runserver
   ```
   
   **Terminal 2 - Frontend (React + Vite):**
   ```sh
   cd client
   npm run dev
   ```

El backend estará disponible en `http://localhost:8000`
El frontend estará disponible en `http://localhost:5173`

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

<!-- USAGE EXAMPLES -->
## Uso

### API Endpoints

El backend de Django proporciona una API REST. Algunos endpoints principales:

```
GET  /api/                    # Documentación de la API
POST /api/auth/login/         # Login de usuario
GET  /api/users/              # Lista de usuarios
```

### Interfaz de Usuario

La aplicación React proporciona una interfaz moderna y responsiva. Navega a `http://localhost:5173` para ver la aplicación en funcionamiento.

### Panel de Administración

Django incluye un panel de administración automático:
- URL: `http://localhost:8000/admin/`
- Usa las credenciales del superusuario creado durante la instalación

_Para más ejemplos, por favor consulta la [Documentación](https://github.com/ivanstiment/NewsTrader)_

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Configurar Django REST Framework
- [x] Integrar React con Vite
- [x] Configurar autenticación
- [ ] Añadir tests unitarios (Django + React)
- [ ] Implementar CI/CD
- [ ] Dockerizar la aplicación
- [ ] Añadir documentación de API con Swagger
- [ ] Soporte para notificaciones en tiempo real
- [ ] Optimización de rendimiento

Ve los [issues abiertos](https://github.com/ivanstiment/NewsTrader/issues) para una lista completa de características propuestas (y problemas conocidos).

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

<!-- CONTRIBUTING -->
## Contribuir

Las contribuciones son lo que hacen a la comunidad open source un lugar increíble para aprender, inspirar y crear. Cualquier contribución que hagas es **muy apreciada**.

Si tienes una sugerencia que podría mejorar esto, por favor haz fork del repositorio y crea un pull request. También puedes simplemente abrir un issue con la etiqueta "enhancement".
¡No olvides darle una estrella al proyecto! Gracias de nuevo.

1. Haz Fork del Proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus Cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

<!-- LICENSE -->
## Licencia

Distribuido bajo la Licencia MIT. Ve `LICENSE.txt` para más información.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

<!-- CONTACT -->
## Contacto

Iván Soto - [@tu_twitter](https://twitter.com/tu_twitter) - email@ejemplo.com

Link del Proyecto: [https://github.com/ivanstiment/NewsTrader](https://github.com/ivanstiment/NewsTrader)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Reconocimientos

Utiliza este espacio para listar recursos que encuentres útiles y a los que te gustaría dar crédito. ¡He incluido algunos de mis favoritos para comenzar!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/ivanstiment/NewsTrader.svg?style=for-the-badge
[contributors-url]: https://github.com/ivanstiment/NewsTrader/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ivanstiment/NewsTrader.svg?style=for-the-badge
[forks-url]: https://github.com/ivanstiment/NewsTrader/network/members
[stars-shield]: https://img.shields.io/github/stars/ivanstiment/NewsTrader.svg?style=for-the-badge
[stars-url]: https://github.com/ivanstiment/NewsTrader/stargazers
[issues-shield]: https://img.shields.io/github/issues/ivanstiment/NewsTrader.svg?style=for-the-badge
[issues-url]: https://github.com/ivanstiment/NewsTrader/issues
[license-shield]: https://img.shields.io/github/license/ivanstiment/NewsTrader.svg?style=for-the-badge
[license-url]: https://github.com/ivanstiment/NewsTrader/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/tu-perfil
[product-screenshot]: images/screenshot.png
