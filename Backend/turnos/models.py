from django.db import models

class Turno(models.Model):
    numero = models.AutoField(primary_key=True)
    paciente = models.CharField(max_length=100)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(
        max_length=20,
        choices=[("pendiente", "Pendiente"), ("atendido", "Atendido")],
        default="pendiente"
    )

    def __str__(self):
        return f"Turno {self.numero} - {self.paciente}"
