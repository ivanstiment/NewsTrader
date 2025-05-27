from django.urls import path, include
from rest_framework import routers
from .views import (
    NewsView,
    StocksView,
    StockDetailView,
    get_historical_prices
)

router = routers.DefaultRouter()
router.register(r"news", NewsView, basename="news")
router.register(r"stocks", StocksView, basename="stocks")

urlpatterns = [
    path("", include(router.urls)),
    path("new/", include(router.urls)),
    path("stock/<str:symbol>/", StockDetailView.as_view(), name="stock_detail"),
    path("historical-price/<str:symbol>/", get_historical_prices, name="historical_prices")
    
]