from django.urls import path
from .views import ListaNews
from django.contrib.auth.views import LogoutView
from .views import news_list


urlpatterns = [path('news/', news_list, name='news_list'),
                # path('', ListaNews.as_view(), name='news')
               # path('login/', Logueo.as_view(), name='login'),
               # path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
               # path('registro/', Registro.as_view(), name='registro'),
               # path('tarea/<int:pk>', DetalleTarea.as_view(), name='tarea'),
               # path('crear-tarea/', CrearTarea.as_view(), name='crear-tarea'),
               # path('editar-tarea/<int:pk>', EditarTarea.as_view(), name='editar-tarea'),
               # path('eliminar-tarea/<int:pk>', EliminarTarea.as_view(), name='eliminar-tarea')
               ]