from django.db import models

class NewsAnalysis(models.Model):
    news = models.OneToOneField(
        "news.New",
        on_delete=models.CASCADE,
        related_name="sentiment_analysis"
    )
    sentiment_score  = models.FloatField()
    sentiment_label  = models.CharField(max_length=10)
    combined_score   = models.FloatField()
    relevance        = models.CharField(max_length=6)
    keyword_score    = models.FloatField()
    ticker_count     = models.IntegerField()
    figures_count    = models.IntegerField()
        
    def __str__(self):
        return str(self.news)
