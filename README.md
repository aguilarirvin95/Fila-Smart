# Fila-Smart
Proyecto de tracking de citas medicas y notificaciones por navegador
[README.md](https://github.com/user-attachments/files/26808359/README.md)
# 📅 Sistema de Agendamiento de Citas con Notificaciones

> Plataforma web para la generación y gestión de citas con notificaciones push en tiempo real vía navegador.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Configuración del Entorno](#configuración-del-entorno)
- [Variables de Entorno](#variables-de-entorno)
- [Instalación y Despliegue](#instalación-y-despliegue)
- [Pipeline CI/CD](#pipeline-cicd)
- [Base de Datos](#base-de-datos)
- [Notificaciones (Azure Notification Hub)](#notificaciones-azure-notification-hub)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Guía de Contribución](#guía-de-contribución)
- [Contacto del Equipo](#contacto-del-equipo)

---

## Descripción General

Este sistema permite a los usuarios registrar citas a través de un formulario web. Cada cita genera un **número único de cita** y queda asociada a una fecha y hora específica. El sistema notifica al cliente mediante **notificaciones push en el navegador** en el momento del agendamiento y envía **recordatorios automáticos** previos a la cita.

### Funcionalidades principales

- Registro de citas con generación automática de número de cita único
- Control de disponibilidad horaria y conteo de citas agendadas
- Notificaciones push al navegador en tiempo real (confirmación y recordatorios)
- Historial y gestión de citas

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                          Cliente (Navegador)                     │
│          HTML/CSS/JS  ←→  Service Worker (Push Notifications)   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
┌───────────────────────────────▼─────────────────────────────────┐
│                        Django (Backend)                          │
│      Views / REST API  ←→  Celery (tareas asíncronas)           │
└────────────┬──────────────────────────────────────┬─────────────┘
             │                                      │
┌────────────▼──────────────┐        ┌──────────────▼─────────────┐
│     PostgreSQL (DB)        │        │  Azure Notification Hub    │
│  Citas, usuarios, tokens  │        │  (Push Notifications)      │
└───────────────────────────┘        └────────────────────────────┘
```

---

## Stack Tecnológico

| Componente         | Tecnología                        |
|--------------------|-----------------------------------|
| Backend            | Python 3.11+ / Django 4.x         |
| Base de datos      | PostgreSQL 15+                    |
| Notificaciones     | Microsoft Azure Notification Hub  |
| Broker de tareas   | Celery + Redis (recordatorios)    |
| Contenedores       | Docker / Docker Compose           |
| CI/CD              | GitHub Actions / Azure Pipelines  |
| Servidor web       | Gunicorn + Nginx                  |

---

## Requisitos Previos

Asegúrate de tener instalado lo siguiente antes de comenzar:

- [Python 3.11+](https://www.python.org/downloads/)
- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/)
- [PostgreSQL 15+](https://www.postgresql.org/download/) (si se ejecuta localmente sin Docker)
- [Redis](https://redis.io/docs/getting-started/) (para Celery)
- Cuenta activa en [Microsoft Azure](https://portal.azure.com) con un Notification Hub configurado
- Git

---

## Configuración del Entorno

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-org/nombre-del-repo.git
cd nombre-del-repo
```

### 2. Crear el entorno virtual

```bash
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

---

## Variables de Entorno

El archivo `.env` debe contener las siguientes variables. **Nunca subas este archivo al repositorio.**

```env
# Django
DJANGO_SECRET_KEY=tu_clave_secreta_aqui
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos PostgreSQL
DB_NAME=citas_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432

# Azure Notification Hub
AZURE_NOTIFICATION_HUB_NAME=nombre-de-tu-hub
AZURE_NOTIFICATION_HUB_CONNECTION_STRING=Endpoint=sb://...

# Celery / Redis
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Recordatorios (minutos antes de la cita)
REMINDER_MINUTES_BEFORE=30
```

> ⚠️ **Nota de seguridad:** Agrega `.env` a tu `.gitignore`. Usa Azure Key Vault o GitHub Secrets para entornos de producción y CI/CD.

---

## Instalación y Despliegue

### Desarrollo local con Docker Compose

```bash
# Construir e iniciar todos los servicios
docker-compose up --build

# Aplicar migraciones
docker-compose exec web python manage.py migrate

# Crear superusuario (opcional)
docker-compose exec web python manage.py createsuperuser

# La aplicación estará disponible en:
# http://localhost:8000
```

### Despliegue manual (sin Docker)

```bash
# Aplicar migraciones
python manage.py migrate

# Recolectar archivos estáticos
python manage.py collectstatic --no-input

# Iniciar el servidor de desarrollo
python manage.py runserver

# Iniciar Celery (en una terminal separada)
celery -A config worker --loglevel=info
celery -A config beat --loglevel=info
```

### Despliegue en producción

Se recomienda usar Gunicorn como servidor WSGI detrás de Nginx:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

---

## Pipeline CI/CD

El proyecto usa **GitHub Actions** / **Azure Pipelines** para automatizar el flujo de integración y despliegue continuo.

### Flujo general

```
Push / PR a main o develop
        │
        ▼
  Lint (flake8/black)
        │
        ▼
  Tests unitarios (pytest)
        │
        ▼
  Build imagen Docker
        │
        ▼
  Push a Container Registry
        │
        ▼
  Deploy a Azure App Service / VM
```

### Secrets requeridos en el repositorio CI/CD

Configura los siguientes secrets en GitHub Actions o Azure Pipelines:

| Secret                              | Descripción                              |
|-------------------------------------|------------------------------------------|
| `DJANGO_SECRET_KEY`                 | Clave secreta de Django                  |
| `DB_PASSWORD`                       | Contraseña de PostgreSQL                 |
| `AZURE_NOTIFICATION_HUB_CONNECTION_STRING` | Cadena de conexión del Notification Hub |
| `DOCKER_REGISTRY_URL`              | URL del registro de contenedores         |
| `AZURE_CREDENTIALS`                 | Credenciales de Azure para deploy        |

---

## Base de Datos

El proyecto usa **PostgreSQL 15+**. Las migraciones se gestionan con Django ORM.

### Comandos útiles

```bash
# Crear nuevas migraciones tras cambios en modelos
python manage.py makemigrations

# Aplicar migraciones pendientes
python manage.py migrate

# Ver estado de las migraciones
python manage.py showmigrations

# Acceder a la shell de la base de datos (vía Docker)
docker-compose exec db psql -U postgres -d citas_db
```

### Backup y restauración

```bash
# Backup
pg_dump -U postgres citas_db > backup_$(date +%Y%m%d).sql

# Restaurar
psql -U postgres citas_db < backup_YYYYMMDD.sql
```

---

## Notificaciones (Azure Notification Hub)

El sistema utiliza **Azure Notification Hub** junto con la **Web Push API** del navegador para enviar:

1. **Confirmación de cita** — al momento de agendar.
2. **Recordatorio** — X minutos antes de la cita (configurable en `REMINDER_MINUTES_BEFORE`).

### Flujo de notificaciones

```
1. El usuario acepta notificaciones en el navegador
2. El navegador genera un token de suscripción (PushSubscription)
3. El token se guarda en PostgreSQL asociado al usuario
4. Celery Beat dispara tareas programadas para los recordatorios
5. Django envía la notificación a través de Azure Notification Hub
6. El Service Worker en el navegador recibe y muestra la notificación
```

### Configuración del Service Worker

El archivo `static/js/sw.js` contiene el Service Worker encargado de interceptar y mostrar las notificaciones push. Debe estar registrado en el cliente al cargar la página.

---

## Monitoreo y Logs

- Los logs de la aplicación se escriben en `logs/app.log` (configurable en `settings.py`).
- Se recomienda integrar **Azure Monitor** o **Sentry** para seguimiento de errores en producción.
- Las tareas de Celery pueden monitorearse con [Flower](https://flower.readthedocs.io/):

```bash
celery -A config flower --port=5555
# Disponible en: http://localhost:5555
```

---

## Guía de Contribución

1. Crea un branch desde `develop`:
   ```bash
   git checkout -b feature/nombre-de-la-funcionalidad
   ```
2. Realiza tus cambios y asegúrate de que los tests pasen:
   ```bash
   pytest
   ```
3. Abre un **Pull Request** hacia `develop` con una descripción clara de los cambios.
4. El PR debe ser aprobado por al menos un miembro del equipo antes de hacer merge.

### Estilo de código

- Se sigue **PEP 8**. Usa `black` para formateo automático:
  ```bash
  black .
  ```
- Usa `flake8` para linting:
  ```bash
  flake8 .
  ```

---

## Contacto del Equipo

| Rol         | Responsable       | Contacto                   |
|-------------|-------------------|----------------------------|
| DevOps      | [Tu nombre]       | tu.email@empresa.com       |
| Backend     | [Nombre]          | backend@empresa.com        |
| Frontend    | [Nombre]          | frontend@empresa.com       |
| QA          | [Nombre]          | qa@empresa.com             |

---

*Última actualización: Abril 2026*
