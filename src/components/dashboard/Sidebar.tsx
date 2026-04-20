import { useNavigate } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Settings,
  LogOut,
  X,
  Building2,
} from 'lucide-react';
import { useQueueStore } from '../../store/useQueueStore';
import type { DashboardSection } from '../../types';

interface NavItem {
  id: DashboardSection;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
  { id: 'cola', label: 'Cola de pacientes', icon: Users },
  { id: 'perfil', label: 'Mi perfil', icon: UserCircle },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const {
    activeSection,
    setActiveSection,
    sidebarOpen,
    setSidebarOpen,
    activeClinic,
  } = useQueueStore();

  const handleNavClick = (id: DashboardSection) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-primary flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto lg:shrink-0
      `}
    >
      {/* Logo row */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <img
          src="/logo.png"
          alt="Fila Smart"
          className="h-8 w-auto brightness-0 invert"
        />
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>
      </div>

      {/* Active clinic info */}
      <div className="px-4 py-4 mx-3 my-3 bg-white/10 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-bold truncate">{activeClinic.name}</p>
            <p className="text-white/50 text-xs truncate">{activeClinic.specialty}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              id={`sidebar-nav-${id}`}
              onClick={() => handleNavClick(id)}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left
                transition-all duration-150 group
                ${
                  isActive
                    ? 'bg-white text-primary font-bold shadow-sm'
                    : 'text-white/65 hover:bg-white/10 hover:text-white font-semibold'
                }
              `}
            >
              <Icon
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-primary' : 'text-white/65 group-hover:text-white'}
              />
              <span className="text-sm">{label}</span>
              {id === 'cola' && (
                <span
                  className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-primary/15 text-primary' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Live
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: user info + logout */}
      <div className="px-3 pb-5 pt-3 border-t border-white/10">
        <div className="px-3.5 py-2 mb-2">
          <p className="text-white/35 text-xs font-semibold uppercase tracking-wider">
            Modo demo
          </p>
          <p className="text-white text-sm font-bold mt-0.5">Doctor / Clínica</p>
        </div>
        <button
          id="sidebar-logout-btn"
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl
            text-white/55 hover:bg-white/10 hover:text-white transition-all font-semibold"
        >
          <LogOut size={19} />
          <span className="text-sm">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
