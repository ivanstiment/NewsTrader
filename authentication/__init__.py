"""
Módulo de Autenticación - News Trader Backend

Este módulo maneja toda la lógica de autenticación del sistema:
- Login y logout de usuarios
- Gestión de tokens JWT (access + refresh)
- Registro de nuevos usuarios
- Validación de tokens y sesiones
- Manejo de cookies seguras
- Protección CSRF

Arquitectura:
- views/: Controladores HTTP separados por funcionalidad
- services/: Lógica de negocio y servicios externos
- serializers.py: Serialización de datos
- constants.py: Constantes del módulo
- urls.py: Configuración de rutas
"""

__version__ = "1.0.0"
__author__ = "News Trader Team"
