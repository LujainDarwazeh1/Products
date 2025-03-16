from rest_framework import serializers

from product.models import Product


class ProductSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length = 255)
    price = serializers.FloatField()
    stock = serializers.IntegerField()
    image_url = serializers.CharField(max_length = 2083)

    class Meta:
        model = Product
        fields = '__all__'
