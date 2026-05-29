import type { UserRole } from '../types';

/** Alinhado aos endpoints `POST /auth/login`, `/auth/login/profissional`, `/auth/login/admin`. */
export type LoginPortal = 'patient' | 'professional' | 'clinic' | 'admin';

export function loginPathForPortal(portal: LoginPortal): string {
  if (portal === 'patient') return '/login';
  if (portal === 'professional') return '/login/profissional';
  if (portal === 'clinic') return '/login/clinica';
  return '/login/admin';
}

/** Rota de login adequada após logout, consoante o último perfil autenticado. */
export function loginPathForUserRole(role: UserRole): string {
  if (role === 'system_admin') return '/login/admin';
  if (role === 'clinic_admin') return '/login/clinica';
  if (role === 'professional') return '/login/profissional';
  return '/login';
}

/** Área principal após autenticação. */
export function dashboardPathForRole(role: UserRole): string {
  if (role === 'system_admin') return '/admin/dashboard';
  if (role === 'clinic_admin') return '/clinic/dashboard';
  if (role === 'professional') return '/professional/dashboard';
  return '/patient/dashboard';
}
