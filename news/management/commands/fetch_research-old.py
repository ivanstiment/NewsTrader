from django.core.management.base import BaseCommand
import yfinance as yf
from news.models import Research

class Command(BaseCommand):
    help = 'Obtiene research de yfinance y lo almacena en la base de datos'

    def add_arguments(self, parser):
        # Ticker como argumento posicional obligatorio
        parser.add_argument(
            'ticker',
            type=str,
            help='Ticker de la empresa a buscar (ej: MLGO)'
        )

    def handle(self, *args, **options):
        ticker = options['ticker']
        self.stdout.write(f"Obteniendo research para el ticker {ticker}...")

        try:
            # Se realiza la búsqueda incluyendo la sección de research
            search_instance = yf.Search(ticker, include_research=True)
            research_list = search_instance.research
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error al obtener research: {e}"))
            return

        if not research_list:
            self.stdout.write("No se obtuvieron datos de research.")
            return

        for research_data in research_list:
            report_headline = research_data.get('reportHeadline')
            author = research_data.get('author')
            report_date = research_data.get('reportDate')
            research_id = research_data.get('id')
            provider = research_data.get('provider')

            # Guarda o actualiza el registro en la base de datos usando update_or_create
            obj, created = Research.objects.update_or_create(
                research_id=research_id,
                defaults={
                    'report_headline': report_headline,
                    'author': author,
                    'report_date': report_date,
                    'provider': provider,
                }
            )
            action = "Creado" if created else "Actualizado"
            self.stdout.write(f"{action} research: {research_id}")

        self.stdout.write(self.style.SUCCESS("Proceso finalizado correctamente."))