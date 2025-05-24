from django.urls import path, include
from rest_framework import routers
from .views import (
    MyTokenObtainPairView,
    CookieTokenRefreshView,
    NewsView,
    StocksView,
    StockDetailView,
    get_historical_prices,
    register_user,
    get_csrf_token,
)

router = routers.DefaultRouter()
router.register(r"news", NewsView, basename="news")
router.register(r"stocks", StocksView, basename="stocks")

urlpatterns = [
    # API REST
    path("", include(router.urls)),
    path("new/", include(router.urls)),
    path("stock/<str:symbol>/", StockDetailView.as_view(), name="stock_detail"),
    path("historical-price/<str:symbol>/", get_historical_prices, name="historical_prices"),
    path("register/", register_user, name="register_user"),
    path("csrf/", get_csrf_token, name="get_csrf_token"),
    
    # JWT auth
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
]