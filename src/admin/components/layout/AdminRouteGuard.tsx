import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../../app/contexts/AuthContext';
import { dashboardPathForRole } from '../../../app/lib/auth-routes';

type AdminRouteGuardProps = {
  children: React.ReactNode;
};

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, isAuthenticated, authReady } = useAuth();
  const location = useLocation();

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

  if (!isAuthenticated || !user) {
    return <Navigate to="/login/admin" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== 'admin') {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }

  return <>{children}</>;
}
