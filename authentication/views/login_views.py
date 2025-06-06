"""
Vistas para operaciones de login y manejo de tokens.

Contiene las vistas HTTP para:
- Autenticación de usuarios (login)
- Renovación de tokens (refresh)
- Verificación de tokens
- Cierre de sesión (logout)
"""

from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from drf_spectacular.openapi import AutoSchema

from authentication.serializers.serializers import (
    CustomTokenObtainPairSerializer,
    CustomTokenRefreshSerializer,
    TokenVerificationSerializer,
    UserInfoSerializer,
)
from authentication.services import TokenService, TokenValidationService
from authentication.constants.messages import MESSAGES
from authentication.constants.http import HTTP_STATUS


@extend_schema(
    tags=["Authentication"],
    summary="Iniciar sesión de usuario",
    description="""
    Autentica un usuario con sus credenciales y devuelve tokens JWT.
    
    El token de acceso se devuelve en la respuesta JSON, mientras que
    el token de renovación se almacena automáticamente en una cookie HttpOnly
    por seguridad.
    
    **Características de seguridad:**
    - Token de acceso válido por 2 horas
    - Token de renovación válido por 7 días
    - Cookie HttpOnly para el refresh token
    - Protección CSRF habilitada
    """,
    request=CustomTokenObtainPairSerializer,
    responses={
        200: OpenApiResponse(
            description="Login exitoso",
            examples=[
                OpenApiExample(
                    "Respuesta exitosa",
                    summary="Usuario autenticado correctamente",
                    description="El token de acceso se incluye en la respuesta",
                    value={"access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."},
                )
            ],
        ),
        401: OpenApiResponse(
            description="Credenciales inválidas",
            examples=[
                OpenApiExample(
                    "Credenciales incorrectas",
                    summary="Usuario o contraseña incorrectos",
                    value={
                        "detail": "Credenciales incorrectas. Verifica tu usuario y contraseña."
                    },
                )
            ],
        ),
        400: OpenApiResponse(
            description="Error en la petición",
            examples=[
                OpenApiExample(
                    "Error de autenticación",
                    summary="Error general de autenticación",
                    value={"detail": "Error de autenticación"},
                )
            ],
        ),
    },
    examples=[
        OpenApiExample(
            "Credenciales de ejemplo",
            summary="Login con usuario y contraseña",
            description="Ejemplo de credenciales para autenticación",
            value={"username": "usuario_demo", "password": "contraseña_segura123"},
        )
    ],
)
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para obtención de tokens JWT.

    Maneja el login de usuarios devolviendo el access token en JSON
    y almacenando el refresh token en una cookie HttpOnly segura.
    """

    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        """
        Procesa la petición de login.

        Args:
            request: Petición HTTP con credenciales

        Returns:
            Response: Respuesta con access token y refresh cookie
        """
        try:
            response = super().post(request, *args, **kwargs)

            # Extraer tokens de la respuesta del serializer
            access_token = response.data["access"]
            refresh_token = response.data["refresh"]

            # Crear respuesta personalizada con cookies
            return TokenService.create_token_response(access_token, refresh_token)

        except Exception as e:
            return self._handle_login_error(e)

    def _handle_login_error(self, error: Exception) -> Response:
        """
        Maneja errores específicos durante el login.

        Args:
            error (Exception): Error ocurrido durante el login

        Returns:
            Response: Respuesta de error apropiada
        """
        error_message = str(error)

        if "No active account found" in error_message:
            return Response(
                {"detail": MESSAGES["INVALID_CREDENTIALS"]},
                status=HTTP_STATUS["UNAUTHORIZED"],
            )

        return Response(
            {"detail": MESSAGES["AUTH_ERROR"]}, status=HTTP_STATUS["BAD_REQUEST"]
        )


@extend_schema(
    tags=["Authentication"],
    summary="Renovar token de acceso",
    description="""
    Renueva el token de acceso utilizando el token de renovación almacenado
    en cookies HttpOnly.
    
    Este endpoint lee automáticamente el refresh token desde las cookies
    del navegador, por lo que no es necesario enviarlo en el cuerpo de la petición.
    
    **Características:**
    - Lee el refresh token desde cookies HttpOnly
    - Genera un nuevo access token
    - Opcionalmente rota el refresh token (según configuración)
    - Mantiene la sesión activa sin re-autenticación
    """,
    request=CustomTokenRefreshSerializer,
    responses={
        200: OpenApiResponse(
            description="Token renovado exitosamente",
            examples=[
                OpenApiExample(
                    "Renovación exitosa",
                    summary="Nuevo token de acceso generado",
                    value={
                        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                    },
                ),
                OpenApiExample(
                    "Renovación sin rotación",
                    summary="Solo nuevo access token",
                    value={"access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."},
                ),
            ],
        ),
        400: OpenApiResponse(
            description="Cookie de refresh token faltante",
            examples=[
                OpenApiExample(
                    "Sin cookie de refresh",
                    value={"detail": "Sin cookie de token de actualización"},
                )
            ],
        ),
        401: OpenApiResponse(
            description="Token de renovación inválido o expirado",
            examples=[
                OpenApiExample(
                    "Token expirado",
                    value={"detail": "Token de actualización inválido o expirado"},
                )
            ],
        ),
    },
)
class CustomTokenRefreshView(TokenRefreshView):
    """
    Vista personalizada para renovación de tokens JWT.

    Lee el refresh token desde cookies HttpOnly y devuelve
    un nuevo access token, actualizando el refresh token si aplica rotación.
    """

    permission_classes = [AllowAny]
    serializer_class = CustomTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        """
        Procesa la renovación de tokens.

        Args:
            request: Petición HTTP con cookie de refresh token

        Returns:
            Response: Respuesta con nuevos tokens
        """
        # Extraer refresh token de las cookies
        refresh_token = TokenService.extract_refresh_token_from_cookies(request)

        if not refresh_token:
            return Response(
                {"detail": MESSAGES["NO_REFRESH_COOKIE"]},
                status=HTTP_STATUS["BAD_REQUEST"],
            )

        # Preparar datos para el serializer
        mutable_data = request.data.copy()
        mutable_data["refresh"] = refresh_token
        request._full_data = mutable_data

        try:
            response = super().post(request, *args, **kwargs)

            # Crear respuesta personalizada
            access_token = response.data["access"]
            new_refresh_token = response.data.get("refresh")

            return TokenService.create_refresh_response(access_token, new_refresh_token)

        except (InvalidToken, TokenError):
            return Response(
                {"detail": MESSAGES["INVALID_REFRESH_TOKEN"]},
                status=HTTP_STATUS["UNAUTHORIZED"],
            )
        except Exception as e:
            return Response(
                {"detail": MESSAGES["INVALID_REFRESH_TOKEN"]},
                status=HTTP_STATUS["UNAUTHORIZED"],
            )


@extend_schema(
    tags=["Authentication"],
    summary="Verificar validez del token de acceso",
    description="""
    Verifica si el token de acceso proporcionado es válido y devuelve
    información básica del usuario autenticado.
    
    **Uso típico:**
    - Verificar si el usuario sigue autenticado
    - Obtener información del usuario actual
    - Validar tokens antes de operaciones críticas
    
    **Autenticación requerida:**
    Este endpoint requiere un token JWT válido en el header Authorization.
    """,
    responses={
        200: OpenApiResponse(
            description="Token válido",
            response=TokenVerificationSerializer,
            examples=[
                OpenApiExample(
                    "Token válido",
                    summary="Usuario autenticado correctamente",
                    value={
                        "valid": True,
                        "user": {
                            "id": 1,
                            "username": "usuario_demo",
                            "is_active": True,
                        },
                    },
                )
            ],
        ),
        401: OpenApiResponse(
            description="Token inválido o expirado",
            examples=[
                OpenApiExample(
                    "Token inválido", value={"detail": "Token inválido", "valid": False}
                ),
                OpenApiExample(
                    "Sin token",
                    summary="Header Authorization faltante",
                    value={"detail": "Authentication credentials were not provided."},
                ),
            ],
        ),
    },
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def verify_token(request):
    """
    Endpoint para verificar la validez de un token de acceso.

    Utiliza el decorador IsAuthenticated que automáticamente
    valida el token JWT presente en el header Authorization.

    Args:
        request: Petición HTTP con token de acceso

    Returns:
        Response: Estado de validez del token e información del usuario
    """
    try:
        # Si llegamos aquí, el token es válido (verificado por IsAuthenticated)
        user_data = {
            "id": request.user.id,
            "username": request.user.username,
            "is_active": request.user.is_active,
        }

        return Response(
            {"valid": True, "user": user_data}, status=HTTP_STATUS["SUCCESS"]
        )

    except Exception as e:
        return Response(
            {"detail": MESSAGES["INVALID_TOKEN"], "valid": False},
            status=HTTP_STATUS["UNAUTHORIZED"],
        )


@extend_schema(
    tags=["Authentication"],
    summary="Cerrar sesión del usuario",
    description="""
    Cierra la sesión del usuario autenticado limpiando las cookies de autenticación.
    
    **Acciones realizadas:**
    - Elimina la cookie del refresh token
    - Invalida la sesión actual
    - Opcionalmente puede agregar el token a una blacklist
    
    **Autenticación requerida:**
    Este endpoint requiere un token JWT válido.
    
    **Nota de seguridad:**
    Aunque se limpien las cookies, el access token seguirá siendo válido
    hasta su expiración natural (2 horas por defecto).
    """,
    responses={
        200: OpenApiResponse(
            description="Sesión cerrada exitosamente",
            examples=[
                OpenApiExample(
                    "Logout exitoso",
                    summary="Usuario deslogueado correctamente",
                    value={"message": "Sesión cerrada correctamente"},
                )
            ],
        ),
        401: OpenApiResponse(
            description="No autenticado",
            examples=[
                OpenApiExample(
                    "Sin autenticación",
                    value={"detail": "Authentication credentials were not provided."},
                )
            ],
        ),
        500: OpenApiResponse(
            description="Error interno del servidor",
            examples=[
                OpenApiExample(
                    "Error de servidor", value={"detail": "Error al cerrar sesión"}
                )
            ],
        ),
    },
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """
    Endpoint para cerrar sesión del usuario.

    Limpia las cookies de autenticación y opcionalmente
    podría agregar el token a una blacklist.

    Args:
        request: Petición HTTP del usuario autenticado

    Returns:
        Response: Confirmación de cierre de sesión
    """
    try:
        response = Response(
            {"message": MESSAGES["LOGOUT_SUCCESS"]}, status=HTTP_STATUS["SUCCESS"]
        )

        # Limpiar cookies de autenticación
        TokenService.clear_auth_cookies(response)

        return response

    except Exception as e:
        return Response(
            {"detail": MESSAGES["LOGOUT_ERROR"]},
            status=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
        )
