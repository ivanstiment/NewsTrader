"""
Vistas para registro de usuarios.

Contiene las vistas HTTP para:
- Registro de nuevos usuarios
- Validación de datos de registro
- Creación de cuentas de usuario
"""

import json
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample

from authentication.services import ValidationService, SecurityValidationService
from authentication.constants import MESSAGES, HTTP_STATUS
from authentication.serializers.serializers import (
    UserRegistrationSerializer,
    UserInfoSerializer,
)
from authentication.serializers.doc_serializers import (
    RegistrationRequestSerializer,
    RegistrationResponseSerializer,
    ValidationErrorSerializer,
    UsernameCheckRequestSerializer,
    UsernameCheckResponseSerializer,
    ValidationResponseSerializer,
)


@extend_schema(
    tags=["User Registration"],
    summary="Registrar nuevo usuario",
    description="""
    Crea una nueva cuenta de usuario en el sistema.
    
    **Requisitos de validación:**
    - Nombre de usuario: mínimo 3 caracteres, único en el sistema
    - Contraseña: mínimo 6 caracteres
    - Token CSRF requerido en el header
    
    **Proceso de registro:**
    1. Validación del token CSRF
    2. Validación de formato de datos JSON
    3. Validación de reglas de negocio
    4. Sanitización de datos de entrada
    5. Creación del usuario en la base de datos
    
    **Seguridad:**
    - Protección CSRF habilitada
    - Sanitización de entrada contra XSS
    - Validación de unicidad de username
    - Hash seguro de contraseñas
    """,
    request=RegistrationRequestSerializer,
    responses={
        201: OpenApiResponse(
            description="Usuario creado exitosamente",
            response=RegistrationResponseSerializer,
            examples=[
                OpenApiExample(
                    "Registro exitoso",
                    summary="Usuario registrado correctamente",
                    value={
                        "message": "Usuario creado con éxito",
                        "user": {
                            "id": 1,
                            "username": "nuevo_usuario",
                            "date_joined": "2025-01-15T10:30:00Z",
                        },
                    },
                )
            ],
        ),
        400: OpenApiResponse(
            description="Errores de validación",
            response=ValidationErrorSerializer,
            examples=[
                OpenApiExample(
                    "Datos inválidos",
                    summary="Errores de validación de campos",
                    value={
                        "user": [
                            "El nombre de usuario debe tener al menos 3 caracteres"
                        ],
                        "password": ["La contraseña debe tener al menos 6 caracteres"],
                    },
                ),
                OpenApiExample(
                    "Usuario duplicado",
                    summary="Nombre de usuario ya existe",
                    value={"user": ["Este nombre de usuario ya está en uso"]},
                ),
                OpenApiExample(
                    "JSON inválido",
                    summary="Formato de datos incorrecto",
                    value={"detail": "Formato de datos inválido"},
                ),
            ],
        ),
        403: OpenApiResponse(
            description="Token CSRF faltante",
            examples=[
                OpenApiExample("Sin CSRF token", value={"detail": "No hay token CSRF"})
            ],
        ),
        405: OpenApiResponse(
            description="Método no permitido",
            examples=[
                OpenApiExample(
                    "Método incorrecto", value={"detail": "Método no permitido"}
                )
            ],
        ),
        500: OpenApiResponse(
            description="Error interno del servidor",
            examples=[
                OpenApiExample(
                    "Error del servidor",
                    value={
                        "detail": "Error interno del servidor: descripción del error"
                    },
                )
            ],
        ),
    },
    examples=[
        OpenApiExample(
            "Datos de registro válidos",
            summary="Ejemplo de registro exitoso",
            description="Datos correctos para crear un nuevo usuario",
            value={"user": "mi_usuario_nuevo", "password": "mi_contraseña_segura123"},
        )
    ],
)
@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    """
    Registra un nuevo usuario en el sistema.

    Valida los datos de entrada, verifica que el usuario no exista
    y crea una nueva cuenta de usuario con las credenciales proporcionadas.

    Args:
        request: Petición HTTP con datos de registro

    Returns:
        JsonResponse: Respuesta con resultado del registro

    Expected JSON format::
    
        {
            "user": "nombre_usuario",
            "password": "contraseña_segura"
        }
        
    """
    try:
        # Validar token CSRF
        csrf_valid, csrf_token = ValidationService.validate_csrf_token(request)
        if not csrf_valid:
            return JsonResponse(
                {"detail": MESSAGES["NO_CSRF_TOKEN"]}, status=HTTP_STATUS["FORBIDDEN"]
            )

        # Validar y parsear datos JSON
        json_valid, data, json_error = ValidationService.validate_json_data(request)
        if not json_valid:
            return JsonResponse(
                {"detail": json_error}, status=HTTP_STATUS["BAD_REQUEST"]
            )

        # Validar datos de registro
        is_valid, validation_errors = ValidationService.validate_registration_data(data)
        if not is_valid:
            return JsonResponse(validation_errors, status=HTTP_STATUS["BAD_REQUEST"])

        # Sanitizar datos de entrada
        username = SecurityValidationService.sanitize_user_input(data.get("user"))
        password = data.get(
            "password"
        )  # No sanitizar password para mantener caracteres especiales

        # Validación adicional de formato de credenciales
        credentials_valid, credential_errors = (
            SecurityValidationService.validate_user_credentials_format(
                username, password
            )
        )
        if not credentials_valid:
            return JsonResponse(
                {"detail": "; ".join(credential_errors)},
                status=HTTP_STATUS["BAD_REQUEST"],
            )

        # Crear el usuario
        user = User.objects.create_user(
            username=username, password=password, is_active=True
        )
        user.save()

        # Respuesta exitosa
        return JsonResponse(
            {
                "message": MESSAGES["REGISTER_SUCCESS"],
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "date_joined": user.date_joined.isoformat(),
                },
            },
            status=HTTP_STATUS["CREATED"],
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {"detail": MESSAGES["INVALID_DATA_FORMAT"]},
            status=HTTP_STATUS["BAD_REQUEST"],
        )
    except Exception as e:
        return _handle_registration_error(e)


def _handle_registration_error(error: Exception) -> JsonResponse:
    """
    Maneja errores durante el proceso de registro.

    Args:
        error (Exception): Error ocurrido durante el registro

    Returns:
        JsonResponse: Respuesta de error apropiada
    """
    error_message = str(error)

    # Manejo específico para errores de base de datos
    if "UNIQUE constraint failed" in error_message:
        return JsonResponse(
            {"user": [MESSAGES["USERNAME_EXISTS"]]}, status=HTTP_STATUS["BAD_REQUEST"]
        )

    # Error genérico del servidor
    return JsonResponse(
        {"detail": f"{MESSAGES['INTERNAL_SERVER_ERROR']}: {error_message}"},
        status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
    )


@extend_schema(
    tags=["User Registration"],
    summary="Validar datos de registro sin crear usuario",
    description="""
    Valida los datos de registro sin crear realmente el usuario.
    
    **Útil para:**
    - Validación en tiempo real en el frontend
    - Verificar datos antes del registro completo
    - Mostrar errores de validación inmediatos
    
    **Validaciones realizadas:**
    - Formato y longitud del nombre de usuario
    - Disponibilidad del nombre de usuario
    - Fortaleza y longitud de la contraseña
    - Formato general de los datos
    """,
    request=RegistrationRequestSerializer,
    responses={
        200: OpenApiResponse(
            description="Datos válidos o inválidos",
            examples=[
                OpenApiExample(
                    "Datos válidos",
                    summary="Todos los datos son correctos",
                    value={"valid": True, "message": "Datos de registro válidos"},
                )
            ],
        ),
        400: OpenApiResponse(
            description="Datos inválidos con detalles",
            examples=[
                OpenApiExample(
                    "Datos inválidos",
                    summary="Errores de validación encontrados",
                    value={
                        "valid": False,
                        "errors": {
                            "user": [
                                "El nombre de usuario debe tener al menos 3 caracteres"
                            ],
                            "password": [
                                "La contraseña debe tener al menos 6 caracteres"
                            ],
                        },
                    },
                )
            ],
        ),
        500: OpenApiResponse(
            description="Error en validación",
            examples=[
                OpenApiExample(
                    "Error del servidor",
                    value={"detail": "Error en validación: descripción del error"},
                )
            ],
        ),
    },
)
@csrf_exempt
@require_http_methods(["POST"])
def validate_registration_data(request):
    """
    Endpoint para validar datos de registro sin crear el usuario.

    Útil para validación en tiempo real en el frontend
    sin procesar completamente el registro.

    Args:
        request: Petición HTTP con datos a validar

    Returns:
        JsonResponse: Resultado de validación
    """
    try:
        # Validar y parsear datos JSON
        json_valid, data, json_error = ValidationService.validate_json_data(request)
        if not json_valid:
            return JsonResponse(
                {"detail": json_error}, status=HTTP_STATUS["BAD_REQUEST"]
            )

        # Validar datos de registro
        is_valid, validation_errors = ValidationService.validate_registration_data(data)

        if is_valid:
            return JsonResponse(
                {"valid": True, "message": "Datos de registro válidos"},
                status=HTTP_STATUS["SUCCESS"],
            )
        else:
            return JsonResponse(
                {"valid": False, "errors": validation_errors},
                status=HTTP_STATUS["BAD_REQUEST"],
            )

    except Exception as e:
        return JsonResponse(
            {"detail": f"Error en validación: {str(e)}"},
            status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
        )


@extend_schema(
    tags=["User Registration"],
    summary="Verificar disponibilidad de nombre de usuario",
    description="""
    Verifica si un nombre de usuario específico está disponible para registro.
    
    **Casos de uso:**
    - Verificación en tiempo real durante el tipeo
    - Validación antes del envío del formulario
    - Sugerencias de nombres alternativos
    
    **Características:**
    - Respuesta rápida para UX fluida
    - Sanitización automática del input
    - Información detallada sobre disponibilidad
    """,
    request=UsernameCheckRequestSerializer,
    responses={
        200: OpenApiResponse(
            description="Verificación completada",
            response=UsernameCheckResponseSerializer,
            examples=[
                OpenApiExample(
                    "Username disponible",
                    summary="Nombre de usuario libre para uso",
                    value={"available": True, "username": "usuario_disponible"},
                ),
                OpenApiExample(
                    "Username ocupado",
                    summary="Nombre de usuario ya en uso",
                    value={
                        "available": False,
                        "username": "usuario_ocupado",
                        "reason": "Este nombre de usuario ya está en uso",
                    },
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Username vacío o inválido",
            examples=[
                OpenApiExample(
                    "Username vacío",
                    value={"available": False, "reason": "Username vacío"},
                ),
                OpenApiExample(
                    "JSON inválido", value={"detail": "Formato de datos inválido"}
                ),
            ],
        ),
        500: OpenApiResponse(
            description="Error verificando disponibilidad",
            examples=[
                OpenApiExample(
                    "Error del servidor",
                    value={
                        "detail": "Error verificando disponibilidad: descripción del error"
                    },
                )
            ],
        ),
    },
    examples=[
        OpenApiExample(
            "Verificar username",
            summary="Ejemplo de verificación",
            value={"username": "mi_nuevo_usuario"},
        )
    ],
)
@csrf_exempt
@require_http_methods(["POST"])
def check_username_availability(request):
    """
    Verifica si un nombre de usuario está disponible.

    Endpoint útil para verificación en tiempo real de disponibilidad
    de nombres de usuario durante el proceso de registro.

    Args:
        request: Petición HTTP con nombre de usuario a verificar

    Returns:
        JsonResponse: Disponibilidad del username

    Expected JSON format::
    
        {
            "username": "nombre_a_verificar"
        }
        
    """
    try:
        # Validar y parsear datos JSON
        json_valid, data, json_error = ValidationService.validate_json_data(request)
        if not json_valid:
            return JsonResponse(
                {"detail": json_error}, status=HTTP_STATUS["BAD_REQUEST"]
            )

        username = data.get("username", "").strip()

        if not username:
            return JsonResponse(
                {"available": False, "reason": "Username vacío"},
                status=HTTP_STATUS["BAD_REQUEST"],
            )

        # Sanitizar entrada
        username = SecurityValidationService.sanitize_user_input(username)

        # Verificar disponibilidad
        is_available = not User.objects.filter(username=username).exists()

        response_data = {"available": is_available, "username": username}

        if not is_available:
            response_data["reason"] = MESSAGES["USERNAME_EXISTS"]

        return JsonResponse(response_data, status=HTTP_STATUS["SUCCESS"])

    except Exception as e:
        return JsonResponse(
            {"detail": f"Error verificando disponibilidad: {str(e)}"},
            status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
        )
