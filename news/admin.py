from django.contrib import admin
from .models import New, Research, Quote, Stock

admin.site.register([New, Research, Quote, Stock])