from django.contrib.auth.models import User
from django.conf import settings
from django.shortcuts import render
from django.views.generic.list import ListView
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from .models import New, Stock, HistoricalPrice
from .serializer import NewsSerializer, StocksSerializer
from datetime import datetime
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
import json
import math


# class ListaNews(ListView):
#     model = New
#     fields = '__all__'
#     context_object_name = 'news_list'
#
#     def news_list(request):
#         # Obtener todas las noticias y ordenarlas en forma descendente según el tiempo de publicación
#         news = New.objects.all().order_by('-provider_publish_time')
#
#         # Convertir el timestamp a un objeto datetime para cada noticia
#         for n in news:
#             n.published_date = datetime.fromtimestamp(n.provider_publish_time)
#
#         context = {'news_list': news}
#         return render(request, 'news/new_list.html', context)


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Devuelve 'access' en JSON y guarda 'refresh' en una cookie HttpOnly.
    """

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
            # secure=True,
            secure=not settings.DEBUG,
            samesite="Lax",
        )
        return response


class CookieTokenRefreshView(TokenRefreshView):
    """
    Override para leer el refresh desde la cookie HttpOnly en lugar de request.data.
    """

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
    # queryset = New.objects.all()
    queryset = New.objects.all().select_related("analysis").order_by("-provider_publish_time")


class StocksView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StocksSerializer
    queryset = Stock.objects.all()

    def list(self, request, *args, **kwargs):
        # Obtiene el queryset y serializa normalmente
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        # Aplica sanitización
        clean = sanitize_floats(data)
        return Response(clean, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        # Maneja GET /stocks/{pk}/
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


# @csrf_exempt
@ensure_csrf_cookie
def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("user")
        password = data.get("password")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "El usuario ya existe"}, status=400)

        User.objects.create_user(username=username, password=password)
        return JsonResponse({"success": "Usuario creado exitosamente"}, status=201)
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
