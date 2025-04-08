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

class Research(models.Model):
    # Usamos el campo 'research_id' para almacenar el id del reporte y lo definimos como primary key.
    research_id = models.CharField(max_length=100, primary_key=True)
    report_headline = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    # report_date se almacena como BigInteger, ya que la API lo devuelve en formato timestamp en milisegundos.
    report_date = models.BigIntegerField()
    provider = models.CharField(max_length=100)

    def __str__(self):
        return self.report_headline

class Quote(models.Model):
    exchange = models.CharField(max_length=50)
    shortname = models.CharField(max_length=255)
    quote_type = models.CharField(max_length=50)  # corresponde a "quoteType"
    # Se asume que "symbol" es único y lo usamos como identificador primario.
    symbol = models.CharField(max_length=50, primary_key=True)
    index = models.CharField(max_length=50)
    score = models.FloatField()
    type_disp = models.CharField(max_length=50)  # corresponde a "typeDisp"
    longname = models.CharField(max_length=255)
    exch_disp = models.CharField(max_length=50)  # corresponde a "exchDisp"
    sector = models.CharField(max_length=100)
    sector_disp = models.CharField(max_length=100)  # corresponde a "sectorDisp"
    industry = models.CharField(max_length=255)
    industry_disp = models.CharField(max_length=255)  # corresponde a "industryDisp"
    is_yahoo_finance = models.BooleanField(default=False)  # corresponde a "isYahooFinance"
    prev_name = models.CharField(max_length=255, null=True, blank=True)
    # nameChangeDate se almacena como DateField, asumiendo formato ISO (YYYY-MM-DD)
    name_change_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.shortname