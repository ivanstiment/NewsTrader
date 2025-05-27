"""
Serializers para el módulo de autenticación.

Maneja la serialización y deserialización de datos para las operaciones
de autenticación, proporcionando una interfaz consistente para el intercambio
de datos entre el frontend y backend.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer as BaseTokenObtainPairSerializer,
    TokenRefreshSerializer as BaseTokenRefreshSerializer,
)


class UserInfoSerializer(serializers.ModelSerializer):
    """
    Serializer para información básica del usuario.

    Utilizado para respuestas que incluyen datos del usuario
    sin información sensible.
    """

    class Meta:
        model = User
        fields = ["id", "username", "is_active", "date_joined"]
        read_only_fields = ["id", "date_joined"]


class CustomTokenObtainPairSerializer(BaseTokenObtainPairSerializer):
    """
    Serializer personalizado para la obtención de tokens JWT.

    Extiende el serializer base para manejar respuestas personalizadas
    y potencial información adicional del usuario.
    """

    @classmethod
    def get_token(cls, user):
        """
        Genera el token JWT con información adicional del usuario.

        Args:
            user (User): Instancia del usuario autenticado

        Returns:
            token: Token JWT con claims personalizados
        """
        token = super().get_token(user)

        # Agregar claims personalizados si es necesario
        token["username"] = user.username
        token["is_active"] = user.is_active

        return token


class CustomTokenRefreshSerializer(BaseTokenRefreshSerializer):
    """
    Serializer personalizado para la renovación de tokens JWT.

    Permite manejar el refresh token desde cookies HTTP-only
    de manera transparente.
    """

    def validate(self, attrs):
        """
        Valida el token de refresh y genera un nuevo access token.

        Args:
            attrs (dict): Atributos del request

        Returns:
            dict: Tokens renovados

        Raises:
            ValidationError: Si el token de refresh es inválido
        """
        return super().validate(attrs)


class UserRegistrationSerializer(serializers.Serializer):
    """
    Serializer para el registro de nuevos usuarios.

    Valida los datos de entrada para la creación de usuarios,
    asegurando que cumplan con los requisitos de seguridad.
    """

    user = serializers.CharField(
        min_length=3, max_length=150, help_text="Nombre de usuario único"
    )

    password = serializers.CharField(
        min_length=6,
        max_length=128,
        write_only=True,
        help_text="Contraseña del usuario",
    )

    def validate_user(self, value):
        """
        Valida que el nombre de usuario sea único.

        Args:
            value (str): Nombre de usuario a validar

        Returns:
            str: Nombre de usuario validado

        Raises:
            ValidationError: Si el usuario ya existe
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso")
        return value.strip()

    def validate_password(self, value):
        """
        Valida la fortaleza de la contraseña.

        Args:
            value (str): Contraseña a validar

        Returns:
            str: Contraseña validada
        """
        # Aquí se pueden agregar validaciones adicionales de contraseña
        return value

    def create(self, validated_data):
        """
        Crea un nuevo usuario con los datos validados.

        Args:
            validated_data (dict): Datos validados del usuario

        Returns:
            User: Nueva instancia de usuario creada
        """
        return User.objects.create_user(
            username=validated_data["user"],
            password=validated_data["password"],
            is_active=True,
        )


class TokenVerificationSerializer(serializers.Serializer):
    """
    Serializer para respuestas de verificación de token.

    Estructura la respuesta de validación de tokens incluyendo
    información del usuario y estado de validez.
    """

    valid = serializers.BooleanField(help_text="Indica si el token es válido")

    user = UserInfoSerializer(
        required=False, help_text="Información del usuario si el token es válido"
    )
