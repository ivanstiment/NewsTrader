from rest_framework import serializers
from sentiment_analysis.serializers import NewsAnalysisSerializer
from .models import New, NewsAnalysis, Stock, HistoricalPrice



class NewsSerializer(serializers.ModelSerializer):
    analysis = NewsAnalysisSerializer(read_only=True)
    class Meta:
        model = New
        fields = "__all__"

class NewsAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsAnalysis
        fields = "__all__"


class StocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"


class HistoricalPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalPrice
        fields = "__all__"
