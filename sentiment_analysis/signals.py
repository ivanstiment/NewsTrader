from django.db.models.signals import post_save
from django.dispatch import receiver
from news.models import New
from .tasks import analyze_news_title


@receiver(post_save, sender=New)
def enqueue_news_analysis(sender, instance, created, **kwargs):
    analyze_news_title.delay(str(instance.uuid))
