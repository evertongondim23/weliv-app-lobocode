import type { Appointment } from '../../../../types';
import type { AppointmentStatusDisplay } from '../types/professional-schedule.types';

export const CARD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const CALENDAR_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const CONFIRM_BUTTON_STYLE = { background: 'linear-gradient(135deg, #10b981, #059669)' } as const;

export const AVATAR_FALLBACK_STYLE = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
  color: 'white',
} as const;

export const UPCOMING_FREE_SLOTS_PREVIEW = 8;

export const APPOINTMENT_STATUS_CONFIG: Record<Appointment['status'], AppointmentStatusDisplay> = {
  scheduled: {
    color: '#FFA500',
    bg: 'rgba(255, 165, 0, 0.1)',
    label: 'Agendada',
  },
  confirmed: {
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    label: 'Confirmada',
  },
  completed: {
    color: '#6B5D53',
    bg: 'rgba(107, 93, 83, 0.1)',
    label: 'Realizada',
  },
  cancelled: {
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.1)',
    label: 'Cancelada',
  },
  'no-show': {
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.1)',
    label: 'Falta',
  },
};
