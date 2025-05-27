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

from authentication.services import ValidationService, SecurityValidationService
from authentication.constants import MESSAGES, HTTP_STATUS


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
