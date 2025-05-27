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

from authentication.services import TokenService
from authentication.constants import HTTP_STATUS


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
            {"csrfToken": token, "message": "Token CSRF generado correctamente"}
        )

        # Configurar cookie CSRF con configuración de seguridad
        TokenService.set_csrf_cookie(response, token)

        return response

    except Exception as e:
        return JsonResponse(
            {"detail": f"Error generando token CSRF: {str(e)}"},
            status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
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
            "status": "healthy",
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
            {"status": "unhealthy", "error": str(e)},
            status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
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
            {"detail": f"Error obteniendo configuración: {str(e)}"},
            status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
        )


# Utilidades de depuración (solo en desarrollo)
if not settings.IS_PRODUCTION:

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
                "warning": "Este endpoint solo está disponible en desarrollo",
            }

            return Response(cookies_info, status=HTTP_STATUS["SUCCESS"])

        except Exception as e:
            return Response(
                {"detail": f"Error en debug: {str(e)}"},
                status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
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
                "warning": "Este endpoint solo está disponible en desarrollo",
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
                {"detail": f"Error en debug: {str(e)}"},
                status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            )
