"""
Imports centralizados de constantes del módulo de autenticación.

Centraliza todos los valores constantes utilizados en el módulo de autenticación
para facilitar el mantenimiento y evitar duplicación de código.
"""

from .cookies import (
    REFRESH_TOKEN_COOKIE_NAME,
    CSRF_TOKEN_COOKIE_NAME,
    COOKIE_SAMESITE_LAX,
    COOKIE_SAMESITE_NONE
)

from .http import (
    HTTP_HEADERS,
    HTTP_STATUS
)

from .messages import (
    MESSAGES,
    UTILITY_MESSAGES
)

from .timeouts import (
    CSRF_TOKEN_MAX_AGE,
    REFRESH_TOKEN_MAX_AGE
)

from .validation import (
    VALIDATION_RULES
)