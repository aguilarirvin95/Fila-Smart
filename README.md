# 📅 Fila Smart — Sistema de Agendamiento de Citas con Notificaciones

> Plataforma web para la generación y gestión de citas con notificaciones push en tiempo real vía navegador.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Estructura del Proyecto](#estructura-del-proyecto)
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
- Vista pública de la cola de turnos en tiempo real
- Dashboard administrativo

---

## Estructura del Proyecto

```
Fila-Smart/
├── Backend/
│   ├── fila_smart/             # Módulo principal Django
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── __init__.py
│   ├── turnos/                 # App principal de gestión de turnos
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tasks.py            # Tareas asíncronas (Celery)
│   │   ├── tests.py
│   │   ├── views.py
│   │   └── __init__.py
│   └── manage.py
│
└── Frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   ├── HistoryCard.tsx
    │   │   │   ├── QueueCard.tsx
    │   │   │   └── Sidebar.tsx
    │   │   ├── layout/
    │   │   │   ├── Footer.tsx
    │   │   │   └── Navbar.tsx
    │   │   └── public/
    │   │       ├── RegistrationForm.tsx
    │   │       └── VirtualTicket.tsx
    │   ├── data/
    │   │   └── mockData.ts
    │   ├── pages/
    │   │   ├── DashboardPage.tsx
    │   │   ├── LandingPage.tsx
    │   │   └── PublicQueuePage.tsx
    │   ├── store/
    │   │   └── useQueueStore.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── index.html
    ├── package.json
    ├── schema.sql
    ├── tailwind.config.js
    ├── tsconfig.json
    └── postcss.config.js
```

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                     Cliente (Navegador)                          │
│         React + TypeScript + Vite + Tailwind CSS                │
│         Service Worker (Push Notifications)                      │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS / REST API
┌───────────────────────────────▼─────────────────────────────────┐
│                     Django (Backend)                             │
│         fila_smart (config) ←→ turnos (app)                     │
│         Views / REST API   ←→  Celery (tareas asíncronas)       │
└────────────┬──────────────────────────────────────┬─────────────┘
             │                                      │
┌────────────▼──────────────┐        ┌──────────────▼─────────────┐
│     PostgreSQL (DB)        │        │  Azure Notification Hub    │
│  Turnos, usuarios, tokens  │        │  (Push Notifications)      │
└───────────────────────────┘        └────────────────────────────┘
```

---

## Stack Tecnológico

| Componente         | Tecnología                        |
|--------------------|-----------------------------------|
| Backend            | Python 3.11+ / Django 4.x         |
| Frontend           | React + TypeScript + Vite         |
| Estilos            | Tailwind CSS                      |
| Estado global      | Zustand (`useQueueStore`)         |
| Base de datos      | PostgreSQL 15+                    |
| Notificaciones     | Microsoft Azure Notification Hub  |
| Broker de tareas   | Celery + Redis (recordatorios)    |
| Contenedores       | Docker / Docker Compose           |
| CI/CD              | GitHub Actions / Azure Pipelines  |
| Servidor web       | Gunicorn + Nginx                  |

---

## Requisitos Previos

**Backend**
- [Python 3.11+](https://www.python.org/downloads/)
- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/)
- [PostgreSQL 15+](https://www.postgresql.org/download/) (si se ejecuta localmente sin Docker)
- [Redis](https://redis.io/docs/getting-started/) (para Celery)
- Cuenta activa en [Microsoft Azure](https://portal.azure.com) con un Notification Hub configurado

**Frontend**
- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

**General**
- Git

---

## Configuración del Entorno

### 1. Clonar el repositorio

```bash
git clone https://github.com/aguilarirvin95/Fila-Smart.git
cd Fila-Smart
```

### 2. Configurar el Backend

```bash
cd Backend

# Crear el entorno virtual
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
```

### 3. Configurar el Frontend

```bash
cd Frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

---

## Variables de Entorno

### Backend — `Backend/.env`

```env
# Django
DJANGO_SECRET_KEY=tu_clave_secreta_aqui
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos PostgreSQL
DB_NAME=filasmart_db
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

### Frontend — `Frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

> ⚠️ **Nota de seguridad:** Agrega `.env` a tu `.gitignore`. Usa Azure Key Vault o GitHub Secrets para entornos de producción y CI/CD.

---

## Instalación y Despliegue

### Desarrollo local con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up --build

# Aplicar migraciones (en otra terminal)
docker-compose exec web python manage.py migrate

# Crear superusuario (opcional)
docker-compose exec web python manage.py createsuperuser

# Backend disponible en:  http://localhost:8000
# Frontend disponible en: http://localhost:5173
```

### Desarrollo local sin Docker

**Backend:**
```bash
cd Backend
python manage.py migrate
python manage.py runserver

# Iniciar Celery (terminales separadas)
celery -A fila_smart worker --loglevel=info
celery -A fila_smart beat --loglevel=info
```

**Frontend:**
```bash
cd Frontend
npm run dev
# Disponible en: http://localhost:5173
```

### Build de producción (Frontend)

```bash
cd Frontend
npm run build
# Los archivos compilados se generan en Frontend/dist/
```

### Despliegue en producción (Backend)

```bash
cd Backend
python manage.py collectstatic --no-input
gunicorn fila_smart.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

---

## Pipeline CI/CD

El proyecto usa **GitHub Actions** / **Azure Pipelines** para automatizar el flujo de integración y despliegue continuo.

### Flujo general

```
Push / PR a main o develop
        │
        ▼
  Lint Backend (flake8/black) + TypeScript check (Frontend)
        │
        ▼
  Tests unitarios (pytest)
        │
        ▼
  Build Frontend (npm run build)
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

| Secret                                      | Descripción                              |
|---------------------------------------------|------------------------------------------|
| `DJANGO_SECRET_KEY`                         | Clave secreta de Django                  |
| `DB_PASSWORD`                               | Contraseña de PostgreSQL                 |
| `AZURE_NOTIFICATION_HUB_CONNECTION_STRING`  | Cadena de conexión del Notification Hub  |
| `DOCKER_REGISTRY_URL`                       | URL del registro de contenedores         |
| `AZURE_CREDENTIALS`                         | Credenciales de Azure para deploy        |
| `VITE_API_BASE_URL`                         | URL del API para el build del frontend   |

---

## Base de Datos

El proyecto usa **PostgreSQL 15+**. Las migraciones se gestionan con Django ORM. El esquema de referencia se encuentra en `Frontend/schema.sql`.

### Comandos útiles

```bash
cd Backend

# Crear nuevas migraciones tras cambios en modelos
python manage.py makemigrations turnos

# Aplicar migraciones pendientes
python manage.py migrate

# Ver estado de las migraciones
python manage.py showmigrations

# Acceder a la shell de la base de datos (vía Docker)
docker-compose exec db psql -U postgres -d filasmart_db
```

### Backup y restauración

```bash
# Backup
pg_dump -U postgres filasmart_db > backup_$(date +%Y%m%d).sql

# Restaurar
psql -U postgres filasmart_db < backup_YYYYMMDD.sql
```

---

## Notificaciones (Azure Notification Hub)

El sistema utiliza **Azure Notification Hub** junto con la **Web Push API** del navegador para enviar:

1. **Confirmación de turno** — al momento de registrarse en la cola.
2. **Recordatorio** — X minutos antes del turno (configurable en `REMINDER_MINUTES_BEFORE`).

### Flujo de notificaciones

```
1. El usuario acepta notificaciones en el navegador
2. El navegador genera un token de suscripción (PushSubscription)
3. El token se guarda en PostgreSQL asociado al usuario
4. Celery Beat dispara tareas programadas (turnos/tasks.py)
5. Django envía la notificación a través de Azure Notification Hub
6. El Service Worker en el navegador recibe y muestra la notificación
```

---

## Monitoreo y Logs

- Los logs de la aplicación se escriben en `logs/app.log` (configurable en `fila_smart/settings.py`).
- Se recomienda integrar **Azure Monitor** o **Sentry** para seguimiento de errores en producción.
- Las tareas de Celery pueden monitorearse con [Flower](https://flower.readthedocs.io/):

```bash
celery -A fila_smart flower --port=5555
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
   # Backend
   cd Backend && pytest

   # Frontend
   cd Frontend && npm run build
   ```
3. Abre un **Pull Request** hacia `develop` con una descripción clara de los cambios.
4. El PR debe ser aprobado por al menos un miembro del equipo antes de hacer merge.

### Estilo de código

**Backend:**
```bash
black .       # Formateo automático
flake8 .      # Linting
```

**Frontend:**
```bash
npm run lint  # ESLint
```

---

## Contacto del Equipo

| Rol         | Responsable       | Contacto                   |
|-------------|-------------------|----------------------------|
| DevOps      | Irvin Aguilar     | aguilar.irvin95@gmail.com  |
| Backend     | Julissa Lopez     | julissalopez2040@gmail.com |
| Backend     | Samuel Donado     | samuel.donado.84@gmail.com |
| Frontend    | Kevin Perdomo     | kevin030pgj@gmail.com      |
| Frontend    | Kevin Mejia       | Kevmejia6.99@gmail.com     |
| QA          | Irvin Aguilar     | aguilar.irvin95@gmail.com  |
| QA          | Kevin Perdomo     | kevin030pgj@gmail.com      |
| QA          | Kevin Mejia       | Kevmejia6.99@gmail.com     |


---

*Última actualización: Abril 2026*
