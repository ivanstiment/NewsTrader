from django.contrib import admin
from .models import New, Research, Quote, Stock, HistoricalPrice

admin.site.register([New, Research, Quote, Stock, HistoricalPrice])