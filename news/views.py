from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from .models import New, Stock, HistoricalPrice
from .serializer import NewsSerializer, StocksSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
import json
import math


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Devuelve 'access' en JSON y guarda 'refresh' en una cookie HttpOnly.
    """

    permission_classes = [AllowAny]  # Acceso anónimo
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        resp = super().post(request, *args, **kwargs)
        data = resp.data
        response = Response({"access": data["access"]}, status=resp.status_code)
        # Set-Cookie HTTPOnly para refresh token
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
    Override para leer el refresh desde la cookie HttpOnly en lugar de request.data.
    """

    permission_classes = [AllowAny]  # Acceso anónimo
    serializer_class = TokenRefreshSerializer
    serializer_class = TokenRefreshSerializer

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token")
        if not refresh:
            return Response({"detail": "No refresh token cookie"}, status=400)
        # inyectamos en request.data
        request.data["refresh"] = refresh
        return super().post(request, *args, **kwargs)


class NewsView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NewsSerializer
    queryset = (
        New.objects.all().select_related("analysis").order_by("-provider_publish_time")
    )


class StocksView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StocksSerializer
    queryset = Stock.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        clean = sanitize_floats(data)
        return Response(clean, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        clean = sanitize_floats(data)
        return Response(clean, status=status.HTTP_200_OK)


class StockDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, symbol):
        stock = Stock.objects.filter(symbol__iexact=symbol).first()
        if not stock:
            return Response(
                {"message": "Stock no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = StocksSerializer(stock)
        data = serializer.data
        clean = sanitize_floats(data)
        return Response(clean, status=status.HTTP_200_OK)


def get_historical_prices(request, symbol):
    datos = HistoricalPrice.objects.filter(symbol=symbol.upper()).order_by("date")
    respuesta = [
        {
            "date": dato.date.isoformat(),
            "open": dato.open,
            "high": dato.high,
            "low": dato.low,
            "close": dato.close,
            "volume": dato.volume,
        }
        for dato in datos
    ]
    return JsonResponse(respuesta, safe=False)


@require_http_methods(["GET"])
@ensure_csrf_cookie
def get_csrf_token(request):
    """
    Endpoint para obtener el token CSRF para el frontend
    """
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


@csrf_exempt  # We'll handle CSRF manually
def register_user(request):
    """
    Registra un nuevo usuario. Se asegura de que esté activo.
    """
    if request.method == "POST":
        try:
            # Comprobar el token CSRF manualmente
            csrf_token = request.META.get("HTTP_X_CSRFTOKEN")
            if not csrf_token:
                return JsonResponse({"error": "CSRF token missing"}, status=403)

            data = json.loads(request.body)
            username = data.get("user")
            password = data.get("password")

            if not username or not password:
                return JsonResponse(
                    {"error": "Usuario y contraseña son requeridos"}, status=400
                )

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "El usuario ya existe"}, status=400)

            # Create user and ensure it's active
            user = User.objects.create_user(
                username=username, password=password, is_active=True
            )
            user.save()

            return JsonResponse({"success": "Usuario creado exitosamente"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Formato de datos inválido"}, status=400)
        except Exception as e:
            return JsonResponse(
                {"error": f"Error interno del servidor: {str(e)}"}, status=500
            )

    return JsonResponse({"error": "Método no permitido"}, status=405)


def sanitize_floats(obj):
    """
    Reemplaza float infinitos o NaN por None en JSON serializable.
    """
    if isinstance(obj, float):
        if math.isinf(obj) or math.isnan(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: sanitize_floats(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_floats(v) for v in obj]
    else:
        return obj
