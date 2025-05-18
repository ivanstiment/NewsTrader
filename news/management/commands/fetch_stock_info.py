import yfinance as yf
from django.core.management.base import BaseCommand
from news.models import Stock

class Command(BaseCommand):
    help = 'Fetches stock information and saves it to the database'
    def add_arguments(self, parser):
        parser.add_argument('ticker', type=str, help='Ticker symbol of the stock (e.g., MLGO)')
        
    def handle(self, *args, **options):
        ticker_symbol = options['ticker']
        self.stdout.write(f"Fetching stock information for {ticker_symbol}...")
        
        try:
            stock_info = yf.Ticker(ticker_symbol).info
            self.stdout.write(f"El stock_info: {stock_info}")
            stock, created = Stock.objects.update_or_create(
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
                    'dayLow': stock_info.get('dayLow'),
                    'dayHigh': stock_info.get('dayHigh'),
                    'regularMarketPreviousClose': stock_info.get('regularMarketPreviousClose'),
                    'regularMarketOpen': stock_info.get('regularMarketOpen'),
                    'regularMarketDayLow': stock_info.get('regularMarketDayLow'),
                    'regularMarketDayHigh': stock_info.get('regularMarketDayHigh'),
                    'volume': stock_info.get('volume'),
                    'averageVolume': stock_info.get('averageVolume'),
                    'averageVolume10days': stock_info.get('averageVolume10days'),
                    'averageDailyVolume10Day': stock_info.get('averageDailyVolume10Day'),
                    'bid': stock_info.get('bid'),
                    'ask': stock_info.get('ask'),
                    'bidSize': stock_info.get('bidSize'),
                    'askSize': stock_info.get('askSize'),
                    'marketCap': stock_info.get('marketCap'),
                    'fiftyTwoWeekLow': stock_info.get('fiftyTwoWeekLow'),
                    'fiftyTwoWeekHigh': stock_info.get('fiftyTwoWeekHigh'),
                    'priceToSalesTrailing12Months': stock_info.get('priceToSalesTrailing12Months'),
                    'fiftyDayAverage': stock_info.get('fiftyDayAverage'),
                    'twoHundredDayAverage': stock_info.get('twoHundredDayAverage'),
                    'payoutRatio': stock_info.get('payoutRatio'),
                    'beta': stock_info.get('beta'),
                    'currency': stock_info.get('currency'),
                    'tradeable': stock_info.get('tradeable'),
                    'enterpriseValue': stock_info.get('enterpriseValue'),
                    'profitMargins': stock_info.get('profitMargins'),
                    'floatShares': stock_info.get('floatShares'),
                    'sharesOutstanding': stock_info.get('sharesOutstanding'),
                    'sharesShort': stock_info.get('sharesShort'),
                    'sharesShortPriorMonth': stock_info.get('sharesShortPriorMonth'),
                    'dateShortInterest': stock_info.get('dateShortInterest'),
                    'sharesPercentSharesOut': stock_info.get('sharesPercentSharesOut'),
                    'heldPercentInsiders': stock_info.get('heldPercentInsiders'),
                    'heldPercentInstitutions': stock_info.get('heldPercentInstitutions'),
                    'shortRatio': stock_info.get('shortRatio'),
                    'shortPercentOfFloat': stock_info.get('shortPercentOfFloat'),
                    'impliedSharesOutstanding': stock_info.get('impliedSharesOutstanding'),
                    'bookValue': stock_info.get('bookValue'),
                    'priceToBook': stock_info.get('priceToBook'),
                    'lastFiscalYearEnd': stock_info.get('lastFiscalYearEnd'),
                    'nextFiscalYearEnd': stock_info.get('nextFiscalYearEnd'),
                    'mostRecentQuarter': stock_info.get('mostRecentQuarter'),
                    'netIncomeToCommon': stock_info.get('netIncomeToCommon'),
                    'trailingEps': stock_info.get('trailingEps'),
                    'lastSplitFactor': stock_info.get('lastSplitFactor'),
                    'lastSplitDate': stock_info.get('lastSplitDate'),
                    'enterpriseToRevenue': stock_info.get('enterpriseToRevenue'),
                    'enterpriseToEbitda': stock_info.get('enterpriseToEbitda'),                    
                    'SandP52WeekChange': stock_info.get('SandP52WeekChange'),
                    'quoteType': stock_info.get('quoteType'),
                    'currentPrice': stock_info.get('currentPrice'),
                    'recommendationKey': stock_info.get('recommendationKey'),
                    'totalCash': stock_info.get('totalCash'),
                    'totalCashPerShare': stock_info.get('totalCashPerShare'),
                    'ebitda': stock_info.get('ebitda'),
                    'totalDebt': stock_info.get('totalDebt'),
                    'quickRatio': stock_info.get('quickRatio'),
                    'currentRatio': stock_info.get('currentRatio'),
                    'totalRevenue': stock_info.get('totalRevenue'),
                    'debtToEquity': stock_info.get('debtToEquity'),                    
                    'revenuePerShare': stock_info.get('revenuePerShare'),
                    'returnOnAssets': stock_info.get('returnOnAssets'),
                    'returnOnEquity': stock_info.get('returnOnEquity'),
                    'grossProfits': stock_info.get('grossProfits'),
                    'freeCashflow': stock_info.get('freeCashflow'),
                    'operatingCashflow': stock_info.get('operatingCashflow'),                    
                    'revenueGrowth': stock_info.get('revenueGrowth'),
                    'grossMargins': stock_info.get('grossMargins'),
                    'ebitdaMargins': stock_info.get('ebitdaMargins'),
                    'operatingMargins': stock_info.get('operatingMargins'),
                    'financialCurrency': stock_info.get('financialCurrency'),    
                    'shortName': stock_info.get('shortName'),
                    'longName': stock_info.get('longName'),
                    'marketState': stock_info.get('marketState'),
                    'regularMarketTime': stock_info.get('regularMarketTime'),
                    'exchange': stock_info.get('exchange'),
                    'exchangeTimezoneName': stock_info.get('exchangeTimezoneName'),
                    'exchangeTimezoneShortName': stock_info.get('exchangeTimezoneShortName'),
                    'gmtoffsetMilliseconds': stock_info.get('gmtoffsetMilliseconds'),
                    'market': stock_info.get('market'),
                    'esgPopulated': stock_info.get('esgPopulated'),
                    'hasPrePostMarketData': stock_info.get('hasPrePostMarketData'),
                    'sourceInterval': stock_info.get('sourceInterval'),
                    'exchangeDataDelayedBy': stock_info.get('exchangeDataDelayedBy'),
                    'cryptoTradeable': stock_info.get('cryptoTradeable'),
                    'firstTradeDateMilliseconds': stock_info.get('firstTradeDateMilliseconds'),
                    'regularMarketChange': stock_info.get('regularMarketChange'),
                    'regularMarketDayRange': stock_info.get('regularMarketDayRange'),
                    'averageDailyVolume3Month': stock_info.get('averageDailyVolume3Month'),
                    'fiftyTwoWeekLowChange': stock_info.get('fiftyTwoWeekLowChange'),
                    'fiftyTwoWeekLowChangePercent': stock_info.get('fiftyTwoWeekLowChangePercent'),
                    'fiftyTwoWeekRange': stock_info.get('fiftyTwoWeekRange'),
                    'regularMarketDayRange': stock_info.get('regularMarketDayRange'),
                    'fiftyTwoWeekHighChange': stock_info.get('fiftyTwoWeekHighChange'),
                    'fiftyTwoWeekHighChangePercent': stock_info.get('fiftyTwoWeekHighChangePercent'),
                    'epsTrailingTwelveMonths': stock_info.get('epsTrailingTwelveMonths'),
                    'displayName': stock_info.get('displayName'),
                    'trailingPegRatio': stock_info.get('trailingPegRatio'),
                    'executiveTeam': stock_info.get('executiveTeam'),
                    'corporateActions': stock_info.get('corporateActions'),
                    'additional_info': stock_info.get('additional_info')
                }
            )
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} stock: {stock.shortName}")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error fetching stock information: {e}"))