from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Product
from .serializers import ProductSerializer

class ProductView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            products = Product.objects.all()
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)})

    def post(self, request):
        try:
            product_name = request.data.get("name")
            exist_product = Product.objects.get(name=product_name)

            exist_product.stock += 1
            exist_product.save()
            return Response({"message": "Product already exists, stock updated successfully",
                             "product": ProductSerializer(exist_product).data})

        except Product.DoesNotExist:
            # If product does not exist, create a new one
            serializer = ProductSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors)


def product_management(request):
    return render(request, 'ProductList.html')

class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):

        try:
            product = Product.objects.get(id=id)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
           return Response({"error": "Product not found"})

    def put(self, request, id):

        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"})

        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    def delete(self, request, id):

        try:
            product = Product.objects.get(id=id)
            product.delete()
            return Response({"message": "Product deleted successfully"})
        except Product.DoesNotExist:
            return Response({"error": "Product not found"})


