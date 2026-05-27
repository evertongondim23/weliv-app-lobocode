import type { WeekSchedule } from '../../../../types';

export const MAX_PROFESSIONAL_TITLE = 120;
export const MAX_BIOGRAPHY = 600;
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export const DAY_NAMES: Record<string, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export const TAB_TRIGGER_CLASS =
  'h-11 rounded-xl data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20 data-[state=active]:border-transparent data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)]';

export const PRIMARY_ACTION_STYLE = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
} as const;

export const FIELD_CLASS_NAME =
  'border-2 bg-white/95 focus-visible:ring-2 focus-visible:ring-blue-500/25';

export const FIELD_STYLE = { borderColor: 'rgba(255, 165, 0, 0.22)' } as const;

export const CARD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const DEFAULT_WEEK_SCHEDULE: WeekSchedule = {
  monday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  tuesday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  wednesday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  thursday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  friday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  saturday: { enabled: false, start: '08:00', end: '12:00' },
  sunday: { enabled: false, start: '08:00', end: '12:00' },
};

export const DEFAULT_INSURANCES = ['Unimed', 'Bradesco Saúde', 'Amil'];
