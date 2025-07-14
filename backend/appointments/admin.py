from django.contrib import admin
from .models import Appointment, Medication, Advice, HealthMetric, PatientReport

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'date_time', 'status')
    list_filter = ('status', 'date_time')
    search_fields = ('patient__user__first_name', 'doctor__user__first_name')

@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'appointment', 'start_date', 'end_date', 'completed')
    list_filter = ('completed', 'start_date')

@admin.register(Advice)
class AdviceAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'advice_date')
    list_filter = ('advice_date',)

@admin.register(HealthMetric)
class HealthMetricAdmin(admin.ModelAdmin):
    list_display = ('patient', 'measurement_date', 'systolic', 'diastolic')
    list_filter = ('measurement_date',)

@admin.register(PatientReport)
class PatientReportAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'upload_date', 'file_type')
    list_filter = ('file_type', 'upload_date')