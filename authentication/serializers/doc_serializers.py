"""
Serializers específicos para documentación de la API.

Este archivo contiene serializers que se usan únicamente para generar
documentación OpenAPI/Swagger con drf-spectacular. No se utilizan
para lógica de negocio real.

Separamos estos serializers del archivo principal para:
- Mantener limpio el archivo de serializers principales
- Facilitar el mantenimiento de la documentación
- Evitar confusión entre serializers funcionales y de documentación
"""

from rest_framework import serializers
from .serializers import UserInfoSerializer


# ==============================================
# Serializers para Documentación de Registro
# ==============================================

class RegistrationRequestSerializer(serializers.Serializer):
    """Serializer para documentar la petición de registro."""
    user = serializers.CharField(
        min_length=3,
        max_length=150,
        help_text="Nombre de usuario único (mínimo 3 caracteres)"
    )
    password = serializers.CharField(
        min_length=6,
        max_length=128,
        help_text="Contraseña (mínimo 6 caracteres)"
    )


class RegistrationResponseSerializer(serializers.Serializer):
    """Serializer para documentar la respuesta de registro exitoso."""
    message = serializers.CharField(help_text="Mensaje de confirmación")
    user = UserInfoSerializer(help_text="Información del usuario creado")


class ValidationErrorSerializer(serializers.Serializer):
    """Serializer para documentar errores de validación."""
    user = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="Errores relacionados con el nombre de usuario"
    )
    password = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="Errores relacionados con la contraseña"
    )


class UsernameCheckRequestSerializer(serializers.Serializer):
    """Serializer para documentar verificación de disponibilidad de username."""
    username = serializers.CharField(
        help_text="Nombre de usuario a verificar"
    )


class UsernameCheckResponseSerializer(serializers.Serializer):
    """Serializer para documentar respuesta de verificación de username."""
    available = serializers.BooleanField(
        help_text="Indica si el nombre de usuario está disponible"
    )
    username = serializers.CharField(
        help_text="Nombre de usuario verificado"
    )
    reason = serializers.CharField(
        required=False,
        help_text="Razón por la cual no está disponible (si aplica)"
    )


# ==============================================
# Serializers para Documentación de Utilidades
# ==============================================

class CSRFTokenResponseSerializer(serializers.Serializer):
    """Serializer para respuesta de token CSRF."""
    csrfToken = serializers.CharField(help_text="Token CSRF para protección")
    message = serializers.CharField(help_text="Mensaje de confirmación")


class HealthCheckResponseSerializer(serializers.Serializer):
    """Serializer para respuesta de health check."""
    status = serializers.CharField(help_text="Estado del servicio")
    service = serializers.CharField(help_text="Nombre del servicio")
    version = serializers.CharField(help_text="Versión del servicio")
    environment = serializers.CharField(help_text="Entorno de ejecución")
    features = serializers.DictField(help_text="Características habilitadas")


class AuthConfigResponseSerializer(serializers.Serializer):
    """Serializer para configuración de autenticación."""
    csrf_required = serializers.BooleanField(help_text="CSRF requerido")
    jwt_auth_enabled = serializers.BooleanField(help_text="Autenticación JWT habilitada")
    registration_enabled = serializers.BooleanField(help_text="Registro habilitado")
    password_requirements = serializers.DictField(help_text="Requisitos de contraseña")
    username_requirements = serializers.DictField(help_text="Requisitos de nombre de usuario")
    security_features = serializers.DictField(help_text="Características de seguridad")
    endpoints = serializers.DictField(help_text="Endpoints disponibles")


# ==============================================
# Serializers para Documentación de Debug
# ==============================================

class DebugCookiesResponseSerializer(serializers.Serializer):
    """Serializer para respuesta de debug de cookies."""
    cookies_received = serializers.DictField(help_text="Cookies recibidas")
    meta_info = serializers.DictField(help_text="Información de headers")
    warning = serializers.CharField(help_text="Advertencia de uso")


class DebugRequestResponseSerializer(serializers.Serializer):
    """Serializer para respuesta de debug de petición."""
    method = serializers.CharField(help_text="Método HTTP")
    content_type = serializers.CharField(help_text="Tipo de contenido")
    body_raw = serializers.CharField(help_text="Cuerpo de la petición raw", allow_null=True)
    data = serializers.DictField(help_text="Datos parseados", allow_null=True)
    POST = serializers.DictField(help_text="Datos POST")
    GET = serializers.DictField(help_text="Parámetros GET")
    headers = serializers.DictField(help_text="Headers HTTP")
    body_parsed = serializers.CharField(help_text="Cuerpo parseado como JSON", allow_null=True)
    warning = serializers.CharField(help_text="Advertencia de uso")


# ==============================================
# Serializers para Documentación de Errores
# ==============================================

class ErrorResponseSerializer(serializers.Serializer):
    """Serializer genérico para respuestas de error."""
    detail = serializers.CharField(help_text="Descripción del error")


class ValidationResponseSerializer(serializers.Serializer):
    """Serializer para respuestas de validación."""
    valid = serializers.BooleanField(help_text="Indica si los datos son válidos")
    message = serializers.CharField(
        required=False,
        help_text="Mensaje descriptivo"
    )
    errors = serializers.DictField(
        required=False,
        help_text="Errores específicos por campo"
    )