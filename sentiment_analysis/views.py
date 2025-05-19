from rest_framework import viewsets
from .models import Article, ArticleAnalysis
from .serializers import ArticleSerializer, ArticleAnalysisSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from .tasks import analyze_article, analyze_news_title
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound


class AnalyzeNewsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, uuid):
        # Validamos que exista la noticia
        from news.models import New

        if not New.objects.filter(uuid=uuid).exists():
            raise NotFound(
                {"detail": "Noticia no encontrada"}, code=status.HTTP_404_NOT_FOUND
            )

        analyze_news_title.delay(uuid)
        return Response(
            {"status": "enqueued", "news": uuid}, status=status.HTTP_202_ACCEPTED
        )


class ArticleView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ArticleSerializer
    queryset = Article.objects.all().order_by("-pub_date")

    @action(detail=True, methods=["post"])
    def analyze(self, request, pk=None):
        analyze_article.delay(pk)
        return Response({"status": "enqueued"})


class AnalyzeArticleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        # Lanza el análisis en segundo plano
        analyze_article.delay(pk)
        return Response({"status": "enqueued"}, status=status.HTTP_202_ACCEPTED)

    def post(self, request, pk):
        # opcionalmente permitir POST también
        return self.get(request, pk)
