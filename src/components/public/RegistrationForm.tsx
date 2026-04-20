import { useState } from 'react';
import { User, Phone, ArrowRight, Loader2 } from 'lucide-react';
import type { Patient } from '../../types';
import { useQueueStore } from '../../store/useQueueStore';
import { MINUTES_PER_PATIENT } from '../../data/mockData';

interface RegistrationFormProps {
  clinicId: string;
  onRegistered: (patient: Patient) => void;
}

export default function RegistrationForm({ clinicId, onRegistered }: RegistrationFormProps) {
  const { addPatient, queue, currentPatient } = useQueueStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const waitingCount =
    queue.filter((p) => p.clinicId === clinicId && p.status === 'waiting').length +
    (currentPatient?.clinicId === clinicId ? 1 : 0);

  const estimatedMinutes = waitingCount * MINUTES_PER_PATIENT;

  const validate = (): boolean => {
    const next: { name?: string; phone?: string } = {};
    if (!name.trim() || name.trim().length < 2) {
      next.name = 'Ingresá tu nombre completo (mínimo 2 caracteres)';
    }
    if (!phone.trim() || phone.trim().replace(/\D/g, '').length < 7) {
      next.phone = 'Ingresá un número de teléfono válido';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate a lightweight network round-trip
    await new Promise((res) => setTimeout(res, 700));

    const patient = addPatient(name.trim(), phone.trim(), clinicId);
    setLoading(false);
    onRegistered(patient);
  };

  return (
    <div>
      {/* At-a-glance stats */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        <div className="bg-primary/5 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-primary">{waitingCount}</p>
          <p className="text-xs text-dark/50 mt-1 font-semibold">en la fila ahora</p>
        </div>
        <div className="bg-secondary/10 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-secondary">
            ~{estimatedMinutes}
            <span className="text-sm font-semibold text-secondary/70 ml-1">min</span>
          </p>
          <p className="text-xs text-dark/50 mt-1 font-semibold">espera estimada</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <div>
          <label
            htmlFor="reg-name"
            className="block text-sm font-bold text-dark mb-1.5"
          >
            Nombre completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-dark/30">
              <User size={17} />
            </div>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: María José Hernández"
              className={`input-field pl-10 ${
                errors.name ? 'border-accent bg-accent/5 focus:ring-accent/30 focus:border-accent' : ''
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-accent text-xs mt-1.5 font-semibold">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="reg-phone"
            className="block text-sm font-bold text-dark mb-1.5"
          >
            Número de teléfono
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-dark/30">
              <Phone size={17} />
            </div>
            <input
              id="reg-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+503 7000-0000"
              className={`input-field pl-10 ${
                errors.phone ? 'border-accent bg-accent/5 focus:ring-accent/30 focus:border-accent' : ''
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-accent text-xs mt-1.5 font-semibold">{errors.phone}</p>
          )}
        </div>

        <button
          id="reg-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full btn-accent py-3.5 text-base flex items-center justify-center gap-2
            disabled:opacity-70 disabled:cursor-not-allowed mt-1"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              Unirme a la fila
              <ArrowRight size={20} />
            </>
          )}
        </button>

        <p className="text-center text-xs text-dark/35 mt-2">
          Solo usamos tu información para gestionar tu turno
        </p>
      </form>
    </div>
  );
}
