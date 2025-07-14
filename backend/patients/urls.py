from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_patients, name='get_patients'),
    path('<int:patient_id>/', views.get_patient_detail, name='patient_detail'),
]