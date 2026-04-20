import { useState, useEffect } from 'react';
import { Phone, Clock, Trash2 } from 'lucide-react';
import type { Patient } from '../../types';
import { useQueueStore } from '../../store/useQueueStore';

interface QueueCardProps {
  patient: Patient;
  position: number;
}

function getElapsedLabel(registeredAt: Date): string {
  const mins = Math.floor((Date.now() - registeredAt.getTime()) / 60_000);
  if (mins < 1) return 'Ahora mismo';
  if (mins === 1) return 'Hace 1 min';
  return `Hace ${mins} min`;
}

export default function QueueCard({ patient, position }: QueueCardProps) {
  const { cancelPatient } = useQueueStore();
  const [elapsed, setElapsed] = useState(() => getElapsedLabel(patient.registeredAt));

  // Refresh elapsed time every 30 s
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(getElapsedLabel(patient.registeredAt));
    }, 30_000);
    return () => clearInterval(timer);
  }, [patient.registeredAt]);

  return (
    <div className="card flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Position bubble */}
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-primary font-black text-sm">{position}</span>
      </div>

      {/* Patient info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-bold text-dark truncate">{patient.name}</p>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
            {patient.ticketCode}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-dark/45 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Phone size={12} />
            {patient.phone}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {elapsed}
          </span>
        </div>
      </div>

      {/* Remove from queue */}
      <button
        onClick={() => cancelPatient(patient.id)}
        className="p-2 text-dark/20 hover:text-accent hover:bg-accent/10 rounded-xl
          transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
        title="Quitar de la cola"
        aria-label={`Quitar a ${patient.name} de la cola`}
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}
