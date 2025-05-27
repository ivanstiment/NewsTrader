"""
Servicio de gestión de tokens JWT.

Centraliza toda la lógica relacionada con la creación, validación y gestión
de tokens JWT, incluyendo el manejo de cookies seguras para refresh tokens.
"""

from django.conf import settings
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from typing import Dict, Optional, Tuple

from authentication.constants import (
    REFRESH_TOKEN_COOKIE_NAME,
    CSRF_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_MAX_AGE,
    CSRF_TOKEN_MAX_AGE,
    COOKIE_SAMESITE_LAX,
    COOKIE_SAMESITE_NONE,
)


class TokenService:
    """
    Servicio para operaciones con tokens JWT.

    Proporciona métodos para crear, validar y gestionar tokens JWT,
    así como configurar cookies seguras para refresh tokens.
    """

    @staticmethod
    def create_token_response(access_token: str, refresh_token: str) -> Response:
        """
        Crea una respuesta HTTP con el access token en JSON y refresh token en cookie.

        Args:
            access_token (str): Token de acceso JWT
            refresh_token (str): Token de renovación JWT

        Returns:
            Response: Respuesta HTTP configurada con tokens
        """
        response = Response({"access": access_token}, status=200)

        TokenService._set_refresh_cookie(response, refresh_token)
        return response

    @staticmethod
    def create_refresh_response(
        access_token: str, refresh_token: Optional[str] = None
    ) -> Response:
        """
        Crea una respuesta HTTP para renovación de tokens.

        Args:
            access_token (str): Nuevo token de acceso
            refresh_token (Optional[str]): Nuevo token de refresh (si aplica rotación)

        Returns:
            Response: Respuesta HTTP con tokens renovados
        """
        response_data = {"access": access_token}

        if refresh_token:
            response_data["refresh"] = refresh_token

        response = Response(response_data, status=200)

        # Actualizar la cookie si hay un nuevo refresh token
        if refresh_token:
            TokenService._set_refresh_cookie(response, refresh_token)

        return response

    @staticmethod
    def validate_token(token: str) -> bool:
        """
        Valida un token JWT.

        Args:
            token (str): Token a validar

        Returns:
            bool: True si el token es válido, False en caso contrario
        """
        try:
            UntypedToken(token)
            return True
        except (InvalidToken, TokenError):
            return False

    @staticmethod
    def extract_refresh_token_from_cookies(request) -> Optional[str]:
        """
        Extrae el refresh token de las cookies de la petición.

        Args:
            request: Objeto de petición HTTP

        Returns:
            Optional[str]: Refresh token si existe, None en caso contrario
        """
        return request.COOKIES.get(REFRESH_TOKEN_COOKIE_NAME)

    @staticmethod
    def clear_auth_cookies(response: HttpResponse) -> HttpResponse:
        """
        Limpia las cookies de autenticación de la respuesta.

        Args:
            response (HttpResponse): Respuesta HTTP a modificar

        Returns:
            HttpResponse: Respuesta con cookies limpiadas
        """
        response.delete_cookie(
            key=REFRESH_TOKEN_COOKIE_NAME, samesite=TokenService._get_cookie_samesite()
        )
        return response

    @staticmethod
    def set_csrf_cookie(response: HttpResponse, token: str) -> HttpResponse:
        """
        Configura la cookie CSRF en la respuesta.

        Args:
            response (HttpResponse): Respuesta HTTP a modificar
            token (str): Token CSRF a establecer

        Returns:
            HttpResponse: Respuesta con cookie CSRF configurada
        """
        response.set_cookie(
            CSRF_TOKEN_COOKIE_NAME,
            token,
            max_age=CSRF_TOKEN_MAX_AGE,
            path="/",
            domain=None,
            secure=settings.IS_PRODUCTION,
            httponly=False,
            samesite=(
                COOKIE_SAMESITE_NONE if settings.IS_PRODUCTION else COOKIE_SAMESITE_LAX
            ),
        )
        return response

    @staticmethod
    def _set_refresh_cookie(response: HttpResponse, refresh_token: str) -> None:
        """
        Configura la cookie del refresh token en la respuesta.

        Args:
            response (HttpResponse): Respuesta HTTP a modificar
            refresh_token (str): Token de refresh a establecer
        """
        response.set_cookie(
            key=REFRESH_TOKEN_COOKIE_NAME,
            value=refresh_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite=TokenService._get_cookie_samesite(),
            max_age=REFRESH_TOKEN_MAX_AGE,
        )

    @staticmethod
    def _get_cookie_samesite() -> str:
        """
        Determina el valor SameSite apropiado para las cookies según el entorno.

        Returns:
            str: Valor SameSite para las cookies
        """
        return COOKIE_SAMESITE_NONE if settings.IS_PRODUCTION else COOKIE_SAMESITE_LAX


class TokenValidationService:
    """
    Servicio especializado en validación de tokens.

    Proporciona métodos específicos para diferentes tipos de validaciones
    de tokens en contextos variados.
    """

    @staticmethod
    def validate_access_token(token: str) -> Tuple[bool, Optional[Dict]]:
        """
        Valida un token de acceso y extrae información.

        Args:
            token (str): Token de acceso a validar

        Returns:
            Tuple[bool, Optional[Dict]]: (es_válido, información_del_token)
        """
        try:
            validated_token = UntypedToken(token)
            return True, {
                "user_id": validated_token.get("user_id"),
                "exp": validated_token.get("exp"),
                "username": validated_token.get("username", ""),
            }
        except (InvalidToken, TokenError) as e:
            return False, {"error": str(e)}

    @staticmethod
    def is_token_expired(token: str) -> bool:
        """
        Verifica si un token ha expirado.

        Args:
            token (str): Token a verificar

        Returns:
            bool: True si el token ha expirado, False en caso contrario
        """
        try:
            UntypedToken(token)
            return False
        except TokenError as e:
            # Verificar si el error específicamente es por expiración
            return "expired" in str(e).lower()
        except InvalidToken:
            return True  # Token inválido se considera como expirado
