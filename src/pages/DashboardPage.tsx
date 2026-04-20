import { useState } from 'react';
import {
  Users,
  ChevronRight,
  CheckCircle2,
  Link2,
  ClipboardList,
  Menu,
  Clock,
  UserCheck,
  AlertCircle,
  Check,
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import QueueCard from '../components/dashboard/QueueCard';
import HistoryCard from '../components/dashboard/HistoryCard';
import { useQueueStore } from '../store/useQueueStore';

// ── Queue section ────────────────────────────────────────────────────────────
function QueueSection() {
  const {
    queue,
    currentPatient,
    history,
    activeClinic,
    callNext,
    finishConsultation,
  } = useQueueStore();

  const [copied, setCopied] = useState(false);

  const waitingPatients = queue.filter((p) => p.status === 'waiting');
  const publicUrl = `${window.location.origin}/c/${activeClinic.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-dark">Cola de Pacientes</h1>
          <p className="text-dark/45 text-sm mt-0.5 font-semibold">
            {activeClinic.name} &mdash; {activeClinic.specialty}
          </p>
        </div>

        <button
          id="copy-public-link-btn"
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-bold text-sm transition-all whitespace-nowrap ${
            copied
              ? 'border-emerald-300 text-emerald-600 bg-emerald-50'
              : 'border-primary/20 text-primary hover:border-primary hover:bg-primary/5'
          }`}
        >
          {copied ? <Check size={15} /> : <Link2 size={15} />}
          {copied ? 'Link copiado!' : 'Copiar link público'}
        </button>
      </div>

      {/* ── Current patient in consultation ── */}
      {currentPatient && (
        <div className="bg-gradient-to-r from-secondary/15 to-secondary/5 border border-secondary/30 rounded-2xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                {currentPatient.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-black text-white bg-secondary px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    En consulta
                  </span>
                  <span className="text-xs text-dark/40 font-semibold">
                    {currentPatient.ticketCode}
                  </span>
                </div>
                <p className="font-bold text-dark">{currentPatient.name}</p>
                <p className="text-sm text-dark/45">{currentPatient.phone}</p>
              </div>
            </div>
            <button
              id="finish-consultation-btn"
              onClick={finishConsultation}
              className="btn-accent flex items-center gap-2 py-2.5 whitespace-nowrap"
            >
              <CheckCircle2 size={17} />
              Finalizar consulta
            </button>
          </div>
        </div>
      )}

      {/* ── Call next + count ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Users size={17} className="text-dark/35" />
          <span className="text-dark/55 font-semibold text-sm">
            {waitingPatients.length}{' '}
            {waitingPatients.length === 1 ? 'paciente esperando' : 'pacientes esperando'}
          </span>
        </div>
        <button
          id="call-next-btn"
          onClick={callNext}
          disabled={!!currentPatient || waitingPatients.length === 0}
          className="btn-primary flex items-center gap-2 py-2.5
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
            disabled:hover:bg-primary"
        >
          Llamar siguiente
          <ChevronRight size={17} />
        </button>
      </div>

      {/* ── Waiting list ── */}
      {waitingPatients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={26} className="text-gray-300" />
          </div>
          <p className="font-bold text-dark/35 mb-1">La cola está vacía</p>
          <p className="text-sm text-dark/25">
            Cuando un paciente se registre, aparecerá aquí
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-10">
          {waitingPatients.map((patient, idx) => (
            <QueueCard key={patient.id} patient={patient} position={idx + 1} />
          ))}
        </div>
      )}

      {/* ── Attended history ── */}
      {history.length > 0 && (
        <>
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-2 text-xs font-bold text-dark/35 uppercase tracking-wider px-1">
              <ClipboardList size={13} />
              Atendidos hoy ({history.length})
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="space-y-3">
            {history.map((patient) => (
              <HistoryCard key={patient.id} patient={patient} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Inicio / summary section ─────────────────────────────────────────────────
function InicioSection() {
  const { queue, history, currentPatient, activeClinic } = useQueueStore();
  const waitingCount = queue.filter((p) => p.status === 'waiting').length;

  const stats = [
    {
      label: 'En espera',
      value: waitingCount,
      icon: Users,
      colorText: 'text-primary',
      colorBg: 'bg-primary/10',
    },
    {
      label: 'En consulta',
      value: currentPatient ? 1 : 0,
      icon: UserCheck,
      colorText: 'text-secondary',
      colorBg: 'bg-secondary/10',
    },
    {
      label: 'Atendidos hoy',
      value: history.length,
      icon: CheckCircle2,
      colorText: 'text-emerald-600',
      colorBg: 'bg-emerald-50',
    },
    {
      label: 'Tiempo prom.',
      value: '—',
      suffix: 'min',
      icon: Clock,
      colorText: 'text-accent',
      colorBg: 'bg-accent/10',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-dark">Inicio</h1>
        <p className="text-dark/45 text-sm mt-0.5 font-semibold">
          Resumen del día — {activeClinic.name}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, suffix, icon: Icon, colorText, colorBg }) => (
          <div key={label} className="card">
            <div
              className={`w-11 h-11 ${colorBg} rounded-xl flex items-center justify-center mb-4`}
            >
              <Icon size={20} className={colorText} />
            </div>
            <p className="text-2xl font-black text-dark">
              {value}
              {suffix && (
                <span className="text-sm font-semibold text-dark/35 ml-1">{suffix}</span>
              )}
            </p>
            <p className="text-xs text-dark/45 font-semibold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {currentPatient && (
        <div className="card border-l-4 border-l-secondary">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse inline-block" />
            <span className="text-xs font-bold text-secondary uppercase tracking-wide">
              Paciente en consulta ahora
            </span>
          </div>
          <p className="font-bold text-dark">{currentPatient.name}</p>
          <p className="text-sm text-dark/45 mt-0.5">
            {currentPatient.ticketCode} · {currentPatient.phone}
          </p>
        </div>
      )}

      {!currentPatient && waitingCount === 0 && history.length === 0 && (
        <div className="card text-center py-10 text-dark/30">
          <Users size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-bold">Sin actividad por el momento</p>
          <p className="text-sm mt-1">
            Compartí el link público para que los pacientes empiecen a registrarse
          </p>
        </div>
      )}
    </div>
  );
}

// ── Placeholder for unbuilt sections ────────────────────────────────────────
function PlaceholderSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-dark">{title}</h1>
      </div>
      <div className="card text-center py-16">
        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={26} className="text-gray-300" />
        </div>
        <p className="font-bold text-dark/35 mb-1.5">{title}</p>
        <p className="text-sm text-dark/25 max-w-xs mx-auto">{description}</p>
      </div>
    </div>
  );
}

// ── Mobile overlay ───────────────────────────────────────────────────────────
function MobileOverlay() {
  const { sidebarOpen, setSidebarOpen } = useQueueStore();
  if (!sidebarOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm"
      onClick={() => setSidebarOpen(false)}
    />
  );
}

// ── Main DashboardPage ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const { activeSection, setSidebarOpen } = useQueueStore();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <MobileOverlay />
      <Sidebar />

      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            id="mobile-sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-dark/55 hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <img src="/logo.png" alt="Fila Smart" className="h-7 w-auto" />
          <div className="w-10" aria-hidden="true" />
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
          {activeSection === 'cola' && <QueueSection />}
          {activeSection === 'inicio' && <InicioSection />}
          {activeSection === 'perfil' && (
            <PlaceholderSection
              title="Mi Perfil"
              description="Administrá tu información personal y los datos de tu clínica desde aquí."
            />
          )}
          {activeSection === 'configuracion' && (
            <PlaceholderSection
              title="Configuración"
              description="Ajustá el comportamiento de Fila Smart para tu clínica: notificaciones, tiempos y más."
            />
          )}
        </div>
      </main>
    </div>
  );
}
