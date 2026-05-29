import type { Appointment } from '../../../../types';

export const CARD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;
export const CARD_TOP_GRADIENT_STYLE = {
  background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)',
} as const;
export const AVATAR_BORDER_COLOR = '#FFA500';
export const AVATAR_FALLBACK_STYLE = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
  color: 'white',
} as const;
export const TITLE_COLOR = '#4A3728';

export const TABS_LIST_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;
export const TABS_LIST_CLASS =
  'grid w-full grid-cols-3 h-auto p-1 border-2 bg-white';
export const TABS_TRIGGER_CLASS =
  'rounded-lg text-[#6B5D53] data-[state=active]:text-white data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)] data-[state=active]:shadow-sm';

export const RESCHEDULE_BUTTON_STYLE = {
  borderColor: 'rgba(255, 165, 0, 0.2)',
  color: '#4A3728',
} as const;
export const CANCEL_BUTTON_STYLE = {
  borderColor: 'rgba(239, 68, 68, 0.25)',
  color: '#b91c1c',
} as const;
export const OUTLINE_BUTTON_STYLE = {
  borderColor: 'rgba(255, 165, 0, 0.2)',
  color: '#4A3728',
} as const;
export const PRIMARY_ACTION_STYLE = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
} as const;
export const RESCHEDULE_INFO_BOX_STYLE = {
  background: '#FFF8E7',
  borderColor: 'rgba(255, 165, 0, 0.2)',
} as const;
export const DEPOSIT_BADGE_STYLE = {
  borderColor: 'rgba(255, 165, 0, 0.2)',
  color: '#FFA500',
} as const;

export const CONFIRMED_BADGE_STYLE = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
  color: 'white',
  border: 'none',
} as const;

export const APPOINTMENT_STATUS_CONFIG: Record<
  Appointment['status'],
  { variant: 'secondary' | 'default' | 'outline' | 'destructive'; label: string }
> = {
  scheduled: { variant: 'secondary', label: 'Agendada' },
  confirmed: { variant: 'default', label: 'Confirmada' },
  completed: { variant: 'outline', label: 'Realizada' },
  cancelled: { variant: 'destructive', label: 'Cancelada' },
  'no-show': { variant: 'destructive', label: 'Falta' },
};
