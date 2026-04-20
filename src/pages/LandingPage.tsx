import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Smartphone,
  TicketCheck,
  Users,
  Clock,
  ClipboardList,
  Link2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// ── Hero ticket mockup (decorative) ─────────────────────────────────────────
function HeroMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      {/* Stacked background shadows for depth */}
      <div className="absolute -top-3 -left-3 w-full h-full bg-secondary/20 rounded-3xl rotate-3" />
      <div className="absolute -top-1.5 -left-1.5 w-full h-full bg-primary/10 rounded-3xl rotate-1" />

      {/* Main card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
        {/* Card header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-dark/40 font-bold uppercase tracking-wider">
              Ticket Virtual
            </p>
            <p className="text-sm font-black text-primary mt-0.5">Clínica San Rafael</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
            En vivo
          </span>
        </div>

        {/* Ticket number */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl py-5 text-center mb-5">
          <p className="text-xs text-dark/40 font-semibold mb-1">Tu número de ticket</p>
          <p className="text-6xl font-black text-primary tracking-tight">#A-003</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-secondary/10 rounded-xl p-3 text-center">
            <p className="text-xs text-dark/40 mb-1">Tu posición</p>
            <p className="text-2xl font-black text-secondary">3ro</p>
          </div>
          <div className="bg-accent/10 rounded-xl p-3 text-center">
            <p className="text-xs text-dark/40 mb-1">Tiempo est.</p>
            <p className="text-2xl font-black text-accent">~36 min</p>
          </div>
        </div>

        {/* Patient chip */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            M
          </div>
          <div>
            <p className="text-sm font-bold text-dark">María José H.</p>
            <p className="text-xs text-dark/40">+503 7823-4512</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── How it works steps ───────────────────────────────────────────────────────
const steps = [
  {
    icon: QrCode,
    step: '01',
    title: 'Compartí el link de tu clínica',
    desc: 'Cada clínica recibe un enlace único listo para compartir por WhatsApp, redes sociales o como código QR en tu sala de espera.',
  },
  {
    icon: Smartphone,
    step: '02',
    title: 'El paciente se registra',
    desc: 'Solo necesita su nombre y número de teléfono. Sin apps que descargar, sin cuentas, sin complicaciones.',
  },
  {
    icon: TicketCheck,
    step: '03',
    title: 'Recibe su ticket virtual',
    desc: 'Ve su posición y el tiempo estimado de espera actualizándose segundo a segundo en tiempo real.',
  },
];

// ── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Users,
    colorText: 'text-primary',
    colorBg: 'bg-primary/10',
    title: 'Filas 100% digitales',
    desc: 'Eliminá las aglomeraciones en tu sala de espera. Tus pacientes esperan desde la comodidad de su casa.',
  },
  {
    icon: Clock,
    colorText: 'text-secondary',
    colorBg: 'bg-secondary/10',
    title: 'Tiempo estimado en vivo',
    desc: 'El contador se actualiza segundo a segundo para que cada paciente sepa exactamente cuándo llegar.',
  },
  {
    icon: ClipboardList,
    colorText: 'text-accent',
    colorBg: 'bg-accent/10',
    title: 'Historial de atención',
    desc: 'Registrá cuánto tardó cada consulta, hora de llamada, duración y más. Optimizá tu tiempo.',
  },
  {
    icon: Link2,
    colorText: 'text-primary',
    colorBg: 'bg-primary/10',
    title: 'Link único por clínica',
    desc: 'Personalizá tu enlace con el nombre de tu clínica. Simple y profesional desde el primer día.',
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Gradient backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="absolute top-10 right-0 w-[700px] h-[700px] bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Left: copy */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-bold mb-6 border border-accent/20">
                <Sparkles size={14} />
                Gestión de filas inteligente para clínicas
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-dark leading-tight mb-5">
                Digitalizá la{' '}
                <span className="text-primary">espera</span>
                {' '}en tu clínica
              </h1>

              <p className="text-lg text-dark/60 leading-relaxed mb-8 max-w-lg">
                Fila Smart le permite a tus pacientes sacar su turno desde el celular,
                recibir su ticket virtual y{' '}
                <strong className="text-dark/80">llegar justo cuando les toca.</strong>{' '}
                Sin filas. Sin estrés.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  id="hero-cta-primary"
                  onClick={() => navigate('/dashboard')}
                  className="btn-accent flex items-center justify-center gap-2 py-3.5"
                >
                  Empezá gratis
                  <ArrowRight size={18} />
                </button>
                <a
                  href="#como-funciona"
                  className="btn-outline flex items-center justify-center gap-2 py-3.5"
                >
                  Ver cómo funciona
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {[
                  { icon: CheckCircle2, text: 'Sin instalaciones' },
                  { icon: Zap, text: 'Configuración en minutos' },
                  { icon: Shield, text: 'Gratis para empezar' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-dark/55 font-semibold">
                    <Icon size={15} className="text-secondary flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="animate-float">
                <HeroMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-secondary text-sm font-bold uppercase tracking-wider">
              Proceso simple
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-dark mt-2 mb-4">
              ¿Cómo funciona Fila Smart?
            </h2>
            <p className="text-dark/55 max-w-md mx-auto">
              Tres pasos. Sin complicaciones. Tu clínica lista en minutos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="text-center group">
                <div className="relative inline-flex flex-col items-center">
                  {/* Icon box */}
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 relative">
                    <Icon size={36} className="text-primary" strokeWidth={1.5} />
                    {/* Step badge */}
                    <span className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-accent text-white text-xs font-black rounded-full flex items-center justify-center shadow-sm">
                      {step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-3">{title}</h3>
                  <p className="text-dark/55 leading-relaxed text-sm max-w-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section id="caracteristicas" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-secondary text-sm font-bold uppercase tracking-wider">
              Características
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-dark mt-2 mb-4">
              Todo lo que necesita tu clínica
            </h2>
            <p className="text-dark/55 max-w-md mx-auto">
              Herramientas simples pero poderosas para modernizar la gestión de tus pacientes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, colorText, colorBg, title, desc }) => (
              <div
                key={title}
                className="card hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-default"
              >
                <div
                  className={`w-12 h-12 ${colorBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={22} className={colorText} />
                </div>
                <h3 className="text-base font-bold text-dark mb-2">{title}</h3>
                <p className="text-dark/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-primary relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-bold mb-7 border border-white/15">
            <Zap size={14} />
            Sin tarjeta de crédito requerida
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
            ¿Listo para transformar tu clínica?
          </h2>

          <p className="text-white/65 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Clínicas de todo El Salvador ya eliminaron las filas físicas con Fila Smart.
            Únite hoy y empezá en menos de 5 minutos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              id="cta-final-primary"
              onClick={() => navigate('/dashboard')}
              className="bg-accent text-white px-8 py-4 rounded-xl font-black text-lg
                hover:bg-accent/90 transition-all shadow-xl hover:shadow-2xl
                hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              Empezá gratis ahora
              <ArrowRight size={20} />
            </button>
            <button
              id="cta-final-demo"
              onClick={() => navigate('/c/san-rafael')}
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg
                hover:bg-white/20 transition-all border border-white/20
                flex items-center justify-center gap-2"
            >
              Ver ejemplo de clínica
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
