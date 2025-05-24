import yfinance as yf
import requests


def fetch_news(ticker: str, news_count: int = 10):
    try:
        search_instance = yf.Search(ticker, news_count=news_count)
        # Puedes configurar un timeout mayor si lo requieres
        search_instance.timeout = 60
        return search_instance.news
    except requests.exceptions.ReadTimeout as e:
        raise Exception("Timeout al obtener noticias") from e
    except Exception as e:
        raise Exception("Error al obtener noticias") from e