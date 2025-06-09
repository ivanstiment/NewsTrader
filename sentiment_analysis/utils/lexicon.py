#
# NewsTrader - Sistema automatizado de monitoreo y análisis de noticias
# Copyright 2025 Iván Soto Cobos
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import csv
import logging
from importlib import resources
from pathlib import Path
from typing import Set, Tuple
import re

logger = logging.getLogger(__name__)


def _load_loughran_column(column: str) -> Set[str]:
    """Extrae las palabras marcadas como positivas o negativas.

    El CSV oficial de Loughran–McDonald tiene una columna ``Word`` y columnas
    ``Positive`` y ``Negative`` que contienen el año de inclusión (p.ej. ``2009``)
    cuando la palabra pertenece a esa categoría.  Si el valor es ``0`` la palabra
    no pertenece a la lista.  Este helper devuelve el conjunto de palabras cuya
    marca en ``column`` es distinta de ``0``.
    """

    terms: Set[str] = set()

    with resources.open_text(
        "sentiment_analysis.utils.data", "loughran_landmcdonald.csv"
    ) as f:
        reader = csv.DictReader(f)

        if "Word" not in reader.fieldnames or column not in reader.fieldnames:
            logger.warning("CSV no tiene columnas requeridas: Word y %s", column)
            return terms

        for row in reader:
            value = row.get(column, "").strip()
            if value and value != "0":
                terms.add(row["Word"].strip().lower())

    logger.debug(
        "Loughran–McDonald %s: %d términos cargados", column, len(terms)
    )
    return terms


def _load_custom_csv(filename: str) -> Set[str]:
    """
    Carga un CSV custom con una columna 'term' que lista un término por fila.
    """
    terms = set()
    pkg = "sentiment_analysis.utils.data.custom"
    try:
        with resources.open_text(pkg, filename) as f:
            reader = csv.DictReader(f)
            if "term" not in reader.fieldnames:
                logger.warning("Custom CSV %s no tiene columna 'term'", filename)
                return terms
            for row in reader:
                t = row["term"].strip()
                if t and not t.startswith("#"):
                    terms.add(t.lower())
    except FileNotFoundError:
        logger.info("Custom CSV %s no encontrado, se ignora", filename)
    else:
        logger.debug("Custom CSV %s: %d términos cargados", filename, len(terms))
    return terms


def load_lexicons() -> (Tuple[Set[str], Set[str]]):
    """
    Retorna (POS_TERMS, NEG_TERMS), uniendo:
    - Loughran–McDonald
    - custom_positive.csv
    - custom_negative.csv
    """
    # Diccionario oficial
    pos = _load_loughran_column("Positive")
    neg = _load_loughran_column("Negative")

    # Diccionarios custom CSVs (para poder ampliar):
    pos |= _load_custom_csv("positive.csv")
    neg |= _load_custom_csv("negative.csv")

    # Eliminar duplicados: si una palabra está en ambas listas, la sacamos de ambas
    overlap = pos & neg
    if overlap:
        # logger.warning("Términos en ambas listas (se eliminan): %s", overlap)
        pos -= overlap
        neg -= overlap

    logger.info("Términos finales: %d positivos, %d negativos", len(pos), len(neg))
    return pos, neg


# Import inmediato al cargar el módulo
POS_TERMS, NEG_TERMS = load_lexicons()


def lexicon_score(text: str) -> float:
    """
    Scoring muy básico:
    (count_pos - count_neg) / (count_pos + count_neg)
    devuelve un valor en [-1,1].
    """
    words = re.findall(r"\b\w[\w']*\b", text.lower())
    pos_count = sum(1 for w in words if w in POS_TERMS)
    neg_count = sum(1 for w in words if w in NEG_TERMS)
    total = pos_count + neg_count
    if total == 0:
        return 0.0
    return (pos_count - neg_count) / total
