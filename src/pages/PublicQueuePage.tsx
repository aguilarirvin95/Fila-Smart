import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Stethoscope, Users, ArrowLeft, ExternalLink } from 'lucide-react';
import { mockClinics } from '../data/mockData';
import { useQueueStore } from '../store/useQueueStore';
import RegistrationForm from '../components/public/RegistrationForm';
import VirtualTicket from '../components/public/VirtualTicket';
import type { Patient } from '../types';

export default function PublicQueuePage() {
  const { slug } = useParams<{ slug: string }>();
  const { queue } = useQueueStore();
  const [myPatient, setMyPatient] = useState<Patient | null>(null);

  const clinic = mockClinics.find((c) => c.slug === slug);

  // ── 404 state ────────────────────────────────────────────────────────────
  if (!clinic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={32} className="text-gray-300" />
          </div>
          <h1 className="text-2xl font-black text-dark mb-2">Clínica no encontrada</h1>
          <p className="text-dark/50 mb-7 text-sm">
            El link que utilizaste no corresponde a ninguna clínica registrada en Fila Smart.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const totalWaiting = queue.filter(
    (p) => p.clinicId === clinic.id && p.status === 'waiting'
  ).length;

  // ── Page ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Top header */}
      <header className="bg-primary">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white
              text-xs font-semibold transition-colors mb-4"
          >
            <ArrowLeft size={13} />
            Volver al inicio
          </Link>
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="Fila Smart" className="h-8 w-auto brightness-0 invert" />
            <span className="text-white/40 text-xs font-semibold">Link público</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* Clinic info card */}
        <div className="card">
          <h1 className="text-xl font-black text-dark mb-1">{clinic.name}</h1>
          <div className="flex items-center gap-1.5 text-xs font-bold text-secondary mb-4">
            <Stethoscope size={13} />
            {clinic.specialty}
          </div>
          <div className="space-y-2 text-sm text-dark/55">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-dark/25 flex-shrink-0" />
              {clinic.address}
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-dark/25 flex-shrink-0" />
              {clinic.phone}
            </div>
          </div>

          {/* Quick queue summary when NOT yet registered */}
          {!myPatient && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-dark/40">
              <span className="flex items-center gap-1.5">
                <Users size={13} />
                {totalWaiting} {totalWaiting === 1 ? 'persona en la fila' : 'personas en la fila'}
              </span>
              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-primary hover:text-primary/70 transition-colors"
              >
                Ver dashboard
                <ExternalLink size={11} />
              </Link>
            </div>
          )}
        </div>

        {/* Registration form OR Virtual ticket */}
        {myPatient ? (
          <VirtualTicket patient={myPatient} onCancel={() => setMyPatient(null)} />
        ) : (
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users size={19} className="text-accent" />
              </div>
              <div>
                <h2 className="font-black text-dark text-base">Registrarse en la fila</h2>
                <p className="text-xs text-dark/45 font-semibold mt-0.5">
                  Ingresá tus datos para obtener tu ticket virtual
                </p>
              </div>
            </div>

            <RegistrationForm clinicId={clinic.id} onRegistered={setMyPatient} />
          </div>
        )}

        {/* Encargado footer */}
        <p className="text-center text-xs text-dark/25 font-semibold pb-4">
          Encargado de la fila: {clinic.encargadoCola}
        </p>
      </div>
    </div>
  );
}
