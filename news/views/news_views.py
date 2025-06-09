from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from ..models import New
from ..serializers import NewsSerializer
from ..services import fetch_and_save_news
import logging

logger = logging.getLogger(__name__)

class NewsView(viewsets.ModelViewSet):
    """
    ViewSet para gestionar noticias
    """
    permission_classes = [IsAuthenticated]
    serializer_class = NewsSerializer
    queryset = (
        New.objects.all()
        .select_related("analysis")
        .order_by("-provider_publish_time")
    )
    
    def get_queryset(self):
        """
        Personalizar queryset según filtros
        """
        queryset = super().get_queryset()
        
        return queryset

    @action(detail=False, methods=['post'], url_path='fetch-by-symbol')
    def fetch_by_symbol(self, request):
        """
        Endpoint para buscar y guardar noticias por símbolo
        """
        symbol = request.data.get('symbol', '').strip().upper()
        news_count = request.data.get('news_count', 10)
        
        # Validaciones
        if not symbol:
            return Response(
                {'error': 'El símbolo es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not isinstance(news_count, int) or news_count <= 0:
            return Response(
                {'error': 'El número de noticias debe ser un número positivo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if news_count > 50:
            return Response(
                {'error': 'El número de noticias no puede ser mayor a 50'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Usar el servicio para buscar y guardar noticias
            result = fetch_and_save_news(symbol, news_count)
            
            return Response({
                'message': f'Proceso completado para {symbol}',
                'symbol': symbol,
                'total_fetched': result['total_fetched'],
                'total_saved': result['total_saved'],
                'total_updated': result['total_updated'],
                'news': NewsSerializer(result['news_objects'], many=True).data
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            logger.warning(f"Error de validación al buscar noticias para {symbol}: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error inesperado al buscar noticias para {symbol}: {e}")
            return Response(
                {'error': 'Error interno del servidor'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='by-symbol/(?P<symbol>[^/.]+)')
    def get_by_symbol(self, request, symbol=None):
        """
        Obtener noticias filtradas por símbolo
        """
        if not symbol:
            return Response(
                {'error': 'El símbolo es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        symbol = symbol.upper()
        
        # Filtrar noticias que contengan el símbolo en related_tickers
        queryset = self.get_queryset().filter(
            related_tickers__icontains=symbol
        )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'symbol': symbol,
            'count': queryset.count(),
            'news': serializer.data
        })