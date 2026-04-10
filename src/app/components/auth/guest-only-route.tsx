import React, { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { dashboardPathForRole } from '../../lib/auth-routes';
import { useAuth } from './AuthContext';

type GuestOnlyRouteProps = {
  children: ReactNode;
};

/**
 * Rotas só para utilizador não autenticado (login, cadastro).
 * Utilizador com sessão válida é enviado para a área do seu perfil.
 */
export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { user, isAuthenticated, authReady } = useAuth();

  if (!authReady) {
    return (
      <div
        className="min-h-[40vh] w-full flex items-center justify-center text-sm"
        style={{ color: '#6B5D53' }}
        aria-busy="true"
      >
        Carregando…
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }

  return <>{children}</>;
}
