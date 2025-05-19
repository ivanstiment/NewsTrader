from django.apps import AppConfig


class SentimentAnalysisConfig(AppConfig):
    name = "sentiment_analysis"
    verbose_name = "Análisis de Sentimientos"
    def ready(self):
        import sentiment_analysis.signals  # noqa