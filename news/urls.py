from django.urls import path, include
from .views import NewView
# from .views import ListaNews, NewView
from django.contrib.auth.views import LogoutView
from rest_framework import routers
from news import views

router = routers.DefaultRouter()
router.register(r'news', views.NewView, 'news')


urlpatterns = [
    # path('', ListaNews.as_view(), name='news_list'),
              path('new/', include(router.urls)),
               # path('login/', Login.as_view(), name='login'),
               # path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
               # path('register/', Register.as_view(), name='registro'),
               # path('stock/<int:pk>', DetalleStock.as_view(), name='stock')
               ]