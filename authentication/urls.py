"""
URLs del módulo de autenticación.

Define todas las rutas HTTP para las operaciones de autenticación,
organizadas por funcionalidad y con nombres descriptivos.
"""

from django.urls import path
from django.conf import settings

from .views import (
    # Autenticación principal
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    verify_token,
    logout_user,
    # Registro de usuarios
    register_user,
    validate_registration_data,
    check_username_availability,
    # Utilidades
    get_csrf_token,
    health_check,
    auth_config,
)

# URLs principales de autenticación
urlpatterns = [
    # ========================
    # Autenticación de usuarios
    # ========================
    path("token/", CustomTokenObtainPairView.as_view(), name="auth_token_obtain"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="auth_token_refresh"),
    path("auth/verify/", verify_token, name="auth_verify_token"),
    path("auth/logout/", logout_user, name="auth_logout"),
    # ========================
    # Registro de usuarios
    # ========================
    path("register/", register_user, name="auth_register"),
    path(
        "register/validate/",
        validate_registration_data,
        name="auth_validate_registration",
    ),
    path(
        "register/check-username/",
        check_username_availability,
        name="auth_check_username",
    ),
    # ========================
    # Utilidades y configuración
    # ========================
    path("csrf/", get_csrf_token, name="auth_csrf_token"),
    path("health/", health_check, name="auth_health_check"),
    path("config/", auth_config, name="auth_config"),
]

# Agregar URLs de debug solo en desarrollo
if not settings.IS_PRODUCTION:
    from .views.utility_views import debug_cookies, debug_request_data

    debug_patterns = [
        # ========================
        # Endpoints de depuración (solo desarrollo)
        # ========================
        path("debug/cookies/", debug_cookies, name="auth_debug_cookies"),
        path("debug/request/", debug_request_data, name="auth_debug_request"),
    ]

    urlpatterns.extend(debug_patterns)

# Información de las rutas para documentación
"""
Rutas disponibles:

AUTENTICACIÓN:
- POST /api/token/ - Login de usuario (obtener tokens)
- POST /api/token/refresh/ - Renovar access token
- GET /api/auth/verify/ - Verificar validez del token
- POST /api/auth/logout/ - Cerrar sesión

REGISTRO:
- POST /api/register/ - Registrar nuevo usuario
- POST /api/register/validate/ - Validar datos sin registrar
- POST /api/register/check-username/ - Verificar disponibilidad

UTILIDADES:
- GET /api/csrf/ - Obtener token CSRF
- GET /api/health/ - Estado de salud de la API
- GET /api/config/ - Configuración pública de auth

DESARROLLO (solo en DEBUG=True):
- GET /api/debug/cookies/ - Ver cookies de la petición
- POST /api/debug/request/ - Ver datos completos de la petición
"""
