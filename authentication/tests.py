"""
Tests para el módulo de autenticación.

Contiene tests unitarios e integración para verificar el correcto
funcionamiento de todos los componentes del sistema de autenticación.
"""

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
import json

from .services import TokenService, ValidationService, SecurityValidationService
from .constants import MESSAGES


class TokenServiceTests(TestCase):
    """Tests para el servicio de tokens JWT."""

    def setUp(self):
        """Configuración inicial para los tests."""
        self.user = User.objects.create_user(
            username="testuser", password="testpass123"
        )

    def test_validate_token_invalid(self):
        """Test validación de token inválido."""
        result = TokenService.validate_token("invalid_token")
        self.assertFalse(result)

    def test_extract_refresh_token_from_cookies(self):
        """Test extracción de refresh token desde cookies."""
        client = Client()
        client.cookies["refresh_token"] = "test_refresh_token"

        # Simular request con cookies
        response = client.get("/")
        token = TokenService.extract_refresh_token_from_cookies(response.wsgi_request)

        self.assertEqual(token, "test_refresh_token")

    def test_extract_refresh_token_missing(self):
        """Test extracción de refresh token cuando no existe."""
        client = Client()
        response = client.get("/")
        token = TokenService.extract_refresh_token_from_cookies(response.wsgi_request)

        self.assertIsNone(token)


class ValidationServiceTests(TestCase):
    """Tests para el servicio de validaciones."""

    def setUp(self):
        """Configuración inicial para los tests."""
        self.valid_data = {"user": "testuser", "password": "testpass123"}

        self.invalid_data = {"user": "ab", "password": "123"}  # Muy corto  # Muy corto

    def test_validate_registration_data_valid(self):
        """Test validación de datos de registro válidos."""
        is_valid, errors = ValidationService.validate_registration_data(self.valid_data)

        self.assertTrue(is_valid)
        self.assertEqual(len(errors), 0)

    def test_validate_registration_data_invalid(self):
        """Test validación de datos de registro inválidos."""
        is_valid, errors = ValidationService.validate_registration_data(
            self.invalid_data
        )

        self.assertFalse(is_valid)
        self.assertIn("user", errors)
        self.assertIn("password", errors)

    def test_validate_registration_data_duplicate_user(self):
        """Test validación con usuario duplicado."""
        # Crear usuario existente
        User.objects.create_user(username="testuser", password="pass123")

        is_valid, errors = ValidationService.validate_registration_data(self.valid_data)

        self.assertFalse(is_valid)
        self.assertIn("user", errors)
        self.assertIn(MESSAGES["USERNAME_EXISTS"], errors["user"])

    def test_validate_json_data_valid(self):
        """Test validación de datos JSON válidos."""
        from django.test import RequestFactory

        factory = RequestFactory()
        request = factory.post(
            "/", data=json.dumps(self.valid_data), content_type="application/json"
        )

        is_valid, data, error = ValidationService.validate_json_data(request)

        self.assertTrue(is_valid)
        self.assertEqual(data, self.valid_data)
        self.assertIsNone(error)

    def test_validate_json_data_invalid(self):
        """Test validación de datos JSON inválidos."""
        from django.test import RequestFactory

        factory = RequestFactory()
        request = factory.post(
            "/",
            data='{"invalid": json}',  # JSON malformado
            content_type="application/json",
        )

        is_valid, data, error = ValidationService.validate_json_data(request)

        self.assertFalse(is_valid)
        self.assertIsNone(data)
        self.assertIsNotNone(error)


class SecurityValidationServiceTests(TestCase):
    """Tests para el servicio de validaciones de seguridad."""

    def test_validate_request_method_allowed(self):
        """Test validación de método HTTP permitido."""
        from django.test import RequestFactory

        factory = RequestFactory()
        request = factory.post("/")

        result = SecurityValidationService.validate_request_method(
            request, ["POST", "GET"]
        )

        self.assertTrue(result)

    def test_validate_request_method_not_allowed(self):
        """Test validación de método HTTP no permitido."""
        from django.test import RequestFactory

        factory = RequestFactory()
        request = factory.delete("/")

        result = SecurityValidationService.validate_request_method(
            request, ["POST", "GET"]
        )

        self.assertFalse(result)

    def test_sanitize_user_input(self):
        """Test sanitización de entrada de usuario."""
        dangerous_input = "  <script>alert('xss')</script>  "
        expected_output = "scriptalert(xss)/script"
        # La función elimina espacios al inicio/final y caracteres peligrosos: < > " ' &
        result = SecurityValidationService.sanitize_user_input(dangerous_input)

        self.assertEqual(result, expected_output)

    def test_validate_password_strength_weak(self):
        """Test validación de contraseña débil."""
        weak_password = "123"

        is_strong, suggestions, score = (
            SecurityValidationService.validate_password_strength(weak_password)
        )

        self.assertFalse(is_strong)
        self.assertGreater(len(suggestions), 0)
        self.assertLess(score, 5)

    def test_validate_password_strength_strong(self):
        """Test validación de contraseña fuerte."""
        strong_password = "MyStr0ng!P@ssw0rd"

        is_strong, suggestions, score = (
            SecurityValidationService.validate_password_strength(strong_password)
        )

        self.assertTrue(is_strong)
        self.assertGreaterEqual(score, 5)


class AuthenticationViewsTests(TestCase):
    """Tests de integración para las vistas de autenticación."""

    def setUp(self):
        """Configuración inicial para los tests."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass123"
        )

    def test_health_check_endpoint(self):
        """Test del endpoint de health check."""
        url = reverse("auth_health_check")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "healthy")

    def test_auth_config_endpoint(self):
        """Test del endpoint de configuración de auth."""
        url = reverse("auth_config")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("csrf_required", response.data)
        self.assertIn("endpoints", response.data)

    def test_csrf_token_endpoint(self):
        """Test del endpoint de token CSRF."""
        url = reverse("auth_csrf_token")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertIn("csrfToken", response.json())

    def test_register_endpoint_valid_data(self):
        """Test del endpoint de registro con datos válidos."""
        # Primero obtener CSRF token
        csrf_response = self.client.get(reverse("auth_csrf_token"))
        csrf_token = csrf_response.json()["csrfToken"]

        url = reverse("auth_register")
        data = {"user": "newuser", "password": "newpass123"}

        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token,
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("message", response.json())

        # Verificar que el usuario fue creado
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_endpoint_invalid_data(self):
        """Test del endpoint de registro con datos inválidos."""
        # Primero obtener CSRF token
        csrf_response = self.client.get(reverse("auth_csrf_token"))
        csrf_token = csrf_response.json()["csrfToken"]

        url = reverse("auth_register")
        data = {"user": "ab", "password": "123"}  # Muy corto  # Muy corto

        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token,
        )

        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn("user", response_data)
        self.assertIn("password", response_data)

    def test_check_username_availability_available(self):
        """Test verificación de disponibilidad de username disponible."""
        url = reverse("auth_check_username")
        data = {"username": "availableuser"}

        response = self.client.post(
            url, data=json.dumps(data), content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["available"])

    def test_check_username_availability_taken(self):
        """Test verificación de disponibilidad de username ocupado."""
        url = reverse("auth_check_username")
        data = {"username": "testuser"}  # Usuario que ya existe

        response = self.client.post(
            url, data=json.dumps(data), content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["available"])
        self.assertIn("reason", response.json())


class AuthenticationFlowTests(TestCase):
    """Tests de flujo completo de autenticación."""

    def setUp(self):
        """Configuración inicial para los tests."""
        self.client = APIClient()
        self.username = "flowuser"
        self.password = "flowpass123"

        self.user = User.objects.create_user(
            username=self.username, password=self.password
        )

    def test_complete_auth_flow(self):
        """Test del flujo completo de autenticación."""
        # 1. Login
        login_url = reverse("auth_token_obtain")
        login_data = {"username": self.username, "password": self.password}

        login_response = self.client.post(
            login_url, data=json.dumps(login_data), content_type="application/json"
        )

        self.assertEqual(login_response.status_code, 200)
        self.assertIn("access", login_response.json())

        # 2. Verificar token
        access_token = login_response.json()["access"]
        verify_url = reverse("auth_verify_token")

        verify_response = self.client.get(
            verify_url, HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        self.assertEqual(verify_response.status_code, 200)
        self.assertTrue(verify_response.json()["valid"])

        # 3. Logout
        logout_url = reverse("auth_logout")

        logout_response = self.client.post(
            logout_url, HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        self.assertEqual(logout_response.status_code, 200)
        self.assertIn("message", logout_response.json())
