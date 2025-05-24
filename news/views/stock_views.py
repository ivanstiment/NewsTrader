from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..models import Stock, HistoricalPrice
from ..serializers import StocksSerializer
from ..utils.helpers import sanitize_floats


class StocksView(viewsets.ModelViewSet):
    """
    ViewSet para gestionar stocks
    """
    permission_classes = [IsAuthenticated]
    serializer_class = StocksSerializer
    queryset = Stock.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        clean_data = sanitize_floats(data)
        return Response(clean_data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        clean_data = sanitize_floats(data)
        return Response(clean_data, status=status.HTTP_200_OK)


class StockDetailView(APIView):
    """
    Vista detallada de un stock específico
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, symbol):
        stock = Stock.objects.filter(symbol__iexact=symbol).first()
        if not stock:
            return Response(
                {"message": "Stock no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = StocksSerializer(stock)
        data = serializer.data
        clean_data = sanitize_floats(data)
        return Response(clean_data, status=status.HTTP_200_OK)


def get_historical_prices(request, symbol):
    """
    Obtiene precios históricos de un stock
    """
    datos = HistoricalPrice.objects.filter(
        symbol=symbol.upper()
    ).order_by("date")
    
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