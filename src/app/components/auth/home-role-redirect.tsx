import React from 'react';
import { Navigate } from 'react-router';
import { dashboardPathForRole } from '../../lib/auth-routes';
import { useAuth } from './AuthContext';

/** Redireciona `/` para o dashboard adequado ao perfil (requer sessão — usado dentro do Layout protegido). */
export function HomeRoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={dashboardPathForRole(user.role)} replace />;
}
