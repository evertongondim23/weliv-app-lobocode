import type { Notification } from '../../../../types';
import type { NotificationCardType } from '../types/patient-notifications.types';

export const HEADER_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const PRIMARY_BADGE_GRADIENT = 'linear-gradient(135deg, #FFA500, #FF8C00)';

export const TEXT_PRIMARY_COLOR = '#4A3728';

export const TEXT_MUTED_COLOR = '#6B5D53';

export const SECTION_DIVIDER_BORDER = 'rgba(255, 165, 0, 0.1)';

export const NOTIFICATION_TYPE_MAP: Record<Notification['type'], NotificationCardType> = {
  appointment: 'appointment',
  payment: 'payment',
  document: 'info',
  reminder: 'reminder',
  'waiting-list': 'info',
};
