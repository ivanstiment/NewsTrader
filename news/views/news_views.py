from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import New
from ..serializers import NewsSerializer


class NewsView(viewsets.ModelViewSet):
    """
    ViewSet para gestionar noticias
    """
    permission_classes = [IsAuthenticated]
    serializer_class = NewsSerializer
    queryset = (
        New.objects.all()
        .select_related("analysis")
        .order_by("-provider_publish_time")
    )
    
    def get_queryset(self):
        """
        Personalizar queryset según filtros
        """
        queryset = super().get_queryset()
        # Aquí puedes añadir filtros adicionales
        return queryset