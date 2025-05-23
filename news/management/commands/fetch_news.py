from django.core.management.base import BaseCommand
import yfinance as yf
from news.models import New


class Command(BaseCommand):
    help = "Obtiene y almacena noticias usando la API de yfinance."

    def add_arguments(self, parser):
        parser.add_argument("ticker", type=str, help="Ticker a buscar")
        parser.add_argument(
            "--news_count", type=int, default=10, help="Cantidad de noticias a obtener"
        )

    def handle(self, *args, **options):
        ticker = options["ticker"].strip().upper()
        news_count = options["news_count"]

        if not ticker:
            self.stderr.write(self.style.ERROR("El ticker no puede estar vacío."))
            return

        if news_count <= 0:
            self.stderr.write(
                self.style.ERROR("La cantidad de noticias debe ser un número positivo.")
            )
            return

        self.stdout.write(f"Obteniendo noticias para {ticker}...")

        try:
            search_result = yf.Search(ticker, news_count=news_count)
            news_list = search_result.news
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error al obtener noticias: {e}"))
            return

        if not news_list:
            self.stdout.write(self.style.WARNING("No se encontraron noticias."))
            return

        registros_creados = 0
        for news_data in news_list:
            uuid_val = news_data.get("uuid")
            title = news_data.get("title")
            publisher = news_data.get("publisher")
            link = news_data.get("link")
            provider_publish_time = news_data.get("providerPublishTime")
            news_type = news_data.get("type")
            thumbnail = news_data.get("thumbnail")
            related_tickers = news_data.get("relatedTickers")

            if not uuid_val or not title or not link:
                self.stderr.write(
                    self.style.WARNING("Noticia con datos incompletos, se omite.")
                )
                continue

            try:
                obj, created = New.objects.update_or_create(
                    uuid=uuid_val,
                    defaults={
                        "title": title,
                        "publisher": publisher,
                        "link": link,
                        "provider_publish_time": (
                            int(provider_publish_time)
                            if provider_publish_time
                            else None
                        ),
                        "news_type": news_type,
                        "thumbnail": thumbnail,
                        "related_tickers": related_tickers,
                    },
                )
                action = "Creada" if created else "Actualizada"
                self.stdout.write(f"{action} noticia: {title}")
                if created:
                    registros_creados += 1
            except Exception as e:
                self.stderr.write(
                    self.style.ERROR(f"Error al guardar la noticia '{title}': {e}")
                )
                continue

        self.stdout.write(
            self.style.SUCCESS(
                f"Proceso completado. {registros_creados} noticias nuevas añadidas."
            )
        )
