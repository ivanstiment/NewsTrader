from django.db import models
from django.utils import timezone
import uuid

class New(models.Model):
    # Usamos UUIDField para el identificador único, asumiendo que el valor es un UUID válido
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    publisher = models.CharField(max_length=255)
    link = models.URLField()
    # Se almacena como entero; si se tiene que convertir a datetime, se puede hacer en la lógica de la aplicación
    provider_publish_time = models.BigIntegerField()
    # Campo para el tipo de noticia
    news_type = models.CharField(max_length=50)
    # Usamos JSONField para almacenar el diccionario "thumbnail" que incluye la lista de resoluciones
    thumbnail = models.JSONField(null=True, blank=True)
    # Usamos JSONField para almacenar la lista de tickers relacionados
    related_tickers = models.JSONField(null=True, blank=True)

    # dato que se va a observar en el listado dentro de /admin
    def __str__(self):
        return self.title

class Research(models.Model):
    # Usamos el campo 'research_id' para almacenar el id del reporte y lo definimos como primary key.
    research_id = models.CharField(max_length=100, primary_key=True)
    report_headline = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    # report_date se almacena como BigInteger, ya que la API lo devuelve en formato timestamp en milisegundos.
    report_date = models.BigIntegerField()
    provider = models.CharField(max_length=100)

    def __str__(self):
        return self.report_headline

class Quote(models.Model):
    exchange = models.CharField(max_length=50)
    shortname = models.CharField(max_length=255)
    quote_type = models.CharField(max_length=50)  # corresponde a "quoteType"
    # Se asume que "symbol" es único y lo usamos como identificador primario.
    symbol = models.CharField(max_length=50, primary_key=True)
    index = models.CharField(max_length=50)
    score = models.FloatField()
    type_disp = models.CharField(max_length=50)  # corresponde a "typeDisp"
    longname = models.CharField(max_length=255)
    exch_disp = models.CharField(max_length=50)  # corresponde a "exchDisp"
    sector = models.CharField(max_length=100)
    sector_disp = models.CharField(max_length=100)  # corresponde a "sectorDisp"
    industry = models.CharField(max_length=255)
    industry_disp = models.CharField(max_length=255)  # corresponde a "industryDisp"
    is_yahoo_finance = models.BooleanField(default=False)  # corresponde a "isYahooFinance"
    prev_name = models.CharField(max_length=255, null=True, blank=True)
    # nameChangeDate se almacena como DateField, asumiendo formato ISO (YYYY-MM-DD)
    name_change_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.shortname


class Stock(models.Model):
    # Identificador del ticker
    symbol                 = models.CharField(max_length=20, unique=True)
    # Dirección y contacto
    address1               = models.CharField(max_length=255, blank=True, null=True)
    address2               = models.TextField(blank=True, null=True)
    city                   = models.CharField(max_length=100, blank=True, null=True)
    zip                    = models.CharField(max_length=20, blank=True, null=True)
    country                = models.CharField(max_length=100, blank=True, null=True)
    phone                  = models.CharField(max_length=50, blank=True, null=True)
    website                = models.URLField(blank=True, null=True)
    # Sector e industria
    industry               = models.CharField(max_length=100, blank=True, null=True)
    industryKey            = models.CharField(max_length=100, blank=True, null=True)
    industryDisp           = models.CharField(max_length=100, blank=True, null=True)
    sector                 = models.CharField(max_length=100, blank=True, null=True)
    sectorKey              = models.CharField(max_length=100, blank=True, null=True)
    sectorDisp             = models.CharField(max_length=100, blank=True, null=True)
    # Descripción y empleados
    longBusinessSummary    = models.TextField(blank=True, null=True)
    fullTimeEmployees      = models.IntegerField(blank=True, null=True)
    # Fechas como epoch
    compensationAsOfEpochDate = models.BigIntegerField(blank=True, null=True)
    maxAge                 = models.IntegerField(blank=True, null=True)
    # Datos de mercado
    previousClose          = models.FloatField(blank=True, null=True)
    open             = models.FloatField(blank=True, null=True)
    # open_price             = models.FloatField(blank=True, null=True)
    dayLow                 = models.FloatField(blank=True, null=True)
    dayHigh                = models.FloatField(blank=True, null=True)
    regularMarketPreviousClose = models.FloatField(blank=True, null=True)
    regularMarketOpen      = models.FloatField(blank=True, null=True)
    regularMarketDayLow    = models.FloatField(blank=True, null=True)
    regularMarketDayHigh   = models.FloatField(blank=True, null=True)
    volume                 = models.BigIntegerField(blank=True, null=True)
    averageVolume          = models.BigIntegerField(blank=True, null=True)
    averageVolume10days      = models.BigIntegerField(blank=True, null=True)
    averageDailyVolume10Day  =  models.BigIntegerField(blank=True, null=True)
    bid                    = models.FloatField(blank=True, null=True)
    ask                    = models.FloatField(blank=True, null=True)
    bidSize                = models.BigIntegerField(blank=True, null=True)
    askSize                = models.BigIntegerField(blank=True, null=True)
    marketCap              = models.BigIntegerField(blank=True, null=True)
    fiftyTwoWeekLow        = models.FloatField(blank=True, null=True)
    fiftyTwoWeekHigh       = models.FloatField(blank=True, null=True)
    priceToSalesTrailing12Months = models.FloatField(blank=True, null=True)
    fiftyDayAverage        = models.FloatField(blank=True, null=True)
    twoHundredDayAverage   = models.FloatField(blank=True, null=True)
    payoutRatio            = models.FloatField(blank=True, null=True)
    beta                   = models.FloatField(blank=True, null=True)
    currency               = models.CharField(max_length=10, blank=True, null=True)
    tradeable              = models.BooleanField(default=False)
    enterpriseValue        = models.BigIntegerField(blank=True, null=True)
    profitMargins          = models.FloatField(blank=True, null=True)
    floatShares            = models.BigIntegerField(blank=True, null=True)
    sharesOutstanding      = models.BigIntegerField(blank=True, null=True)
    sharesShort            = models.BigIntegerField(blank=True, null=True)
    sharesShortPriorMonth  = models.BigIntegerField(blank=True, null=True)
    dateShortInterest      = models.BigIntegerField(blank=True, null=True)
    sharesPercentSharesOut = models.FloatField(blank=True, null=True)
    heldPercentInsiders    = models.FloatField(blank=True, null=True)
    heldPercentInstitutions= models.FloatField(blank=True, null=True)
    shortRatio             = models.FloatField(blank=True, null=True)
    shortPercentOfFloat    = models.FloatField(blank=True, null=True)
    impliedSharesOutstanding = models.BigIntegerField(blank=True, null=True)
    bookValue              = models.FloatField(blank=True, null=True)
    priceToBook            = models.FloatField(blank=True, null=True)
    lastFiscalYearEnd      = models.BigIntegerField(blank=True, null=True)
    nextFiscalYearEnd      = models.BigIntegerField(blank=True, null=True)
    mostRecentQuarter      = models.BigIntegerField(blank=True, null=True)
    netIncomeToCommon      = models.BigIntegerField(blank=True, null=True)
    trailingEps            = models.FloatField(blank=True, null=True)
    lastSplitFactor        = models.CharField(max_length=50, blank=True, null=True)
    lastSplitDate          = models.BigIntegerField(blank=True, null=True)
    enterpriseToRevenue    = models.FloatField(blank=True, null=True)
    enterpriseToEbitda     = models.FloatField(blank=True, null=True)
    # fiftyTwoWeekChange     = models.FloatField(blank=True, null=True, db_column="52WeekChange")
    # week_52_change = models.FloatField(db_column='52WeekChange', blank=True, null=True, help_text="Cambio en 52 semanas")
    SandP52WeekChange      = models.FloatField(blank=True, null=True)
    quoteType              = models.CharField(max_length=50, blank=True, null=True)
    currentPrice           = models.FloatField(blank=True, null=True)
    recommendationKey      = models.CharField(max_length=50, blank=True, null=True)
    totalCash              = models.BigIntegerField(blank=True, null=True)
    totalCashPerShare      = models.FloatField(blank=True, null=True)
    ebitda                 = models.BigIntegerField(blank=True, null=True)
    totalDebt              = models.BigIntegerField(blank=True, null=True)
    quickRatio             = models.FloatField(blank=True, null=True)
    currentRatio           = models.FloatField(blank=True, null=True)
    totalRevenue           = models.BigIntegerField(blank=True, null=True)
    debtToEquity           = models.FloatField(blank=True, null=True)
    revenuePerShare        = models.FloatField(blank=True, null=True)
    returnOnAssets         = models.FloatField(blank=True, null=True)
    returnOnEquity         = models.FloatField(blank=True, null=True)
    grossProfits           = models.BigIntegerField(blank=True, null=True)
    freeCashflow           = models.BigIntegerField(blank=True, null=True)
    operatingCashflow      = models.BigIntegerField(blank=True, null=True)
    revenueGrowth          = models.FloatField(blank=True, null=True)
    grossMargins           = models.FloatField(blank=True, null=True)
    ebitdaMargins          = models.FloatField(blank=True, null=True)
    operatingMargins       = models.FloatField(blank=True, null=True)
    financialCurrency      = models.CharField(max_length=10, blank=True, null=True)
    shortName              = models.CharField(max_length=200, blank=True, null=True)
    longName               = models.CharField(max_length=200, blank=True, null=True)
    marketState            = models.CharField(max_length=50, blank=True, null=True)
    regularMarketTime      = models.BigIntegerField(blank=True, null=True)
    exchange               = models.CharField(max_length=50, blank=True, null=True)
    exchangeTimezoneName   = models.CharField(max_length=100, blank=True, null=True)
    exchangeTimezoneShortName = models.CharField(max_length=20, blank=True, null=True)
    gmtoffsetMilliseconds  = models.BigIntegerField(blank=True, null=True)
    market                 = models.CharField(max_length=50, blank=True, null=True)
    esgPopulated           = models.BooleanField(default=False)
    hasPrePostMarketData   = models.BooleanField(default=False)
    sourceInterval         = models.IntegerField(blank=True, null=True)
    exchangeDataDelayedBy  = models.IntegerField(blank=True, null=True)
    cryptoTradeable        = models.BooleanField(default=False)
    firstTradeDateMilliseconds = models.BigIntegerField(blank=True, null=True)
    regularMarketChange    = models.FloatField(blank=True, null=True)
    regularMarketDayRange  = models.CharField(max_length=50, blank=True, null=True)
    fullExchangeName       = models.CharField(max_length=100, blank=True, null=True)
    averageDailyVolume3Month = models.BigIntegerField(blank=True, null=True)
    fiftyTwoWeekLowChange  = models.FloatField(blank=True, null=True)
    fiftyTwoWeekLowChangePercent = models.FloatField(blank=True, null=True)
    fiftyTwoWeekRange      = models.CharField(max_length=100, blank=True, null=True)
    fiftyTwoWeekHighChange = models.FloatField(blank=True, null=True)
    fiftyTwoWeekHighChangePercent = models.FloatField(blank=True, null=True)
    epsTrailingTwelveMonths = models.FloatField(blank=True, null=True)
    displayName            = models.CharField(max_length=200, blank=True, null=True)
    trailingPegRatio       = models.CharField(max_length=50, blank=True, null=True)
    # Listas anidadas como JSON por si varían
    executiveTeam          = models.JSONField(blank=True, null=True)
    corporateActions       = models.JSONField(blank=True, null=True)
    additional_info = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.symbol

class CompanyOfficer(models.Model):
    stock       = models.ForeignKey(Stock, related_name="companyOfficers", on_delete=models.CASCADE)
    maxAge      = models.IntegerField(blank=True, null=True)
    name        = models.CharField(max_length=200)
    age         = models.IntegerField(blank=True, null=True)
    title       = models.CharField(max_length=200, blank=True, null=True)
    yearBorn    = models.IntegerField(blank=True, null=True)
    fiscalYear  = models.IntegerField(blank=True, null=True)
    totalPay    = models.BigIntegerField(blank=True, null=True)
    exercisedValue   = models.BigIntegerField(blank=True, null=True)
    unexercisedValue = models.BigIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.title})"