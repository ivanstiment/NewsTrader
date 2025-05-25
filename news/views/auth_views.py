from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
import json


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Devuelve 'access' en JSON y guarda 'refresh' en una cookie HttpOnly.
    """
    permission_classes = [AllowAny]
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            resp = super().post(request, *args, **kwargs)
            data = resp.data
            response = Response({"access": data["access"]}, status=resp.status_code)
            
            response.set_cookie(
                key="refresh_token",
                value=data["refresh"],
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                max_age=60 * 60 * 24 * 7,  # 7 días
            )
            return response
        except Exception as e:
            # Manejar errores específicos de autenticación
            if "No active account found" in str(e):
                return Response(
                    {"detail": "Credenciales incorrectas. Verifica tu usuario y contraseña."},
                    status=401
                )
            return Response(
                {"detail": "Error de autenticación"},
                status=400
            )


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
            return Response(
                {"detail": "Sin cookie de token de actualización"}, 
                status=400
            )
        
        # Crear una copia mutable de request.data
        mutable_data = request.data.copy()
        mutable_data["refresh"] = refresh
        request._full_data = mutable_data
        
        try:
            resp = super().post(request, *args, **kwargs)
            
            # Si el refresh fue exitoso, actualizar la cookie con el nuevo refresh token
            if resp.status_code == 200 and "refresh" in resp.data:
                resp.set_cookie(
                    key="refresh_token",
                    value=resp.data["refresh"],
                    httponly=True,
                    secure=not settings.DEBUG,
                    samesite="Lax",
                    max_age=60 * 60 * 24 * 7,  # 7 días
                )
            
            return resp
        except Exception as e:
            return Response(
                {"detail": "Token de actualización inválido o expirado"},
                status=401
            )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_token(request):
    """
    Endpoint para verificar si el token de acceso es válido.
    """
    try:
        # Si llegamos aquí, el token es válido (verificado por IsAuthenticated)
        return Response({
            "valid": True,
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "is_active": request.user.is_active,
            }
        }, status=200)
    except Exception as e:
        return Response(
            {"detail": "Token inválido", "valid": False},
            status=401
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """
    Endpoint para cerrar sesión y limpiar cookies.
    """
    try:
        response = Response({
            "message": "Sesión cerrada correctamente"
        }, status=200)
        
        # Limpiar la cookie del refresh token
        response.delete_cookie(
            key="refresh_token",
            samesite="Lax"
        )
        
        return response
    except Exception as e:
        return Response(
            {"detail": "Error al cerrar sesión"},
            status=500
        )


@ensure_csrf_cookie
def get_csrf_token(request):
    """
    Endpoint para obtener el token CSRF para el frontend
    """
    token = get_token(request)
    print("Token CSRF:", token)
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
                username=username, 
                password=password, 
                is_active=True
            )
            user.save()

            return JsonResponse({
                "message": "Usuario creado con éxito",
                "user": {
                    "id": user.id,
                    "username": user.username
                }
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"detail": "Formato de datos inválido"}, status=400)
        except Exception as e:
            return JsonResponse(
                {"detail": f"Error interno del servidor: {str(e)}"}, 
                status=500
            )

    return JsonResponse({"detail": "Método no permitido"}, status=405)