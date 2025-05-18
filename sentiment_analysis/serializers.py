from rest_framework import serializers
from .models import Article, ArticleAnalysis, NewsAnalysis


class ArticleAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleAnalysis
        fields = [
            "sentiment_score",
            "sentiment_label",
            "combined_score",
            "relevance",
            "keyword_score",
            "ticker_count",
            "figures_count",
        ]


class ArticleSerializer(serializers.ModelSerializer):
    analysis = ArticleAnalysisSerializer(read_only=True)

    class Meta:
        model = Article
        fields = ["id", "ticker", "title", "content", "pub_date", "analysis"]

class NewsAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsAnalysis
        fields = [
            "sentiment_score",
            "sentiment_label",
            "combined_score",
            "relevance",
            "keyword_score",
            "ticker_count",
            "figures_count",
        ]
        read_only_fields = fields