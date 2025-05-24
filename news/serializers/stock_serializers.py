from rest_framework import serializers
from ..models import Stock, HistoricalPrice


class StocksSerializer(serializers.ModelSerializer):
    """
    Serializer para información de stocks
    """
    # Campos calculados opcionales
    price_change = serializers.SerializerMethodField()
    price_change_percent = serializers.SerializerMethodField()
    
    class Meta:
        model = Stock
        fields = "__all__"
        
    def get_price_change(self, obj):
        """
        Calcula el cambio de precio
        """
        if hasattr(obj, 'previous_close') and obj.previous_close:
            return obj.regular_market_price - obj.previous_close
        return None
        
    def get_price_change_percent(self, obj):
        """
        Calcula el porcentaje de cambio
        """
        if hasattr(obj, 'previous_close') and obj.previous_close and obj.previous_close != 0:
            change = obj.regular_market_price - obj.previous_close
            return (change / obj.previous_close) * 100
        return None


class HistoricalPriceSerializer(serializers.ModelSerializer):
    """
    Serializer para precios históricos
    """
    daily_change = serializers.SerializerMethodField()
    
    class Meta:
        model = HistoricalPrice
        fields = "__all__"
        
    def get_daily_change(self, obj):
        """
        Calcula el cambio diario (close - open)
        """
        if obj.close and obj.open:
            return obj.close - obj.open
        return None


class StockSummarySerializer(serializers.ModelSerializer):
    """
    Serializer resumido para listas de stocks
    """
    class Meta:
        model = Stock
        fields = ['symbol', 'company_name', 'regular_market_price', 'market_cap']