import { useState, useEffect } from 'react';
import {
  Ticket,
  Users,
  Clock,
  Bell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { Patient } from '../../types';
import { useQueueStore } from '../../store/useQueueStore';
import { MINUTES_PER_PATIENT } from '../../data/mockData';

interface VirtualTicketProps {
  patient: Patient;
  onCancel: () => void;
}

const SECS_PER_PATIENT = MINUTES_PER_PATIENT * 60;

function formatCountdown(totalSecs: number): string {
  if (totalSecs <= 0) return '00:00';
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getOrdinal(n: number): string {
  const map: Record<number, string> = { 1: '1ro', 2: '2do', 3: '3ro', 4: '4to', 5: '5to' };
  return map[n] ?? `${n}to`;
}

function calcRemaining(position: number, registeredAt: Date): number {
  const estimated = position * SECS_PER_PATIENT;
  const elapsed = Math.floor((Date.now() - registeredAt.getTime()) / 1000);
  return Math.max(0, estimated - elapsed);
}

export default function VirtualTicket({ patient, onCancel }: VirtualTicketProps) {
  const { queue, currentPatient, cancelPatient } = useQueueStore();

  const waitingQueue = queue.filter((p) => p.status === 'waiting');
  const position = waitingQueue.findIndex((p) => p.id === patient.id) + 1;
  const isInConsultation = currentPatient?.id === patient.id;
  const isCancelled = !isInConsultation && position === 0;

  const [remaining, setRemaining] = useState(() =>
    position > 0 ? calcRemaining(position, patient.registeredAt) : 0
  );

  // Recalculate when position changes (e.g., someone ahead cancels)
  useEffect(() => {
    if (position > 0) {
      setRemaining(calcRemaining(position, patient.registeredAt));
    }
  }, [position, patient.registeredAt]);

  // Live countdown tick
  useEffect(() => {
    if (position === 0 || isInConsultation) return;
    const timer = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [position, isInConsultation]);

  const totalEstimated = position > 0 ? position * SECS_PER_PATIENT : 1;
  const elapsed = totalEstimated - remaining;
  const progressPct = Math.min(100, Math.max(0, (elapsed / totalEstimated) * 100));

  const handleCancel = () => {
    cancelPatient(patient.id);
    onCancel();
  };

  // ── In consultation ──────────────────────────────────────────────────
  if (isInConsultation) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-secondary/20 p-8 text-center">
        <div className="w-20 h-20 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={40} className="text-secondary" />
        </div>
        <h2 className="text-2xl font-black text-dark mb-2">¡Es tu turno!</h2>
        <p className="text-dark/55 mb-5">Ya podés pasar a consulta. Te están esperando.</p>
        <div className="inline-block bg-secondary/10 text-secondary font-black text-lg px-5 py-2 rounded-xl">
          {patient.ticketCode}
        </div>
        <p className="text-xs text-dark/35 mt-5">{patient.name}</p>
      </div>
    );
  }

  // ── Cancelled / Not found ─────────────────────────────────────────────
  if (isCancelled) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <XCircle size={40} className="text-accent" />
        </div>
        <h2 className="text-2xl font-black text-dark mb-2">Turno cancelado</h2>
        <p className="text-dark/55 mb-5">Tu lugar fue cancelado. Podés volver a registrarte.</p>
        <button onClick={onCancel} className="btn-primary">
          Volver a registrarme
        </button>
      </div>
    );
  }

  // ── Waiting ───────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header bar */}
      <div className="bg-primary px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Ticket size={18} />
          <span className="font-bold text-sm">Ticket Virtual</span>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-white/80 bg-white/10 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
          En vivo
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Big ticket number */}
        <div className="text-center">
          <p className="text-xs font-bold text-dark/35 uppercase tracking-widest mb-2">
            Tu número de ticket
          </p>
          <div className="inline-block bg-primary/5 rounded-2xl px-8 py-4 border border-primary/10">
            <span className="text-6xl font-black text-primary tracking-tight">
              {patient.ticketCode}
            </span>
          </div>
        </div>

        {/* Position + Countdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/10 rounded-2xl p-4 text-center">
            <Users size={18} className="text-secondary mx-auto mb-1.5" />
            <p className="text-xs text-dark/45 mb-0.5">Tu posición</p>
            <p className="text-2xl font-black text-secondary">
              {position > 0 ? getOrdinal(position) : '—'}
            </p>
          </div>
          <div className="bg-accent/10 rounded-2xl p-4 text-center">
            <Clock size={18} className="text-accent mx-auto mb-1.5" />
            <p className="text-xs text-dark/45 mb-0.5">Tiempo restante</p>
            <p className="text-2xl font-black text-accent font-mono tabular-nums">
              {position > 0 ? formatCountdown(remaining) : '—'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-dark/35 mb-1.5 font-semibold">
            <span>Progreso en la cola</span>
            <span>{Math.round(progressPct)}% completado</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Patient info chip */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            {patient.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-dark text-sm truncate">{patient.name}</p>
            <p className="text-xs text-dark/45">{patient.phone}</p>
          </div>
        </div>

        {/* Tip */}
        <div className="flex items-start gap-3 bg-secondary/5 border border-secondary/15 rounded-xl p-3.5">
          <Bell size={15} className="text-secondary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-dark/60 leading-relaxed">
            <strong className="text-dark/80">Consejo:</strong> Dejá esta pantalla abierta,
            el tiempo se actualiza en vivo. Llegá 5 minutos antes de que el contador
            llegue a cero.
          </p>
        </div>

        {/* Cancel */}
        <button
          id="cancel-ticket-btn"
          onClick={handleCancel}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2
            border-accent/25 text-accent font-bold text-sm hover:bg-accent hover:text-white
            hover:border-accent transition-all duration-200"
        >
          <AlertTriangle size={15} />
          Cancelar mi lugar en la fila
        </button>
      </div>
    </div>
  );
}
