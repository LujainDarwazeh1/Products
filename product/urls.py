from django.urls import path
from . import views

urlpatterns = [
   path('',views.ProductView.as_view(),name='product-list'),
   path('productlist/', views.product_management, name='product-management'),
   path('<int:id>/', views.ProductDetailView.as_view()),



    ]