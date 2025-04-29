from django.shortcuts import render
from rest_framework import viewsets
from django.views.generic.list import ListView
from django.urls import reverse_lazy
from .models import New
from datetime import datetime
from .serializer import NewSerializer


# class ListaNews(ListView):
#     model = New
#     fields = '__all__'
#     context_object_name = 'news_list'
#
#     def news_list(request):
#         # Obtener todas las noticias y ordenarlas en forma descendente según el tiempo de publicación
#         news = New.objects.all().order_by('-provider_publish_time')
#
#         # Convertir el timestamp a un objeto datetime para cada noticia
#         for n in news:
#             n.published_date = datetime.fromtimestamp(n.provider_publish_time)
#
#         context = {'news_list': news}
#         return render(request, 'news/new_list.html', context)


class NewView(viewsets.ModelViewSet):
    serializer_class = NewSerializer
    queryset = New.objects.all()
