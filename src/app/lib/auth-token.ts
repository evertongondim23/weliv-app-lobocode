import type { User, UserRole } from '../types';

/** Converte role do Prisma/JWT para o modelo do app React. */
export function mapBackendRoleToFrontend(role: string): UserRole {
  if (role === 'SYSTEM_ADMIN' || role === 'ADMIN') return 'admin';
  if (role === 'PROFESSIONAL') return 'professional';
  if (role === 'PATIENT') return 'patient';
  return 'patient';
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      [...atob(base64)]
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function buildUserFromAccessToken(accessToken: string): User | null {
  const payload = decodeJwtPayload(accessToken);
  if (!payload || typeof payload.sub !== 'string') return null;
  const roleStr = typeof payload.role === 'string' ? payload.role : '';
  return {
    id: payload.sub,
    name: typeof payload.name === 'string' ? payload.name : '',
    email: typeof payload.email === 'string' ? payload.email : '',
    phone: '',
    cpf: '',
    role: mapBackendRoleToFrontend(roleStr),
  };
}
