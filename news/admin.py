from django.contrib import admin
from .models import New, Research, Quote

admin.site.register([New, Research, Quote])