import math
from datetime import datetime


def sanitize_floats(obj):
    """
    Reemplaza float infinitos o NaN por None en JSON serializable.
    """
    if isinstance(obj, float):
        if math.isinf(obj) or math.isnan(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: sanitize_floats(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_floats(v) for v in obj]
    else:
        return obj


def format_currency(amount, currency="USD"):
    """
    Formatea cantidades monetarias
    """
    if amount is None:
        return None
    return f"{amount:.2f} {currency}"


def calculate_percentage_change(old_value, new_value):
    """
    Calcula el cambio porcentual entre dos valores
    """
    if old_value == 0:
        return 0
    return ((new_value - old_value) / old_value) * 100


def parse_date(date_str: str):
    """Convierte una cadena en formato YYYY-MM-DD a un objeto date."""
    if date_str:
        try:
            return datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return None
    return None
