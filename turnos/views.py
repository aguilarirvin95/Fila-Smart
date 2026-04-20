from django.shortcuts import render
from rest_framework import viewsets
from .models import Turno
from .serializers import TurnoSerializer

class TurnoViewSet(viewsets.ModelViewSet):
    queryset = Turno.objects.all().order_by("fecha_creacion")
    serializer_class = TurnoSerializer