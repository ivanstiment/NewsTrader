# 📁 news_trader/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Rutas API
    path("api/", include("news.urls")),
    path("api/", include("sentiment_analysis.urls")),
    path("api/", include("authentication.urls")),
    # DRF Spectacular schema y Swagger UI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]

# 🎨 SERVIR ARCHIVOS ESTÁTICOS EN PRODUCCIÓN
if not settings.DEBUG:
    # Método estándar
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # 🔧 BACKUP: Servir directamente si el método estándar falla
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', serve, {
            'document_root': settings.STATIC_ROOT,
        }),
    ]