from django.db import models
from authentication.models import Patient, Doctor

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    instructions = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Appointment: {self.patient.user.get_full_name()} with {self.doctor.user.get_full_name()}"

class Medication(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    frequency = models.CharField(max_length=100)
    instructions = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    completed = models.BooleanField(default=False)
    timings = models.JSONField(default=list)  # Store as JSON array
    
    def __str__(self):
        return f"{self.name} - {self.appointment.patient.user.get_full_name()}"

class Advice(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    advice_text = models.TextField()
    advice_date = models.DateField(auto_now_add=True)
    next_appointment_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"Advice for {self.patient.user.get_full_name()}"

class HealthMetric(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    measurement_date = models.DateField()
    systolic = models.IntegerField()
    diastolic = models.IntegerField()
    
    def __str__(self):
        return f"BP: {self.systolic}/{self.diastolic} - {self.patient.user.get_full_name()}"

class PatientReport(models.Model):
    FILE_TYPE_CHOICES = (
        ('pdf', 'PDF'),
        ('image', 'Image'),
        ('text', 'Text'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    upload_date = models.DateField(auto_now_add=True)
    description = models.TextField()
    file = models.FileField(upload_to='patient_reports/', null=True, blank=True)
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES)
    file_content = models.TextField(null=True, blank=True)  # For text reports
    
    def __str__(self):
        return f"Report: {self.patient.user.get_full_name()} - {self.upload_date}"