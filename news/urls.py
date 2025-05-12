from django.urls import path, include
from .views import CustomTokenObtainPairView, MyTokenObtainPairView, NewView, register_user, StockDetailView, get_historical_prices, StockView
from django.contrib.auth.views import LogoutView
from rest_framework import routers
from news import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)

router = routers.DefaultRouter()
router.register(r'news', views.NewView, basename='news')
router.register(r'stocks', views.StockView, basename='stocks')


urlpatterns = [
              path('', include(router.urls)),
              path('new/', include(router.urls)),
              path('stock/<str:symbol>/', StockDetailView.as_view(), name='stock_detail'),
              path('historical-price/<str:symbol>/', get_historical_prices),
              path('register/', register_user, name='register_user'),
              path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
              path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
              # path('search/', SearchView.as_view(), name='search'),
              # path('stock/<int:pk>', StockDetailView.as_view(), name='stock')
              # path('', ListaNews.as_view(), name='news_list'),
              # path('login/', Login.as_view(), name='login'),
              # path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
              # path('register/', Register.as_view(), name='registro')
            ]