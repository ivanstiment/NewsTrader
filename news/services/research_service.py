import yfinance as yf
import requests


def fetch_research(ticker: str):
    try:
        search_instance = yf.Search(ticker, include_research=True)
        search_instance.timeout = 60
        return search_instance.research
    except requests.exceptions.ReadTimeout as e:
        raise Exception("Timeout al obtener research") from e
    except Exception as e:
        raise Exception("Error al obtener research") from e


