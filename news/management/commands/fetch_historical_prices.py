import yfinance as yf
from django.core.management.base import BaseCommand
from news.models import HistoricalPrice


class Command(BaseCommand):
    help = "Obtiene y guarda precios históricos de una acción usando yfinance"

    def add_arguments(self, parser):
        parser.add_argument("symbol", type=str, help="Símbolo de la acción (ej. MLGO)")
        parser.add_argument(
            "--period", type=str, default="1mo", help="Período (ej. 1mo, 3mo, 1y)"
        )
        parser.add_argument(
            "--interval", type=str, default="1d", help="Intervalo (ej. 1d, 1wk)"
        )

    def handle(self, *args, **kwargs):
        symbol = kwargs["symbol"].upper()
        period = kwargs["period"]
        interval = kwargs["interval"]

        self.stdout.write(f"Obteniendo datos para {symbol}...")

        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period, interval=interval)

        if df.empty:
            self.stdout.write(
                self.style.WARNING(f"No se encontraron datos para {symbol}")
            )
            return

        registros_creados = 0
        for fecha, fila in df.iterrows():
            obj, creado = HistoricalPrice.objects.update_or_create(
                symbol=symbol,
                date=fecha.date(),
                defaults={
                    "open": fila["Open"],
                    "high": fila["High"],
                    "low": fila["Low"],
                    "close": fila["Close"],
                    "volume": fila["Volume"],
                    "dividends": fila.get("Dividends", 0.0),
                    "stock_splits": fila.get("Stock Splits", 0.0),
                },
            )
            if creado:
                registros_creados += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Proceso completado. {registros_creados} registros nuevos añadidos."
            )
        )
