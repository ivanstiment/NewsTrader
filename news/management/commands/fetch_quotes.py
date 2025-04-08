from django.core.management.base import BaseCommand
import yfinance as yf
from news.models import Quote
from datetime import datetime
import requests

class Command(BaseCommand):
    help = 'Obtiene quotes de yfinance y los almacena en la base de datos'

    def add_arguments(self, parser):
        # Ticker es un argumento posicional obligatorio
        parser.add_argument(
            'ticker',
            type=str,
            help='Ticker de la empresa para la búsqueda'
        )
        parser.add_argument(
            '--max_results',
            type=int,
            default=10,
            help='Número máximo de quotes a obtener (por defecto: 10)'
        )

    def handle(self, *args, **options):
        ticker = options['ticker']
        max_results = options['max_results']
        self.stdout.write(f"Obteniendo {max_results} quotes para el ticker {ticker}...")

        try:
            search_instance = yf.Search(ticker, max_results=max_results)
            # Aumenta el timeout si es necesario
            search_instance.timeout = 60
            quotes_list = search_instance.quotes
        except requests.exceptions.ReadTimeout:
            self.stdout.write(self.style.ERROR(
                "La petición a Yahoo Finance agotó el tiempo de espera (timeout). "
                "Intenta aumentar el timeout o verifica tu conexión a internet."
            ))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Ocurrió un error: {e}"))
            return

        for quote_data in quotes_list:
            exchange = quote_data.get('exchange')
            shortname = quote_data.get('shortname')
            quote_type = quote_data.get('quoteType')
            symbol = quote_data.get('symbol')
            index_val = quote_data.get('index')
            score = quote_data.get('score')
            type_disp = quote_data.get('typeDisp')
            longname = quote_data.get('longname') or ''
            exch_disp = quote_data.get('exchDisp')
            # Si algun campo es None, se asigna una cadena vacía para evitar el error de NOT NULL.
            sector = quote_data.get('sector') or ''
            sector_disp = quote_data.get('sectorDisp') or ''
            industry = quote_data.get('industry') or ''
            industry_disp = quote_data.get('industryDisp') or ''
            is_yahoo_finance = quote_data.get('isYahooFinance')
            prev_name = quote_data.get('prevName')
            name_change_date = quote_data.get('nameChangeDate')

            # Convertir la fecha de cambio de nombre al tipo date, si existe.
            if name_change_date:
                try:
                    name_change_date = datetime.strptime(name_change_date, "%Y-%m-%d").date()
                except ValueError:
                    name_change_date = None

            obj, created = Quote.objects.update_or_create(
                symbol=symbol,
                defaults={
                    'exchange': exchange,
                    'shortname': shortname,
                    'quote_type': quote_type,
                    'index': index_val,
                    'score': score,
                    'type_disp': type_disp,
                    'longname': longname,
                    'exch_disp': exch_disp,
                    'sector': sector,
                    'sector_disp': sector_disp,
                    'industry': industry,
                    'industry_disp': industry_disp,
                    'is_yahoo_finance': is_yahoo_finance,
                    'prev_name': prev_name,
                    'name_change_date': name_change_date,
                }
            )
            action = "Creado" if created else "Actualizado"
            self.stdout.write(f"{action} quote: {symbol}")

        self.stdout.write(self.style.SUCCESS("Proceso finalizado."))