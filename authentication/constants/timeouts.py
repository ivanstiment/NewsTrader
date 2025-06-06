"""
Constantes de timeouts y duración de la expiración del módulo de autenticación.
"""

# Tiempos de vida
REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7  # 7 días en segundos
CSRF_TOKEN_MAX_AGE = 31449600  # ~1 año en segundos
