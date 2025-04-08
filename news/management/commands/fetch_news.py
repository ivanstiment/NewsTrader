from django.core.management.base import BaseCommand
import yfinance as yf
from news.models import New


class Command(BaseCommand):
    help = "Obtiene y almacena noticias usando la API de yfinance."

    def add_arguments(self, parser):
        parser.add_argument('ticker', type=str, help="Ticker a buscar")
        parser.add_argument('--news_count', type=int, default=10, help="Cantidad de noticias a obtener")

    def handle(self, *args, **options):
        ticker = options['ticker']
        news_count = options['news_count']

        self.stdout.write(f"Obteniendo noticias para {ticker}...")
        news_list = yf.Search(ticker, news_count=news_count).news

        for news_data in news_list:
            uuid_val = news_data.get('uuid')
            title = news_data.get('title')
            publisher = news_data.get('publisher')
            link = news_data.get('link')
            provider_publish_time = news_data.get('providerPublishTime')
            news_type = news_data.get('type')
            thumbnail = news_data.get('thumbnail')
            related_tickers = news_data.get('relatedTickers')

            obj, created = New.objects.update_or_create(
                uuid=uuid_val,
                defaults={
                    'title': title,
                    'publisher': publisher,
                    'link': link,
                    'provider_publish_time': provider_publish_time,
                    'news_type': news_type,
                    'thumbnail': thumbnail,
                    'related_tickers': related_tickers
                }
            )
            action = "Creada" if created else "Actualizada"
            self.stdout.write(f"{action} noticia: {title}")

        self.stdout.write(self.style.SUCCESS("Proceso completado correctamente."))