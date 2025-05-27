"""
Vistas del módulo de autenticación.

Este paquete contiene todas las vistas HTTP organizadas por funcionalidad:

- login_views: Login, refresh, verificación y logout
- register_views: Registro de usuarios y validaciones
- utility_views: CSRF, health check y utilidades

Importa todas las vistas necesarias para facilitar su uso en urls.py
"""

# Login y gestión de tokens
from .login_views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    verify_token,
    logout_user,
)

# Registro de usuarios
from .register_views import (
    register_user,
    validate_registration_data,
    check_username_availability,
)

# Utilidades
from .utility_views import get_csrf_token, health_check, auth_config

# Importar utilidades de debug solo en desarrollo
from django.conf import settings

if not settings.IS_PRODUCTION:
    from .utility_views import debug_cookies, debug_request_data

__all__ = [
    # Vistas principales de autenticación
    "CustomTokenObtainPairView",
    "CustomTokenRefreshView",
    "verify_token",
    "logout_user",
    # Vistas de registro
    "register_user",
    "validate_registration_data",
    "check_username_availability",
    # Vistas utilitarias
    "get_csrf_token",
    "health_check",
    "auth_config",
]

# Agregar vistas de debug solo en desarrollo
if not settings.IS_PRODUCTION:
    __all__.extend(["debug_cookies", "debug_request_data"])
