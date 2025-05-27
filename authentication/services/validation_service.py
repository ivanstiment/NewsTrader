"""
Servicio de validación para autenticación.

Centraliza todas las validaciones relacionadas con autenticación,
registro de usuarios y seguridad de datos de entrada.
"""

import json
from typing import Dict, List, Optional, Tuple
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from authentication.constants import (
    VALIDATION_RULES,
    MESSAGES,
    HTTP_HEADERS,
)


class ValidationService:
    """
    Servicio principal de validaciones de autenticación.

    Proporciona métodos para validar datos de entrada, credenciales
    y otros aspectos de seguridad en el proceso de autenticación.
    """

    @staticmethod
    def validate_registration_data(data: Dict) -> Tuple[bool, Dict[str, List[str]]]:
        """
        Valida los datos de registro de usuario.

        Args:
            data (Dict): Datos de registro a validar

        Returns:
            Tuple[bool, Dict]: (es_válido, errores_por_campo)
        """
        errors = {}

        username = data.get("user", "").strip()
        password = data.get("password", "")

        # Validar username
        username_errors = ValidationService._validate_username(username)
        if username_errors:
            errors["user"] = username_errors

        # Validar password
        password_errors = ValidationService._validate_password(password)
        if password_errors:
            errors["password"] = password_errors

        return len(errors) == 0, errors

    @staticmethod
    def validate_csrf_token(request) -> Tuple[bool, Optional[str]]:
        """
        Valida la presencia del token CSRF en la petición.

        Args:
            request: Objeto de petición HTTP

        Returns:
            Tuple[bool, Optional[str]]: (es_válido, token_csrf)
        """
        csrf_token = request.META.get(HTTP_HEADERS["CSRF_TOKEN"])

        if not csrf_token:
            return False, None

        return True, csrf_token

    @staticmethod
    def validate_json_data(request) -> Tuple[bool, Optional[Dict], Optional[str]]:
        """
        Valida y parsea los datos JSON de la petición.

        Args:
            request: Objeto de petición HTTP

        Returns:
            Tuple[bool, Optional[Dict], Optional[str]]: (es_válido, datos, error)
        """
        try:
            data = json.loads(request.body)
            return True, data, None
        except json.JSONDecodeError as e:
            return False, None, MESSAGES["INVALID_DATA_FORMAT"]
        except Exception as e:
            return False, None, f"Error al procesar datos: {str(e)}"

    @staticmethod
    def _validate_username(username: str) -> List[str]:
        """
        Valida el nombre de usuario según las reglas de negocio.

        Args:
            username (str): Nombre de usuario a validar

        Returns:
            List[str]: Lista de errores encontrados
        """
        errors = []

        if not username:
            errors.append(MESSAGES["FIELD_REQUIRED"])
            return errors

        if len(username) < VALIDATION_RULES["MIN_USERNAME_LENGTH"]:
            errors.append(MESSAGES["USERNAME_TOO_SHORT"])

        if User.objects.filter(username=username).exists():
            errors.append(MESSAGES["USERNAME_EXISTS"])

        return errors

    @staticmethod
    def _validate_password(password: str) -> List[str]:
        """
        Valida la contraseña según las reglas de seguridad.

        Args:
            password (str): Contraseña a validar

        Returns:
            List[str]: Lista de errores encontrados
        """
        errors = []

        if not password:
            errors.append(MESSAGES["FIELD_REQUIRED"])
            return errors

        if len(password) < VALIDATION_RULES["MIN_PASSWORD_LENGTH"]:
            errors.append(MESSAGES["PASSWORD_TOO_SHORT"])

        return errors


class SecurityValidationService:
    """
    Servicio de validaciones de seguridad.

    Maneja validaciones específicas de seguridad como detección
    de patrones maliciosos, rate limiting, etc.
    """

    @staticmethod
    def validate_request_method(request, allowed_methods: List[str]) -> bool:
        """
        Valida que el método HTTP sea permitido.

        Args:
            request: Objeto de petición HTTP
            allowed_methods (List[str]): Métodos HTTP permitidos

        Returns:
            bool: True si el método es permitido
        """
        return request.method in allowed_methods

    @staticmethod
    def validate_user_credentials_format(
        username: str, password: str
    ) -> Tuple[bool, List[str]]:
        """
        Valida el formato básico de las credenciales de usuario.

        Args:
            username (str): Nombre de usuario
            password (str): Contraseña

        Returns:
            Tuple[bool, List[str]]: (es_válido, errores)
        """
        errors = []

        if not username or not username.strip():
            errors.append("Username no puede estar vacío")

        if not password:
            errors.append("Password no puede estar vacío")

        # Validaciones adicionales de formato
        if username and len(username.strip()) > 150:
            errors.append("Username demasiado largo")

        if password and len(password) > 128:
            errors.append("Password demasiado largo")

        return len(errors) == 0, errors

    @staticmethod
    def sanitize_user_input(data: str) -> str:
        """
        Sanitiza entrada de usuario para prevenir inyecciones básicas.

        Elimina los siguientes caracteres peligrosos:
        - < (menor que)
        - > (mayor que)
        - " (comillas dobles)
        - ' (comillas simples)
        - & (ampersand)

        También elimina espacios al inicio y final.

        Args:
            data (str): Datos a sanitizar

        Returns:
            str: Datos sanitizados sin caracteres peligrosos

        Example:
            >>> sanitize_user_input("  <script>alert('xss')</script>  ")
            "scriptalert(xss)/script"
        """
        if not isinstance(data, str):
            return str(data)

        # Sanitización básica - eliminar espacios
        sanitized = data.strip()

        # Remover caracteres potencialmente peligrosos para XSS
        dangerous_chars = ["<", ">", '"', "'", "&"]
        for char in dangerous_chars:
            sanitized = sanitized.replace(char, "")

        return sanitized

    @staticmethod
    def validate_password_strength(password: str) -> Tuple[bool, List[str], int]:
        """
        Valida la fortaleza de una contraseña.

        Args:
            password (str): Contraseña a evaluar

        Returns:
            Tuple[bool, List[str], int]: (es_fuerte, sugerencias, puntuación)
        """
        suggestions = []
        score = 0

        if len(password) >= 8:
            score += 2
        else:
            suggestions.append("Usar al menos 8 caracteres")

        if any(c.isupper() for c in password):
            score += 1
        else:
            suggestions.append("Incluir al menos una mayúscula")

        if any(c.islower() for c in password):
            score += 1
        else:
            suggestions.append("Incluir al menos una minúscula")

        if any(c.isdigit() for c in password):
            score += 1
        else:
            suggestions.append("Incluir al menos un número")

        if any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
            score += 2
        else:
            suggestions.append("Incluir al menos un carácter especial")

        # Penalizar patrones comunes
        common_patterns = ["123", "abc", "password", "admin"]
        for pattern in common_patterns:
            if pattern.lower() in password.lower():
                score -= 1
                suggestions.append(f"Evitar patrones comunes como '{pattern}'")

        is_strong = score >= 5
        return is_strong, suggestions, max(0, score)
