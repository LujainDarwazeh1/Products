from django.db import models

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length = 255)
    price = models.FloatField()
    stock = models.IntegerField()
    image_url = models.CharField(max_length = 2083)
    class Meta:
        verbose_name = "Product Item"
        verbose_name_plural = "Product Items"