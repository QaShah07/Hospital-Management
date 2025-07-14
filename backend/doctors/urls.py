from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_doctors, name='get_doctors'),
    path('<int:doctor_id>/', views.get_doctor_detail, name='doctor_detail'),
    path('<int:doctor_id>/patients/', views.get_doctor_patients, name='doctor_patients'),
]