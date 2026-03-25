import type { Notification } from '../types';

/** URLs antigas em mock/localStorage que não correspondem às rotas da app */
const LEGACY_ACTION_PATHS: Record<string, string> = {
  '/appointments': '/patient/appointments',
  '/documents': '/patient/documents',
};

function isAppPath(path: string): boolean {
  return path.startsWith('/patient/') || path.startsWith('/professional/');
}

/**
 * Destino seguro para navegação a partir de uma notificação (corrige URLs legadas e fallback por tipo).
 */
export function resolveNotificationPath(
  notification: Notification,
  role: 'patient' | 'professional' | undefined
): string {
  let candidate = notification.actionUrl?.trim();
  if (candidate && LEGACY_ACTION_PATHS[candidate]) {
    candidate = LEGACY_ACTION_PATHS[candidate];
  }
  if (candidate && isAppPath(candidate)) {
    return candidate;
  }

  const r = role ?? 'patient';
  switch (notification.type) {
    case 'appointment':
      return r === 'professional' ? '/professional/schedule' : '/patient/appointments';
    case 'document':
      return r === 'professional' ? '/professional/patients' : '/patient/documents';
    case 'payment':
      return r === 'professional' ? '/professional/financial' : '/patient/dashboard';
    case 'reminder':
      return r === 'professional' ? '/professional/schedule' : '/patient/appointments';
    case 'waiting-list':
      return '/patient/search';
    default:
      return r === 'professional' ? '/professional/dashboard' : '/patient/dashboard';
  }
}
