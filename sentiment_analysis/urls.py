from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from .views import ArticleView, AnalyzeArticleView, AnalyzeNewsView

router = routers.DefaultRouter()
router.register(r"articles", ArticleView, basename="articles")

urlpatterns = [
    path("", include(router.urls)),
    path("<int:pk>/analyze/", AnalyzeArticleView.as_view(), name="article-analyze"),
    path("news/<uuid:uuid>/analyze/", AnalyzeNewsView.as_view(), name="news-analyze"),
]
