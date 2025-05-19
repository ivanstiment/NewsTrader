from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

_vader = SentimentIntensityAnalyzer()


def model_score(text: str) -> float:
    """
    Devuelve un score entre -1 (muy negativo) y +1 (muy positivo).
    """
    vs = _vader.polarity_scores(text)
    return vs["compound"]
