import React from 'react';
import { NavLink, useLocation } from 'react-router';
import { adminNavGroups } from '../../config/navigation';
import { WelivLogo } from '../../../app/components/WelivLogo';
import { FolderKanban, Stethoscope, AlertTriangle, CheckCircle2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../app/contexts/AuthContext';
import { Button } from '../../../app/components/ui/button';

type AdminSidebarProps = {
  onNavigate?: () => void;
};

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const inOperationWorkspace = location.pathname.startsWith('/admin/operation');

  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate('/login/admin');
  };

  return (
    <aside className="flex h-full w-full flex-col border-r bg-white" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.12)' }}>
        <WelivLogo size="sm" showText />
        <p className="mt-2 text-xs font-medium" style={{ color: '#6B5D53' }}>
          Painel Administrativo
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {inOperationWorkspace ? (
          <section
            className="rounded-xl border p-3 space-y-3"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFFDF9' }}
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                Workspace Operação
              </p>
              <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>
                Monitoramento rápido
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <NavLink
                to="/admin/operation"
                onClick={onNavigate}
                end
                className={({ isActive }) =>
                  `rounded-lg border px-2.5 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                    isActive ? 'text-white border-transparent shadow-sm' : ''
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }
                    : { borderColor: 'rgba(255, 165, 0, 0.2)', color: '#4A3728', background: 'white' }
                }
              >
                <Stethoscope className="size-3.5" />
                Visão operação
              </NavLink>
              <NavLink
                to="/admin/operation/appointments"
                onClick={onNavigate}
                className={({ isActive }) =>
                  `rounded-lg border px-2.5 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                    isActive ? 'text-white border-transparent shadow-sm' : ''
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }
                    : { borderColor: 'rgba(255, 165, 0, 0.2)', color: '#4A3728', background: 'white' }
                }
              >
                <FolderKanban className="size-3.5" />
                Atendimentos
              </NavLink>
            </div>

            <div className="space-y-2">
              <div
                className="rounded-lg border px-2.5 py-2 flex items-center justify-between text-xs"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: 'white' }}
              >
                <span className="inline-flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
                  <AlertTriangle className="size-3.5 text-amber-600" />
                  Pendências críticas
                </span>
                <span className="font-semibold" style={{ color: '#4A3728' }}>
                  3
                </span>
              </div>
              <div
                className="rounded-lg border px-2.5 py-2 flex items-center justify-between text-xs"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: 'white' }}
              >
                <span className="inline-flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Fluxos em dia
                </span>
                <span className="font-semibold" style={{ color: '#4A3728' }}>
                  12
                </span>
              </div>
            </div>
          </section>
        ) : null}

        {adminNavGroups.map((group) => {
          const GroupIcon = group.icon;
          const isGroupActive = location.pathname.startsWith(group.basePath) || group.children.some((c) => c.path === location.pathname);

          return (
            <div key={group.label} className="space-y-1.5">
              <div className="px-2 py-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: isGroupActive ? '#FFA500' : '#6B5D53' }}>
                <GroupIcon className="size-3.5" />
                {group.label}
              </div>
              {group.children.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition ${
                        isActive ? 'text-white shadow-sm' : 'hover:bg-[#FFF8E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]/30'
                      }`
                    }
                    style={({ isActive }) =>
                      isActive
                        ? { background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }
                        : { color: '#4A3728' }
                    }
                  >
                    <ItemIcon className="size-4" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t space-y-2" style={{ borderColor: 'rgba(255, 165, 0, 0.12)' }}>
        <div className="rounded-lg border px-3 py-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FAFAFA' }}>
          <p className="text-xs font-semibold" style={{ color: '#4A3728' }}>Ambiente Administrativo</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#6B5D53' }}>weliv SaaS • v1 preview</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-center border-2 gap-2"
          style={{ borderColor: 'rgba(255, 165, 0, 0.28)', color: '#4A3728' }}
        >
          <LogOut className="size-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
