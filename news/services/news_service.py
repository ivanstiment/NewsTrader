import yfinance as yf
import requests
from django.db import transaction
from typing import Dict, List, Any
from ..models import New
import logging

logger = logging.getLogger(__name__)


def fetch_news(ticker: str, news_count: int = 10) -> List[Dict[str, Any]]:
    """
    Obtener noticias de yfinance para un ticker específico
    """
    try:
        search_instance = yf.Search(ticker, news_count=news_count)
        search_instance.timeout = 60
        return search_instance.news
    except requests.exceptions.ReadTimeout as e:
        raise Exception("Timeout al obtener noticias") from e
    except Exception as e:
        raise Exception("Error al obtener noticias") from e


def validate_news_data(news_data: Dict[str, Any]) -> bool:
    """
    Validar que los datos de la noticia tengan los campos requeridos
    """
    required_fields = ["uuid", "title", "link"]
    return all(news_data.get(field) for field in required_fields)


def process_news_item(news_data: Dict[str, Any]) -> tuple[New, bool]:
    """
    Procesar un elemento de noticia y crear/actualizar en la base de datos
    """
    uuid_val = news_data.get("uuid")
    title = news_data.get("title")
    publisher = news_data.get("publisher", "")
    link = news_data.get("link")
    provider_publish_time = news_data.get("providerPublishTime")
    news_type = news_data.get("type", "")
    thumbnail = news_data.get("thumbnail")
    related_tickers = news_data.get("relatedTickers", [])

    # Convertir provider_publish_time a int si es posible
    if provider_publish_time:
        try:
            provider_publish_time = int(provider_publish_time)
        except (ValueError, TypeError):
            provider_publish_time = None

    obj, created = New.objects.update_or_create(
        uuid=uuid_val,
        defaults={
            "title": title,
            "publisher": publisher,
            "link": link,
            "provider_publish_time": provider_publish_time,
            "news_type": news_type,
            "thumbnail": thumbnail,
            "related_tickers": related_tickers,
        },
    )

    return obj, created


@transaction.atomic
def fetch_and_save_news(ticker: str, news_count: int = 10) -> Dict[str, Any]:
    """
    Buscar noticias para un ticker y guardarlas en la base de datos
    """
    if not ticker or not ticker.strip():
        raise ValueError("El ticker no puede estar vacío")

    ticker = ticker.strip().upper()

    if news_count <= 0:
        raise ValueError("La cantidad de noticias debe ser un número positivo")

    logger.info(f"Obteniendo noticias para {ticker}...")

    try:
        news_list = fetch_news(ticker, news_count)
    except Exception as e:
        logger.error(f"Error al obtener noticias para {ticker}: {e}")
        raise

    if not news_list:
        logger.info(f"No se encontraron noticias para {ticker}")
        return {
            "total_fetched": 0,
            "total_saved": 0,
            "total_updated": 0,
            "news_objects": [],
        }

    saved_count = 0
    updated_count = 0
    news_objects = []

    for news_data in news_list:
        if not validate_news_data(news_data):
            logger.warning("Noticia con datos incompletos, se omite")
            continue

        try:
            obj, created = process_news_item(news_data)
            action = "creada" if created else "actualizada"
            logger.info(f"Noticia {action}: {obj.title}")

            if created:
                saved_count += 1
            else:
                updated_count += 1

            news_objects.append(obj)

        except Exception as e:
            logger.error(
                f"Error al procesar noticia '{news_data.get('title', 'Sin título')}': {e}"
            )
            continue

    result = {
        "total_fetched": len(news_list),
        "total_saved": saved_count,
        "total_updated": updated_count,
        "news_objects": news_objects,
    }

    logger.info(
        f"Proceso completado para {ticker}. "
        f"Obtenidas: {result['total_fetched']}, "
        f"Guardadas: {result['total_saved']}, "
        f"Actualizadas: {result['total_updated']}"
    )

    return result
