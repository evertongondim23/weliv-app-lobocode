import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../../app/contexts/AuthContext';
import { useClinic } from '../../contexts/ClinicContext';
import { Button } from '../../../app/components/ui/button';
import { WelivLogo } from '../../../app/components/WelivLogo';
import { clinicNavGroups } from '../../config/navigation';
import { ClinicUnitSelector } from './ClinicUnitSelector';

type ClinicSidebarProps = {
  onNavigate?: () => void;
};

export function ClinicSidebar({ onNavigate }: ClinicSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { clinic } = useClinic();

  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate('/login/clinica');
  };

  const isNetworkClinic = clinic && clinic.units.length > 0;

  return (
    <aside className="flex h-full w-full flex-col border-r bg-white" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
      {/* Header */}
      <div
        className="px-4 py-4 border-b"
        style={{ borderColor: 'rgba(255, 165, 0, 0.12)' }}
      >
        <WelivLogo size="sm" showText />
        <div className="mt-2 flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate" style={{ color: '#4A3728' }}>
              {clinic?.name ?? 'Minha Clínica'}
            </p>
            <p className="text-[11px]" style={{ color: '#6B5D53' }}>
              Portal do Gestor
            </p>
          </div>
        </div>

        {isNetworkClinic && (
          <div className="mt-3">
            <ClinicUnitSelector />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {clinicNavGroups.map((group) => {
          const GroupIcon = group.icon;
          const isGroupActive =
            location.pathname.startsWith(group.basePath) ||
            group.children.some((c) => c.path === location.pathname);

          return (
            <div key={group.label} className="space-y-1.5">
              <div
                className="px-2 py-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide"
                style={{ color: isGroupActive ? '#FFA500' : '#6B5D53' }}
              >
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
                        isActive
                          ? 'text-white shadow-sm'
                          : 'hover:bg-[#FFF8E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]/30'
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

      {/* Footer */}
      <div className="px-3 py-3 border-t space-y-2" style={{ borderColor: 'rgba(255, 165, 0, 0.12)' }}>
        <div
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FAFAFA' }}
        >
          <p className="text-xs font-semibold truncate" style={{ color: '#4A3728' }}>{user?.name}</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#6B5D53' }}>Gestor • weliv v1</p>
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
