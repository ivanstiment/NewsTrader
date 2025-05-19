import re
from celery import shared_task
from .models import Article, ArticleAnalysis
from .utils import lexicon_score, model_score


@shared_task
def analyze_article(article_id):
    """
    Análisis asíncrono de un artículo:
    - lexicon_score: diccionario finans.
    - model_score: modelo NLP.
    - ticker & figuras count.
    - puntuación combinada y nivel de relevancia.
    - guarda o actualiza ArticleAnalysis.
    """
    art = Article.objects.get(pk=article_id)
    txt = f"{art.title} {art.content}"

    # Lexicon financiero
    kw_score = lexicon_score(txt)

    # Modelo NLP
    mdl_score = model_score(txt)

    # Conteos
    tic_cnt = txt.upper().count(art.ticker.upper())
    fig_cnt = len(re.findall(r"\d+[\d,.]*[%]?", txt))

    # Puntuación combinada
    combined = 0.4 * kw_score + 0.2 * mdl_score + 0.1 * tic_cnt + 0.3 * fig_cnt

    # Etiqueta de sentimiento
    if mdl_score > 0.1:
        label = "positive"
    elif mdl_score < -0.1:
        label = "negative"
    else:
        label = "neutral"

    # 6) Nivel de relevancia
    if tic_cnt > 0 and fig_cnt > 0:
        rel = "high"
    elif tic_cnt > 0:
        rel = "medium"
    else:
        rel = "low"

    # Guardar o actualizar
    ArticleAnalysis.objects.update_or_create(
        article=art,
        defaults={
            "sentiment_score": mdl_score,
            "sentiment_label": label,
            "combined_score": combined,
            "relevance": rel,
            "keyword_score": kw_score,
            "ticker_count": tic_cnt,
            "figures_count": fig_cnt,
        },
    )
