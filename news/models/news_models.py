from django.db import models
import uuid


class New(models.Model):
    # Usamos UUIDField para el identificador único, asumiendo que el valor es un UUID válido
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    publisher = models.CharField(max_length=255)
    link = models.URLField()
    # Se almacena como entero; si se tiene que convertir a datetime, se puede hacer en la lógica de la aplicación
    provider_publish_time = models.BigIntegerField()
    # Campo para el tipo de noticia
    news_type = models.CharField(max_length=50)
    # Usamos JSONField para almacenar el diccionario "thumbnail" que incluye la lista de resoluciones
    thumbnail = models.JSONField(null=True, blank=True)
    # Usamos JSONField para almacenar la lista de tickers relacionados
    related_tickers = models.JSONField(null=True, blank=True)

    # dato que se va a observar en el listado dentro de /admin
    def __str__(self):
        return self.title

class NewsAnalysis(models.Model):
    news = models.OneToOneField(
        New,
        on_delete=models.CASCADE,
        related_name="analysis"
    )
    sentiment_score  = models.FloatField()
    sentiment_label  = models.CharField(max_length=10)
    combined_score   = models.FloatField()
    relevance        = models.CharField(max_length=6)
    keyword_score    = models.FloatField()
    ticker_count     = models.IntegerField()
    figures_count    = models.IntegerField()
