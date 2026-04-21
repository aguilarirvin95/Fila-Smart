-- =====================================================================
-- Fila Smart — Schema SQL para PostgreSQL
-- Arquitectura: Multi-tenant por clinic_id
-- Versión: MVP 1.0
-- =====================================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- TABLA: clinicas
-- Entidad raíz de cada tenant.
-- El campo encargado_cola identifica al responsable de la fila
-- sin necesidad de una tabla de usuarios separada (MVP).
-- =====================================================================
CREATE TABLE clinicas (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          VARCHAR(120)  NOT NULL,
  slug            VARCHAR(60)   NOT NULL,
  direccion       TEXT,
  telefono        VARCHAR(20),
  especialidad    VARCHAR(80),
  encargado_cola  VARCHAR(120),              -- responsable de gestionar la cola
  activa          BOOLEAN       NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Slug debe ser único para garantizar links únicos por clínica
CREATE UNIQUE INDEX idx_clinicas_slug ON clinicas (slug);
CREATE INDEX idx_clinicas_activa   ON clinicas (activa);


-- =====================================================================
-- TABLA: pacientes
-- Registro básico de cada paciente por visita.
-- Multi-tenant: siempre vinculado a una clínica.
-- =====================================================================
CREATE TABLE pacientes (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id   UUID          NOT NULL REFERENCES clinicas (id) ON DELETE CASCADE,
  nombre      VARCHAR(120)  NOT NULL,
  telefono    VARCHAR(20)   NOT NULL,
  creado_en   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pacientes_clinic  ON pacientes (clinic_id);
CREATE INDEX idx_pacientes_telefono ON pacientes (clinic_id, telefono);


-- =====================================================================
-- TABLA: citas_cola
-- Representa un turno en la cola de una clínica específica.
--
-- Estados del ciclo de vida:
--   esperando  → El paciente está en la fila virtual
--   en_consulta → El doctor lo llamó
--   atendido   → La consulta finalizó
--   cancelado   → El paciente canceló su lugar
--
-- Las columnas de tiempo calculado usan GENERATED ALWAYS AS STORED
-- para que PostgreSQL las mantenga automáticamente.
-- =====================================================================
CREATE TABLE citas_cola (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id            UUID         NOT NULL REFERENCES clinicas  (id) ON DELETE CASCADE,
  paciente_id          UUID         NOT NULL REFERENCES pacientes (id) ON DELETE CASCADE,

  -- Identificador visual del turno (ej: "#A-007")
  codigo_ticket        VARCHAR(10)  NOT NULL,

  -- Posición en la cola al momento del registro (1-indexed)
  posicion             INTEGER      NOT NULL CHECK (posicion >= 1),

  -- Estado del turno
  estado               VARCHAR(20)  NOT NULL DEFAULT 'esperando'
                         CHECK (estado IN ('esperando', 'en_consulta', 'atendido', 'cancelado')),

  -- Timestamps de ciclo de vida
  registrado_en        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  llamado_en           TIMESTAMPTZ,           -- cuando el doctor presionó "Llamar siguiente"
  finalizado_en        TIMESTAMPTZ,           -- cuando el doctor presionó "Finalizar consulta"

  -- Tiempo total de espera en minutos (desde registro hasta llamada)
  -- Se calcula y almacena automáticamente
  tiempo_espera_min    NUMERIC(6,2) GENERATED ALWAYS AS (
    CASE
      WHEN llamado_en IS NOT NULL
      THEN EXTRACT(EPOCH FROM (llamado_en - registrado_en)) / 60.0
      ELSE NULL
    END
  ) STORED,

  -- Duración de la consulta en minutos (desde llamada hasta finalización)
  tiempo_consulta_min  NUMERIC(6,2) GENERATED ALWAYS AS (
    CASE
      WHEN finalizado_en IS NOT NULL AND llamado_en IS NOT NULL
      THEN EXTRACT(EPOCH FROM (finalizado_en - llamado_en)) / 60.0
      ELSE NULL
    END
  ) STORED
);

-- Índices para las consultas más frecuentes
CREATE INDEX idx_cola_clinic         ON citas_cola (clinic_id);
CREATE INDEX idx_cola_estado         ON citas_cola (clinic_id, estado);
CREATE INDEX idx_cola_fecha          ON citas_cola (clinic_id, registrado_en DESC);
CREATE INDEX idx_cola_paciente       ON citas_cola (paciente_id);


-- =====================================================================
-- TRIGGER: actualizar automáticamente `actualizado_en` en clinicas
-- =====================================================================
CREATE OR REPLACE FUNCTION fn_set_actualizado_en()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_clinicas_actualizado
  BEFORE UPDATE ON clinicas
  FOR EACH ROW
  EXECUTE FUNCTION fn_set_actualizado_en();


-- =====================================================================
-- SEED DATA — Clínicas de ejemplo (El Salvador)
-- =====================================================================
INSERT INTO clinicas (nombre, slug, direccion, telefono, especialidad, encargado_cola)
VALUES
  (
    'Clínica San Rafael',
    'san-rafael',
    '5ª Av. Norte #23, Santa Ana',
    '+503 2441-0023',
    'Medicina General',
    'Licda. Carmen Portillo'
  ),
  (
    'Centro Médico Santa Elena',
    'santa-elena',
    'Blvd. Los Próceres #45, San Salvador',
    '+503 2278-1156',
    'Medicina Familiar',
    'Lic. Roberto Menjívar'
  ),
  (
    'Clínica Familiar Los Héroes',
    'los-heroes',
    'C. Los Héroes #7, Soyapango',
    '+503 2277-3344',
    'Medicina General y Pediatría',
    'Licda. Ana Dubón'
  );
