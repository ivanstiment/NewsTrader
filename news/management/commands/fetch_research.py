from django.core.management.base import BaseCommand
from models import Research
from services import fetch_research


class Command(BaseCommand):
    help = "Obtiene research de yfinance y lo almacena en la base de datos"

    def add_arguments(self, parser):
        parser.add_argument(
            "ticker", type=str, help="Ticker de la empresa a buscar (ej: MLGO)"
        )

    def handle(self, *args, **options):
        ticker = options["ticker"]
        self.stdout.write(f"Obteniendo research para el ticker {ticker}...")

        try:
            research_list = fetch_research(ticker)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))
            return

        if not research_list:
            self.stdout.write("No se obtuvieron datos de research.")
            return

        for research_data in research_list:
            research_id = research_data.get("id")
            report_headline = research_data.get("reportHeadline")
            author = research_data.get("author")
            report_date = research_data.get("reportDate")
            provider = research_data.get("provider")

            obj, created = Research.objects.update_or_create(
                research_id=research_id,
                defaults={
                    "report_headline": report_headline,
                    "author": author,
                    "report_date": report_date,
                    "provider": provider,
                },
            )
            action = "Creado" if created else "Actualizado"
            self.stdout.write(f"{action} research: {research_id}")

        self.stdout.write(self.style.SUCCESS("Proceso completado correctamente."))
