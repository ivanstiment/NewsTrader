from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import viewsets, status
from django.views.generic.list import ListView
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse_lazy
from django.http import JsonResponse
from .models import New, Stock, HistoricalPrice
from datetime import datetime
from .serializer import NewSerializer, StockSerializer
import json
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
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


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['user_id'] = self.user.id
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        resp = super().post(request, *args, **kwargs)
        data = resp.data
        response = Response({'access': data['access']})
        # Set-Cookie HTTPOnly para refresh token
        response.set_cookie(
            key='refresh_token',
            value=data['refresh'],
            httponly=True,
            secure=True,
            samesite='Lax'
        )
        return response

class NewView(viewsets.ModelViewSet):
    serializer_class = NewSerializer
    queryset = New.objects.all()
    permission_classes = [IsAuthenticated]
    
class StockView(viewsets.ModelViewSet):
    serializer_class = StockSerializer
    queryset = Stock.objects.all()
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

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
            return Response({'message': 'Stock no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = StockSerializer(stock)
        data = serializer.data
        clean = sanitize_floats(data)
        return Response(clean, status=status.HTTP_200_OK)

def get_historical_prices(request, symbol):
    datos = HistoricalPrice.objects.filter(symbol=symbol.upper()).order_by('date')
    respuesta = [
        {
            'date': dato.date.isoformat(),                
            'open': dato.open,
            'high': dato.high,
            'low': dato.low,
            'close': dato.close,
            'volume': dato.volume
        }
        for dato in datos
    ]
    return JsonResponse(respuesta, safe=False)


@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('user')
        password = data.get('password')
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'El usuario ya existe'}, status=400)
        
        User.objects.create_user(username=username, password=password)
        return JsonResponse({'success': 'Usuario creado exitosamente'}, status=201)
    return JsonResponse({'error': 'Método no permitido'}, status=405)


def sanitize_floats(obj):
    """
    Recorre dicts y listas, reemplazando valores float infinitos o NaN por None.
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