# from transformers import pipeline

# # pipeline multicapa para inglés+español
# _sentiment_pipe = pipeline(
#     "sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment"
# )


# def model_score(text: str) -> float:
#     # devuelve entre -1 y +1
#     out = _sentiment_pipe(text[:512])[0]
#     stars = int(out["label"][0])  # 1–5
#     return (stars - 3) / 2


from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

_vader = SentimentIntensityAnalyzer()

def model_score(text: str) -> float:
    """
    Devuelve un score entre -1 (muy negativo) y +1 (muy positivo).
    """
    vs = _vader.polarity_scores(text)
    return vs["compound"]