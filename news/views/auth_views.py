from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
import json


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Devuelve 'access' en JSON y guarda 'refresh' en una cookie HttpOnly.
    """
    permission_classes = [AllowAny]
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        resp = super().post(request, *args, **kwargs)
        data = resp.data
        response = Response({"access": data["access"]}, status=resp.status_code)
        
        response.set_cookie(
            key="refresh_token",
            value=data["refresh"],
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
        )
        return response


class CookieTokenRefreshView(TokenRefreshView):
    """
    Override para leer el refresh desde la cookie HttpOnly.
    """
    permission_classes = [AllowAny]
    serializer_class = TokenRefreshSerializer

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token")
        if not refresh:
            return Response({"detail": "Sin cookie de token de actualización"}, status=400)
        
        request.data["refresh"] = refresh
        return super().post(request, *args, **kwargs)


@require_http_methods(["GET"])
@ensure_csrf_cookie
def get_csrf_token(request):
    """
    Endpoint para obtener el token CSRF para el frontend
    """
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


@csrf_exempt
def register_user(request):
    """
    Registra un nuevo usuario con mejor manejo de errores.
    """
    if request.method == "POST":
        try:
            csrf_token = request.META.get("HTTP_X_CSRFTOKEN")
            if not csrf_token:
                return JsonResponse({"detail": "No hay token CSRF"}, status=403)

            data = json.loads(request.body)
            username = data.get("user")
            password = data.get("password")

            # Validaciones específicas de campo
            validation_errors = {}
            
            if not username:
                validation_errors["user"] = ["Este campo es requerido"]
            elif len(username.strip()) < 3:
                validation_errors["user"] = ["El nombre de usuario debe tener al menos 3 caracteres"]
            elif User.objects.filter(username=username).exists():
                validation_errors["user"] = ["Este nombre de usuario ya está en uso"]
                
            if not password:
                validation_errors["password"] = ["Este campo es requerido"]
            elif len(password) < 6:
                validation_errors["password"] = ["La contraseña debe tener al menos 6 caracteres"]

            # Si hay errores de validación, devolverlos como errores de campo
            if validation_errors:
                return JsonResponse(validation_errors, status=400)

            # Crear el usuario
            user = User.objects.create_user(
                username=username, password=password, is_active=True
            )
            user.save()

            return JsonResponse({"success": "Usuario creado con éxito"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"detail": "Formato de datos inválido"}, status=400)
        except Exception as e:
            return JsonResponse(
                {"detail": f"Error interno del servidor: {str(e)}"}, status=500
            )

    return JsonResponse({"detail": "Método no permitido"}, status=405)