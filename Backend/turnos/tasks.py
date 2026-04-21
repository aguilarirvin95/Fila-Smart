from celery import shared_task
from .models import Turno

@shared_task
def marcar_turno_atendido(turno_id):
    try:
        turno = Turno.objects.get(id=turno_id)
        turno.estado = "atendido"
        turno.save()
        return f"Turno {turno_id} marcado como atendido"
    except Turno.DoesNotExist:
        return f"Turno {turno_id} no existe"
