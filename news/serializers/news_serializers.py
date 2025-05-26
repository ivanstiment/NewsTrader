from rest_framework import serializers
from sentiment_analysis.serializers import (
    NewsAnalysisSerializer as SentimentAnalysisSerializer,
)
from ..models import New, NewsAnalysis


class NewsAnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer para análisis de noticias
    """

    class Meta:
        model = NewsAnalysis
        fields = "__all__"

    def validate(self, data):
        """
        Validaciones personalizadas si es necesario
        """
        return data


class NewsSerializer(serializers.ModelSerializer):
    """
    Serializer principal para noticias con análisis incluido
    """

    analysis = SentimentAnalysisSerializer(read_only=True)

    class Meta:
        model = New
        fields = "__all__"

    def to_representation(self, instance):
        """
        Personalizar la representación de salida
        """
        data = super().to_representation(instance)
        # Aquí puedes añadir lógica personalizada
        return data
