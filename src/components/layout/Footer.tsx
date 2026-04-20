import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <img
              src="/logo.png"
              alt="Fila Smart"
              className="h-8 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Digitalizá la espera en tu clínica. Menos tiempo en fila, más tiempo en
              salud. Hecho especialmente para El Salvador.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white/40 mb-5">
              Plataforma
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#como-funciona"
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Cómo funciona
                </a>
              </li>
              <li>
                <a
                  href="#caracteristicas"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Características
                </a>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Dashboard
                  <ExternalLink size={12} />
                </Link>
              </li>
              <li>
                <Link
                  to="/c/san-rafael"
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Ver demo de clínica
                  <ExternalLink size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white/40 mb-5">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-white/40" />
                San Salvador, El Salvador
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="flex-shrink-0 text-white/40" />
                +503 2200-0000
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="flex-shrink-0 text-white/40" />
                hola@filasmart.sv
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/30 text-xs">
          <p>© 2025 Fila Smart. Todos los derechos reservados.</p>
          <p>Hecho con dedicación en El Salvador</p>
        </div>
      </div>
    </footer>
  );
}
