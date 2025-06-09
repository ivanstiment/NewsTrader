from django.db import models


class ArticleAnalysis(models.Model):
    article = models.OneToOneField(
        "sentiment_analysis.Article", on_delete=models.CASCADE, related_name="analysis"
    )
    sentiment_score = models.FloatField()
    sentiment_label = models.CharField(max_length=10)  # positive/neutral/negative
    combined_score = models.FloatField()
    relevance = models.CharField(max_length=6)  # high/medium/low
    keyword_score = models.FloatField()
    ticker_count = models.IntegerField()
    figures_count = models.IntegerField()

    def __str__(self):
        return str(self.article)
