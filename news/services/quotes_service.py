import yfinance as yf
import requests


def fetch_quotes(ticker: str, max_results: int = 10):
    try:
        search_instance = yf.Search(ticker, max_results=max_results)
        search_instance.timeout = 60
        return search_instance.quotes
    except requests.exceptions.ReadTimeout as e:
        raise Exception("Timeout al obtener quotes") from e
    except Exception as e:
        raise Exception("Error al obtener quotes") from e