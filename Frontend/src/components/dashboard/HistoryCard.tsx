import { CheckCircle2, Clock, Phone, Timer } from 'lucide-react';
import type { Patient } from '../../types';

interface HistoryCardProps {
  patient: Patient;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-SV', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDuration(start: Date, end: Date): string {
  const totalSecs = Math.round((end.getTime() - start.getTime()) / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  if (mins === 0) return `${secs} seg`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} seg`;
}

export default function HistoryCard({ patient }: HistoryCardProps) {
  const duration =
    patient.calledAt && patient.finishedAt
      ? formatDuration(patient.calledAt, patient.finishedAt)
      : null;

  const waitTime =
    patient.registeredAt && patient.calledAt
      ? formatDuration(patient.registeredAt, patient.calledAt)
      : null;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start gap-4">
      {/* Done icon */}
      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle2 size={19} className="text-emerald-600" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <p className="font-bold text-dark/70">{patient.name}</p>
          <span className="text-xs font-semibold text-dark/35 bg-gray-200 px-2 py-0.5 rounded-full">
            {patient.ticketCode}
          </span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full hidden sm:inline">
            Atendido
          </span>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-5 gap-y-1 text-xs text-dark/40">
          <span className="flex items-center gap-1.5">
            <Phone size={11} />
            {patient.phone}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={11} />
            Llamado:{' '}
            <strong className="text-dark/55">
              {patient.calledAt ? formatTime(patient.calledAt) : '—'}
            </strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={11} />
            Finalizado:{' '}
            <strong className="text-dark/55">
              {patient.finishedAt ? formatTime(patient.finishedAt) : '—'}
            </strong>
          </span>
          {waitTime && (
            <span className="flex items-center gap-1.5">
              <Timer size={11} />
              En espera: <strong className="text-dark/55">{waitTime}</strong>
            </span>
          )}
          {duration && (
            <span className="flex items-center gap-1.5 font-semibold text-dark/55">
              <Timer size={11} />
              Consulta: <strong className="text-primary/70">{duration}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
