"""
Vistas utilitarias para autenticación.

Contiene vistas de apoyo para:
- Obtención de tokens CSRF
- Verificación de estado de la API
- Utilidades de depuración (solo en desarrollo)
"""

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample

from authentication.services import TokenService
from authentication.constants import HTTP_STATUS, UTILITY_MESSAGES
from authentication.serializers.doc_serializers import (
    CSRFTokenResponseSerializer,
    HealthCheckResponseSerializer,
    AuthConfigResponseSerializer,
    DebugCookiesResponseSerializer,
    DebugRequestResponseSerializer,
    ErrorResponseSerializer,
)


@extend_schema(
    tags=["Utilities"],
    summary="Obtener token CSRF",
    description="""
    Genera y devuelve un token CSRF válido para protección contra ataques CSRF.
    
    **Uso típico:**
    - Obtener token antes de operaciones que modifican datos
    - Inicialización de aplicaciones frontend
    - Renovación de tokens CSRF expirados
    
    **Configuración automática:**
    - Establece automáticamente la cookie csrftoken
    - Configura SameSite y Secure según el entorno
    - Token válido por aproximadamente 1 año
    
    **Seguridad:**
    - Protección contra ataques CSRF
    - Cookie configurada con las mejores prácticas
    - Rotación automática de tokens
    """,
    responses={
        200: OpenApiResponse(
            description="Token CSRF generado exitosamente",
            response=CSRFTokenResponseSerializer,
            examples=[
                OpenApiExample(
                    "Token CSRF generado",
                    summary="Token listo para usar",
                    value={
                        "csrfToken": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                        "message": "Token CSRF generado correctamente",
                    },
                )
            ],
        ),
        500: OpenApiResponse(
            description="Error generando token CSRF",
            examples=[
                OpenApiExample(
                    "Error del servidor",
                    value={
                        "detail": "Error generando token CSRF: descripción del error"
                    },
                )
            ],
        ),
    },
)
@extend_schema(
    tags=["Utilities"],
    summary="Obtener token CSRF",
    description="""
    Genera y devuelve un token CSRF válido para protección contra ataques CSRF.
    
    **Uso típico:**
    - Obtener token antes de operaciones que modifican datos
    - Inicialización de aplicaciones frontend
    - Renovación de tokens CSRF expirados
    
    **Configuración automática:**
    - Establece automáticamente la cookie csrftoken
    - Configura SameSite y Secure según el entorno
    - Token válido por aproximadamente 1 año
    
    **Seguridad:**
    - Protección contra ataques CSRF
    - Cookie configurada con las mejores prácticas
    - Rotación automática de tokens
    """,
    responses={
        200: OpenApiResponse(
            description="Token CSRF generado exitosamente",
            response=CSRFTokenResponseSerializer,
            examples=[
                OpenApiExample(
                    "Token CSRF generado",
                    summary="Token listo para usar",
                    value={
                        "csrfToken": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
                        "message": "Token CSRF generado correctamente",
                    },
                )
            ],
        ),
        500: OpenApiResponse(
            description="Error generando token CSRF",
            examples=[
                OpenApiExample(
                    "Error del servidor",
                    value={
                        "detail": "Error generando token CSRF: descripción del error"
                    },
                )
            ],
        ),
    },
)
@ensure_csrf_cookie
@require_http_methods(["GET"])
def get_csrf_token(request):
    """
    Endpoint para obtener el token CSRF para el frontend.

    Genera y devuelve un token CSRF válido, configurando
    automáticamente la cookie correspondiente en la respuesta.

    Args:
        request: Petición HTTP

    Returns:
        JsonResponse: Token CSRF en formato JSON
    """
    try:
        # Generar token CSRF
        token = get_token(request)

        # Crear respuesta base
        response = JsonResponse(
            {"csrfToken": token, "message": UTILITY_MESSAGES["CSRF_TOKEN_GENERATED"]}
        )

        # Configurar cookie CSRF con configuración de seguridad
        TokenService.set_csrf_cookie(response, token)

        return response

    except Exception as e:
        return JsonResponse(
            {"detail": f"{UTILITY_MESSAGES['CSRF_GENERATION_ERROR']}: {str(e)}"},
            status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
        )


@extend_schema(
    tags=["Utilities"],
    summary="Verificación de salud de la API",
    description="""
    Endpoint de monitoreo para verificar el estado de salud del servicio de autenticación.
    
    **Información proporcionada:**
    - Estado general del servicio
    - Versión del sistema de autenticación
    - Entorno de ejecución (desarrollo/producción)
    - Características habilitadas
    
    **Uso típico:**
    - Monitoreo de infraestructura
    - Verificación de despliegues
    - Diagnóstico de problemas
    - Health checks automatizados
    
    **Disponibilidad:**
    - Acceso público (no requiere autenticación)
    - Respuesta rápida para monitoreo
    """,
    responses={
        200: OpenApiResponse(
            description="Servicio funcionando correctamente",
            response=HealthCheckResponseSerializer,
            examples=[
                OpenApiExample(
                    "Servicio saludable",
                    summary="API funcionando correctamente",
                    value={
                        "status": "healthy",
                        "service": "authentication-api",
                        "version": "1.0.0",
                        "environment": "production",
                        "features": {
                            "jwt_auth": True,
                            "csrf_protection": True,
                            "secure_cookies": True,
                            "user_registration": True,
                        },
                    },
                )
            ],
        ),
        500: OpenApiResponse(
            description="Servicio con problemas",
            examples=[
                OpenApiExample(
                    "Servicio no saludable",
                    value={"status": "unhealthy", "error": "descripción del problema"},
                )
            ],
        ),
    },
)
@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    """
    Endpoint de verificación de salud de la API de autenticación.

    Proporciona información básica sobre el estado del servicio
    de autenticación y sus dependencias.

    Args:
        request: Petición HTTP

    Returns:
        Response: Estado de salud del servicio
    """
    try:
        # Información básica del sistema
        health_data = {
            "status": UTILITY_MESSAGES["SERVICE_HEALTHY"],
            "service": "authentication-api",
            "version": "1.0.0",
            "environment": "production" if settings.IS_PRODUCTION else "development",
            "features": {
                "jwt_auth": True,
                "csrf_protection": True,
                "secure_cookies": settings.IS_PRODUCTION,
                "user_registration": True,
            },
        }

        return Response(health_data, status=HTTP_STATUS["SUCCESS"])

    except Exception as e:
        return Response(
            {"status": UTILITY_MESSAGES["SERVICE_UNHEALTHY"], "error": str(e)},
            status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
        )


@extend_schema(
    tags=["Utilities"],
    summary="Configuración pública de autenticación",
    description="""
    Devuelve la configuración pública del sistema de autenticación que el frontend necesita conocer.
    
    **Información incluida:**
    - Requisitos de CSRF y JWT
    - Reglas de validación de contraseñas
    - Reglas de validación de nombres de usuario
    - Características de seguridad habilitadas
    - Endpoints disponibles
    
    **Uso típico:**
    - Configuración inicial del frontend
    - Validación en tiempo real
    - Adaptación de UI según capacidades
    - Documentación dinámica
    
    **Seguridad:**
    - Solo información pública (sin secretos)
    - Configuración adaptada al entorno
    """,
    responses={
        200: OpenApiResponse(
            description="Configuración obtenida exitosamente",
            response=AuthConfigResponseSerializer,
            examples=[
                OpenApiExample(
                    "Configuración completa",
                    summary="Configuración del sistema de autenticación",
                    value={
                        "csrf_required": True,
                        "jwt_auth_enabled": True,
                        "registration_enabled": True,
                        "password_requirements": {
                            "min_length": 6,
                            "require_uppercase": False,
                            "require_lowercase": False,
                            "require_numbers": False,
                            "require_symbols": False,
                        },
                        "username_requirements": {
                            "min_length": 3,
                            "max_length": 150,
                            "allowed_characters": "alphanumeric and underscore",
                        },
                        "security_features": {
                            "secure_cookies": True,
                            "same_site_cookies": True,
                            "http_only_refresh": True,
                        },
                        "endpoints": {
                            "login": "/api/token/",
                            "refresh": "/api/token/refresh/",
                            "register": "/api/register/",
                            "verify": "/api/auth/verify/",
                            "logout": "/api/auth/logout/",
                            "csrf": "/api/csrf/",
                        },
                    },
                )
            ],
        ),
        500: OpenApiResponse(
            description="Error obteniendo configuración",
            examples=[
                OpenApiExample(
                    "Error del servidor",
                    value={
                        "detail": "Error obteniendo configuración: descripción del error"
                    },
                )
            ],
        ),
    },
)
@api_view(["GET"])
@permission_classes([AllowAny])
def auth_config(request):
    """
    Endpoint para obtener configuración pública de autenticación.

    Devuelve configuraciones que el frontend necesita conocer
    para interactuar correctamente con la API de autenticación.

    Args:
        request: Petición HTTP

    Returns:
        Response: Configuración pública de autenticación
    """
    try:
        config_data = {
            "csrf_required": True,
            "jwt_auth_enabled": True,
            "registration_enabled": True,
            "password_requirements": {
                "min_length": 6,
                "require_uppercase": False,
                "require_lowercase": False,
                "require_numbers": False,
                "require_symbols": False,
            },
            "username_requirements": {
                "min_length": 3,
                "max_length": 150,
                "allowed_characters": "alphanumeric and underscore",
            },
            "security_features": {
                "secure_cookies": settings.IS_PRODUCTION,
                "same_site_cookies": True,
                "http_only_refresh": True,
            },
            "endpoints": {
                "login": "/api/token/",
                "refresh": "/api/token/refresh/",
                "register": "/api/register/",
                "verify": "/api/auth/verify/",
                "logout": "/api/auth/logout/",
                "csrf": "/api/csrf/",
            },
        }

        return Response(config_data, status=HTTP_STATUS["SUCCESS"])

    except Exception as e:
        return Response(
            {"detail": f"{UTILITY_MESSAGES['CONFIG_ERROR']}: {str(e)}"},
            status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
        )


# Utilidades de depuración (solo en desarrollo)
if not settings.IS_PRODUCTION:

    @extend_schema(
        tags=["Debug"],
        summary="Debug: Ver cookies de la petición",
        description="""
        **⚠️ SOLO DISPONIBLE EN DESARROLLO**
        
        Endpoint de depuración para inspeccionar las cookies recibidas en la petición.
        
        **Información mostrada:**
        - Todas las cookies recibidas
        - Headers relevantes para autenticación
        - Información del user agent
        - Origin de la petición
        
        **Casos de uso:**
        - Debuggear problemas con cookies
        - Verificar configuración de CORS
        - Diagnosticar problemas de autenticación
        - Desarrollo y testing
        
        **Seguridad:**
        - Solo habilitado en modo DEBUG
        - No disponible en producción
        """,
        responses={
            200: OpenApiResponse(
                description="Información de cookies y headers",
                response=DebugCookiesResponseSerializer,
                examples=[
                    OpenApiExample(
                        "Debug de cookies",
                        summary="Información de depuración",
                        value={
                            "cookies_received": {
                                "csrftoken": "abc123...",
                                "refresh_token": "eyJ0eXAi...",
                            },
                            "meta_info": {
                                "csrf_token_header": "abc123def456...",
                                "authorization_header": "Bearer eyJ0eXAi...",
                                "user_agent": "Mozilla/5.0...",
                                "origin": "http://localhost:3000",
                            },
                            "warning": "Este endpoint solo está disponible en desarrollo",
                        },
                    )
                ],
            ),
            500: OpenApiResponse(
                description="Error en debug",
                examples=[
                    OpenApiExample(
                        "Error de debug",
                        value={"detail": "Error en debug: descripción del error"},
                    )
                ],
            ),
        },
    )
    @api_view(["GET"])
    @permission_classes([AllowAny])
    def debug_cookies(request):
        """
        Endpoint de depuración para ver las cookies de la petición.

        SOLO DISPONIBLE EN DESARROLLO.
        Útil para debuggear problemas con cookies durante el desarrollo.

        Args:
            request: Petición HTTP

        Returns:
            Response: Información de cookies de la petición
        """
        try:
            cookies_info = {
                "cookies_received": dict(request.COOKIES),
                "meta_info": {
                    "csrf_token_header": request.META.get(
                        "HTTP_X_CSRFTOKEN", "Not found"
                    ),
                    "authorization_header": request.META.get(
                        "HTTP_AUTHORIZATION", "Not found"
                    ),
                    "user_agent": request.META.get("HTTP_USER_AGENT", "Not found"),
                    "origin": request.META.get("HTTP_ORIGIN", "Not found"),
                },
                "warning": UTILITY_MESSAGES["DEBUG_WARNING"],
            }

            return Response(cookies_info, status=HTTP_STATUS["SUCCESS"])

        except Exception as e:
            return Response(
                {"detail": f"{UTILITY_MESSAGES['DEBUG_ERROR']}: {str(e)}"},
                status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            )

    @extend_schema(
        tags=["Debug"],
        summary="Debug: Ver datos completos de la petición",
        description="""
        **⚠️ SOLO DISPONIBLE EN DESARROLLO**
        
        Endpoint de depuración para inspeccionar todos los datos de la petición HTTP.
        
        **Información mostrada:**
        - Método HTTP utilizado
        - Tipo de contenido
        - Cuerpo de la petición (raw y parseado)
        - Datos POST y GET
        - Headers HTTP completos
        - Parsing de JSON si aplica
        
        **Casos de uso:**
        - Debuggear problemas con formato de datos
        - Verificar headers de autenticación
        - Diagnosticar problemas de serialización
        - Desarrollo y testing de APIs
        
        **Seguridad:**
        - Solo habilitado en modo DEBUG
        - No disponible en producción
        - Útil para desarrollo local
        """,
        responses={
            200: OpenApiResponse(
                description="Información completa de la petición",
                response=DebugRequestResponseSerializer,
                examples=[
                    OpenApiExample(
                        "Debug de petición",
                        summary="Información completa de debug",
                        value={
                            "method": "POST",
                            "content_type": "application/json",
                            "body_raw": '{"user": "test", "password": "test123"}',
                            "data": {"user": "test", "password": "test123"},
                            "POST": {},
                            "GET": {},
                            "headers": {
                                "HTTP_CONTENT_TYPE": "application/json",
                                "HTTP_AUTHORIZATION": "Bearer eyJ0eXAi...",
                                "HTTP_X_CSRFTOKEN": "abc123...",
                            },
                            "body_parsed": {"user": "test", "password": "test123"},
                            "warning": "Este endpoint solo está disponible en desarrollo",
                        },
                    )
                ],
            ),
            500: OpenApiResponse(
                description="Error en debug",
                examples=[
                    OpenApiExample(
                        "Error de debug",
                        value={"detail": "Error en debug: descripción del error"},
                    )
                ],
            ),
        },
    )
    @api_view(["POST"])
    @permission_classes([AllowAny])
    def debug_request_data(request):
        """
        Endpoint de depuración para ver los datos de la petición.

        SOLO DISPONIBLE EN DESARROLLO.
        Útil para debuggear problemas con el formato de datos.

        Args:
            request: Petición HTTP

        Returns:
            Response: Información completa de la petición
        """
        try:
            import json

            request_info = {
                "method": request.method,
                "content_type": request.content_type,
                "body_raw": request.body.decode("utf-8") if request.body else None,
                "data": request.data if hasattr(request, "data") else None,
                "POST": dict(request.POST),
                "GET": dict(request.GET),
                "headers": {
                    key: value
                    for key, value in request.META.items()
                    if key.startswith("HTTP_")
                },
                "warning": UTILITY_MESSAGES["DEBUG_WARNING"],
            }

            # Intentar parsear el body como JSON
            if request.body:
                try:
                    request_info["body_parsed"] = json.loads(request.body)
                except json.JSONDecodeError:
                    request_info["body_parsed"] = "No es JSON válido"

            return Response(request_info, status=HTTP_STATUS["SUCCESS"])

        except Exception as e:
            return Response(
                {"detail": f"{UTILITY_MESSAGES['DEBUG_ERROR']}: {str(e)}"},
                status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            )
