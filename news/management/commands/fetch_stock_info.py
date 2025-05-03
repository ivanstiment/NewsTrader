# # import yfinance as yf

# # mlgo = yf.Ticker("MLGO")

# # mlgo_info=mlgo.info
# # print(mlgo)
# # print(mlgo_info)

# # app/stocks/management/commands/fetch_stock_info.py
# import time
# from django.core.management.base import BaseCommand
# import yfinance as yf
# from news.models import StockInfo, CompanyOfficer

# class Command(BaseCommand):
#     help = "Fetch stock info from yfinance and save to DB"

#     def add_arguments(self, parser):
#         parser.add_argument("symbol", type=str, help="Ticker symbol, e.g. MLGO")

#     def handle(self, *args, **options):
#         symbol = options["symbol"].upper()
#         ticker = yf.Ticker(symbol)
#         info = ticker.info

#         # Crear o actualizar StockInfo
#         stock, created = StockInfo.objects.update_or_create(
#             symbol=symbol,
#             defaults={k if k!="open" else "open_price": v for k,v in info.items()
#                       if k not in ("companyOfficers",)},
#         )
#         self.stdout.write(f"{'Created' if created else 'Updated'} {stock}")

#         # Persiste companyOfficers
#         stock.companyOfficers.all().delete()
#         for officer in info.get("companyOfficers", []):
#             CompanyOfficer.objects.create(
#                 stock=stock,
#                 maxAge=officer.get("maxAge"),
#                 name=officer.get("name",""),
#                 age=officer.get("age"),
#                 title=officer.get("title"),
#                 yearBorn=officer.get("yearBorn"),
#                 fiscalYear=officer.get("fiscalYear"),
#                 totalPay=officer.get("totalPay"),
#                 exercisedValue=officer.get("exercisedValue"),
#                 unexercisedValue=officer.get("unexercisedValue"),
#             )
#         self.stdout.write("Company officers saved.")

#         # Sleep breve para respetar rate limits
#         time.sleep(1)

import yfinance as yf
from django.core.management.base import BaseCommand
from news.models import StockInfo

class Command(BaseCommand):
    help = 'Fetches stock information and saves it to the database'
    def add_arguments(self, parser):
        parser.add_argument('ticker', type=str, help='Ticker symbol of the stock (e.g., MLGO)')
        
    def handle(self, *args, **options):
        ticker_symbol = options['ticker']
        self.stdout.write(f"Fetching stock information for {ticker_symbol}...")
        
        try:
            stock_info = yf.Ticker(ticker_symbol).info
            stock, created = StockInfo.objects.update_or_create(
                symbol=stock_info.get('symbol'),
                defaults={
                    # Dirección y contacto
                    'address1': stock_info.get('address1'),
                    'address2': stock_info.get('address2'),
                    'city': stock_info.get('city'),
                    'zip': stock_info.get('zip'),
                    'country': stock_info.get('country'),
                    'phone': stock_info.get('phone'),
                    'website': stock_info.get('website'),
                    # Sector e industria
                    'industry': stock_info.get('industry'),
                    'industryKey': stock_info.get('industryKey'),
                    'industryDisp': stock_info.get('industryDisp'),
                    'sector': stock_info.get('sector'),
                    'sectorKey': stock_info.get('sectorKey'),
                    'sectorDisp': stock_info.get('sectorDisp'),
                    # Descripción y empleados
                    'longBusinessSummary': stock_info.get('longBusinessSummary'),
                    'fullTimeEmployees': stock_info.get('fullTimeEmployees'),
                    # Fechas como epoch
                    'compensationAsOfEpochDate': stock_info.get('compensationAsOfEpochDate'),
                    'maxAge': stock_info.get('maxAge'),
                    # Datos de mercado
                    'previousClose': stock_info.get('previousClose'),
                    'open': stock_info.get('open'),
                    
                    'short_name': stock_info.get('shortName'),
                    'long_name': stock_info.get('longName'),
                    'market_cap': stock_info.get('marketCap'),
                    'current_price': stock_info.get('currentPrice'),
                    'previous_close': stock_info.get('previousClose'),
                    'open_price': stock_info.get('open'),
                    'day_low': stock_info.get('dayLow'),
                    'day_high': stock_info.get('dayHigh'),
                    'fifty_two_week_low': stock_info.get('fiftyTwoWeekLow'),
                    'fifty_two_week_high': stock_info.get('fiftyTwoWeekHigh'),
                    'volume': stock_info.get('volume'),
                    'average_volume': stock_info.get('averageVolume'),
                    'beta': stock_info.get('beta'),
                    'payout_ratio': stock_info.get('payoutRatio'),
                    'trailing_eps': stock_info.get('trailingEps'),
                    'currency': stock_info.get('currency'),
                }
            )
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} stock: {stock.short_name}")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error fetching stock information: {e}"))