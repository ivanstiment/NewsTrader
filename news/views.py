from django.shortcuts import render
from rest_framework import viewsets
from .models import New

class NewsView(viewsets.ModelViewSet):
    queryset = New.objects.all()

