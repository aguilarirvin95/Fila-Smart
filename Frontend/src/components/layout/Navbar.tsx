import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, LogIn } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.png" alt="Fila Smart" className="h-8 w-auto" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#como-funciona"
              className="text-dark/60 hover:text-primary font-semibold text-sm transition-colors"
            >
              Cómo funciona
            </a>
            <a
              href="#caracteristicas"
              className="text-dark/60 hover:text-primary font-semibold text-sm transition-colors"
            >
              Características
            </a>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-login-btn"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-primary font-bold text-sm hover:text-primary/80 transition-colors px-3 py-2"
            >
              <LogIn size={15} />
              Iniciar sesión
            </button>
            <button
              id="nav-register-btn"
              onClick={() => navigate('/dashboard')}
              className="btn-primary py-2 px-5 text-sm flex items-center gap-1.5"
            >
              Empezá gratis
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            id="nav-mobile-menu-btn"
            className="md:hidden p-2 rounded-xl text-dark/60 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          <a
            href="#como-funciona"
            className="block text-dark/70 hover:text-primary font-semibold py-2.5 px-3 rounded-xl hover:bg-gray-50 text-sm transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Cómo funciona
          </a>
          <a
            href="#caracteristicas"
            className="block text-dark/70 hover:text-primary font-semibold py-2.5 px-3 rounded-xl hover:bg-gray-50 text-sm transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Características
          </a>
          <div className="pt-3 space-y-2 border-t border-gray-100 mt-2">
            <button
              onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
              className="w-full btn-outline py-2.5 text-sm"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
              className="w-full btn-primary py-2.5 text-sm"
            >
              Empezá gratis
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
