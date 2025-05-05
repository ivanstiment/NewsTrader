from rest_framework import serializers
from .models import New, Stock

class NewSerializer(serializers.ModelSerializer):
    class Meta:
        model = New
        fields = '__all__'

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'