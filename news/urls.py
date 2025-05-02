from django.urls import path, include
from .views import MyTokenObtainPairView, NewView, register_user
# from .views import ListaNews, NewView
from django.contrib.auth.views import LogoutView
from rest_framework import routers
from news import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)

router = routers.DefaultRouter()
router.register(r'news', views.NewView, 'news')


urlpatterns = [
              path('new/', include(router.urls)),
              path('register/', register_user, name='register_user'),
              # path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
              path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
              path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
              # path('', ListaNews.as_view(), name='news_list'),
              # path('login/', Login.as_view(), name='login'),
              # path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
              # path('register/', Register.as_view(), name='registro'),
              # path('stock/<int:pk>', DetalleStock.as_view(), name='stock')
            ]