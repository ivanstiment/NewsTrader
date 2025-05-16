import yfinance as yf
from datetime import datetime
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


def fetch_quotes(ticker: str, max_results: int = 10):
    try:
        search_instance = yf.Search(ticker, max_results=max_results)
        search_instance.timeout = 60
        return search_instance.quotes
    except requests.exceptions.ReadTimeout as e:
        raise Exception("Timeout al obtener quotes") from e
    except Exception as e:
        raise Exception("Error al obtener quotes") from e


def fetch_research(ticker: str):
    try:
        search_instance = yf.Search(ticker, include_research=True)
        search_instance.timeout = 60
        return search_instance.research
    except requests.exceptions.ReadTimeout as e:
        raise Exception("Timeout al obtener research") from e
    except Exception as e:
        raise Exception("Error al obtener research") from e


def parse_date(date_str: str):
    """Convierte una cadena en formato YYYY-MM-DD a un objeto date."""
    if date_str:
        try:
            return datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return None
    return None
