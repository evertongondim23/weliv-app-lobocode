import type { UserRole } from '../types';

/** Alinhado aos endpoints `POST /auth/login`, `/auth/login/profissional`, `/auth/login/admin`. */
export type LoginPortal = 'patient' | 'professional' | 'admin';

export function loginPathForPortal(portal: LoginPortal): string {
  if (portal === 'patient') return '/login';
  if (portal === 'professional') return '/login/profissional';
  return '/login/admin';
}

/** Rota de login adequada após logout, consoante o último perfil autenticado. */
export function loginPathForUserRole(role: UserRole): string {
  if (role === 'admin') return '/login/admin';
  if (role === 'professional') return '/login/profissional';
  return '/login';
}

/** Área principal após autenticação (admin usa shell `/admin/*`). */
export function dashboardPathForRole(role: UserRole): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'professional') return '/professional/dashboard';
  return '/patient/dashboard';
}
