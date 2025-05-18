import re, logging
from celery import shared_task
from .models import Article, ArticleAnalysis
from news.models import New, NewsAnalysis
from .utils import lexicon_score, model_score

logger = logging.getLogger(__name__)

@shared_task(bind=True)
def analyze_news_title(self, news_uuid):
    logger.info("⏳ Tarea analyze_news_title arrancada para %s", news_uuid)
    try:
        news = New.objects.get(uuid=news_uuid)
        logger.info("📰 Encontrada noticia: %s", news.title)
    except New.DoesNotExist:
        logger.error("❌ No existe noticia %s", news_uuid)
        return

    title = news.title
    # Básico lexicon
    lex_score = lexicon_score(title)
    # VADER
    mdl_score = model_score(title)
    # Combined (por ejemplo promedio)
    combined = (lex_score + mdl_score) / 2
    # Conteos sencillos
    ticker_count = len(news.related_tickers or [])
    figures_count = len(re.findall(r"\d+(\.\d+)?%?", title))
    
    logger.info("💡 lex_score=%s, mdl_score=%s", lex_score, mdl_score)

    # Clasificación simple
    label = "neutral"
    if combined > 0.2:
        label = "positive"
    if combined < -0.2:
        label = "negative"
    # Relevancia
    relevance = "low"
    if ticker_count > 0 and figures_count > 0:
        relevance = "high"
    elif ticker_count > 0 or figures_count > 0:
        relevance = "medium"

    # Guardar o actualizar
    analysis, created = NewsAnalysis.objects.update_or_create(
        news=news,
        defaults={
            "sentiment_score": lex_score,
            "sentiment_label": label,
            "combined_score": combined,
            "relevance": relevance,
            "keyword_score": lex_score,
            "ticker_count": ticker_count,
            "figures_count": figures_count,
        },
    )
    logger.info("✅ Análisis guardado (created=%s) id=%s", created, analysis.pk)
    return analysis.pk


@shared_task
def analyze_article(article_id):
    logger.info("✅ Pero que cojones")
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
