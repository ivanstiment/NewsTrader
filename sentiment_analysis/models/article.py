from django.db import models


class Article(models.Model):
    ticker = models.CharField(max_length=10)
    title = models.CharField(max_length=300)
    content = models.TextField()
    pub_date = models.DateTimeField()

    class Meta:
        db_table = "sa_article"
        ordering = ["-pub_date"]

    def __str__(self):
        return f"{self.ticker}: {self.title[:50]}"
