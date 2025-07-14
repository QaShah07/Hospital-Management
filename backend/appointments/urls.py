from django.urls import path
from . import views

urlpatterns = [
    path('patient/<int:patient_id>/', views.get_patient_appointments, name='patient_appointments'),
    path('medications/patient/<int:patient_id>/', views.get_patient_medications, name='patient_medications'),
    path('medications/<int:medication_id>/status/', views.update_medication_status, name='update_medication_status'),
    path('advice/patient/<int:patient_id>/', views.get_patient_advice, name='patient_advice'),
    path('health-metrics/patient/<int:patient_id>/', views.get_patient_health_metrics, name='patient_health_metrics'),
    path('reports/patient/<int:patient_id>/', views.get_patient_reports, name='patient_reports'),
    path('reports/create/', views.create_patient_report, name='create_patient_report'),
    path('create/', views.create_appointment, name='create_appointment'),
    path('advice/create/', views.create_advice, name='create_advice'),
]