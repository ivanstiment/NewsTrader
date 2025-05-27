"""
Vistas para operaciones de login y manejo de tokens.

Contiene las vistas HTTP para:
- Autenticación de usuarios (login)
- Renovación de tokens (refresh)
- Verificación de tokens
- Cierre de sesión (logout)
"""

from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from authentication.serializers import (
    CustomTokenObtainPairSerializer,
    CustomTokenRefreshSerializer,
    UserInfoSerializer,
    TokenVerificationSerializer,
)
from authentication.services import TokenService, TokenValidationService
from authentication.constants import MESSAGES, HTTP_STATUS


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para obtención de tokens JWT.

    Maneja el login de usuarios devolviendo el access token en JSON
    y almacenando el refresh token en una cookie HttpOnly segura.
    """

    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    @extend_schema(
        summary="Login de usuario",
        description="Autenticación de usuario con credenciales. Devuelve access token (JSON) y refresh token en cookie segura.",
        request=CustomTokenObtainPairSerializer,
        responses={
            200: OpenApiResponse(
                response=UserInfoSerializer, description="Login exitoso"
            ),
            401: OpenApiResponse(description="Credenciales inválidas"),
        },
        tags=["auth"],
    )
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


class CustomTokenRefreshView(TokenRefreshView):
    """
    Vista personalizada para renovación de tokens JWT.

    Lee el refresh token desde cookies HttpOnly y devuelve
    un nuevo access token, actualizando el refresh token si aplica rotación.
    """

    permission_classes = [AllowAny]
    serializer_class = CustomTokenRefreshSerializer

    @extend_schema(
        summary="Renovación de token",
        description="Renueva el access token usando el refresh token en cookie segura.",
        request=CustomTokenRefreshSerializer,
        responses={
            200: OpenApiResponse(description="Access token renovado"),
            400: OpenApiResponse(description="Falta refresh token en cookie"),
            401: OpenApiResponse(description="Refresh token inválido o expirado"),
        },
        tags=["auth"],
    )
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


# VERIFY
@extend_schema(
    summary="Verificación de token",
    description="Verifica si el access token es válido. Requiere autenticación.",
    responses={
        200: TokenVerificationSerializer,
        401: OpenApiResponse(description="Token inválido o expirado"),
    },
    tags=["auth"],
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


# LOGOUT
@extend_schema(
    summary="Logout de usuario",
    description="Cierra sesión y elimina cookies de autenticación.",
    responses={
        200: OpenApiResponse(description="Logout correcto"),
        500: OpenApiResponse(description="Error en logout"),
    },
    tags=["auth"],
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
