import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CalendarDays, LogOut, Menu } from 'lucide-react';
import { Button } from '../../../app/components/ui/button';
import { clinicRouteTitles } from '../../config/navigation';
import { useAuth } from '../../../app/contexts/AuthContext';

type ClinicTopbarProps = {
  onOpenMobileMenu: () => void;
};

export function ClinicTopbar({ onOpenMobileMenu }: ClinicTopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentTitle = clinicRouteTitles[location.pathname] ?? 'Painel';

  const handleLogout = () => {
    logout();
    navigate('/login/clinica');
  };

  const nowLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date());

  return (
    <header
      className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur px-4 md:px-6 py-3"
      style={{ borderColor: 'rgba(255, 165, 0, 0.12)' }}
    >
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onOpenMobileMenu}
          className="md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium" style={{ color: '#6B5D53' }}>
            Clínica / {currentTitle}
          </p>
          <h2 className="text-sm md:text-base font-semibold truncate" style={{ color: '#4A3728' }}>
            {currentTitle}
          </h2>
        </div>

        <div
          className="hidden xl:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)', color: '#6B5D53' }}
        >
          <CalendarDays className="size-3.5" />
          {nowLabel}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          className="inline-flex border-2 gap-1.5 shrink-0"
          style={{ borderColor: 'rgba(255, 165, 0, 0.28)', color: '#4A3728' }}
          aria-label="Sair da conta"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </header>
  );
}
