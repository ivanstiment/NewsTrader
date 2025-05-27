"""
Constantes del módulo de autenticación.

Centraliza todos los valores constantes utilizados en el módulo de autenticación
para facilitar el mantenimiento y evitar duplicación de código.
"""

from datetime import timedelta

# Configuración de cookies
REFRESH_TOKEN_COOKIE_NAME = "refresh_token"
CSRF_TOKEN_COOKIE_NAME = "csrftoken"

# Tiempos de vida
REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7  # 7 días en segundos
CSRF_TOKEN_MAX_AGE = 31449600  # ~1 año en segundos

# Configuración de cookies de seguridad
COOKIE_SAMESITE_LAX = "Lax"
COOKIE_SAMESITE_NONE = "None"

# Mensajes de respuesta
MESSAGES = {
    # Éxito
    "LOGIN_SUCCESS": "Iniciando sesión",
    "LOGOUT_SUCCESS": "Sesión cerrada correctamente",
    "REGISTER_SUCCESS": "Usuario creado con éxito",
    "TOKEN_VALID": "Token válido",
    # Errores de autenticación
    "INVALID_CREDENTIALS": "Credenciales incorrectas. Verifica tu usuario y contraseña.",
    "AUTH_ERROR": "Error de autenticación",
    "NO_REFRESH_COOKIE": "Sin cookie de token de actualización",
    "INVALID_REFRESH_TOKEN": "Token de actualización inválido o expirado",
    "INVALID_TOKEN": "Token inválido",
    # Errores de validación
    "NO_CSRF_TOKEN": "No hay token CSRF",
    "INVALID_DATA_FORMAT": "Formato de datos inválido",
    "METHOD_NOT_ALLOWED": "Método no permitido",
    "INTERNAL_SERVER_ERROR": "Error interno del servidor",
    "LOGOUT_ERROR": "Error al cerrar sesión",
    # Validaciones de campos
    "FIELD_REQUIRED": "Este campo es requerido",
    "USERNAME_TOO_SHORT": "El nombre de usuario debe tener al menos 3 caracteres",
    "USERNAME_EXISTS": "Este nombre de usuario ya está en uso",
    "PASSWORD_TOO_SHORT": "La contraseña debe tener al menos 6 caracteres",
}

# Configuración de validación
VALIDATION_RULES = {
    "MIN_USERNAME_LENGTH": 3,
    "MIN_PASSWORD_LENGTH": 6,
}

# Headers HTTP
HTTP_HEADERS = {
    "CSRF_TOKEN": "HTTP_X_CSRFTOKEN",
    "X_FORWARDED_PROTO": "HTTP_X_FORWARDED_PROTO",
}

# Códigos de estado HTTP personalizados
HTTP_STATUS = {
    "SUCCESS": 200,
    "CREATED": 201,
    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "METHOD_NOT_ALLOWED": 405,
    "INTERNAL_SERVER_ERROR": 500,
}

# Mensajes para utilidades
UTILITY_MESSAGES = {
    "CSRF_TOKEN_GENERATED": "Token CSRF generado correctamente",
    "CSRF_GENERATION_ERROR": "Error generando token CSRF",
    "SERVICE_HEALTHY": "healthy",
    "SERVICE_UNHEALTHY": "unhealthy",
    "CONFIG_ERROR": "Error obteniendo configuración",
    "DEBUG_WARNING": "Este endpoint solo está disponible en desarrollo",
    "DEBUG_ERROR": "Error en debug",
}
