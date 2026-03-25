import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../../app/contexts/AuthContext';

type AdminRouteGuardProps = {
  children: React.ReactNode;
};

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
