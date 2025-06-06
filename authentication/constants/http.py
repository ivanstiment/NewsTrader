"""
Constantes de códigos para HTTP headers y status del módulo de autenticación.
"""
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