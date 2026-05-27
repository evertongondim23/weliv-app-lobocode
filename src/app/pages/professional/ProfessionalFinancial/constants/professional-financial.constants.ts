export const FIELD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const CARD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const TABS_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.25)' } as const;

export const PRIMARY_GRADIENT_STYLE = { background: 'linear-gradient(135deg, #FFA500, #FF8C00)' } as const;

export const CONFIRMATION_CARD_STYLE = {
  borderColor: '#FFA500',
  background: 'linear-gradient(to right, rgba(255, 165, 0, 0.05), rgba(251, 174, 68, 0.05))',
} as const;

export const GENERAL_SUMMARY_CARD_STYLE = {
  borderColor: '#FFA500',
  background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(251, 174, 68, 0.1))',
} as const;

export const TEXT_PRIMARY_COLOR = '#4A3728';

export const TEXT_MUTED_COLOR = '#6B5D53';

export const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Últimos 7 Dias' },
  { value: 'monthly', label: 'Últimos 6 Meses' },
  { value: 'yearly', label: 'Ano Atual' },
] as const;

export const REVENUE_CARD_BORDER = {
  realized: 'rgba(16, 185, 129, 0.3)',
  potential: 'rgba(59, 130, 246, 0.3)',
  lost: 'rgba(239, 68, 68, 0.3)',
} as const;

export const INDICATOR_CARD_BORDER = {
  total: 'rgba(255, 165, 0, 0.2)',
  noShow: 'rgba(239, 68, 68, 0.2)',
  remarcation: 'rgba(255, 165, 0, 0.2)',
  efficiency: 'rgba(16, 185, 129, 0.2)',
} as const;

export const BREAKDOWN_ROW_STYLE = {
  completed: { borderColor: 'rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)' },
  scheduled: { borderColor: 'rgba(59, 130, 246, 0.2)', background: 'rgba(59, 130, 246, 0.05)' },
  noShow: { borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' },
  cancelled: { borderColor: 'rgba(107, 114, 128, 0.2)', background: 'rgba(107, 114, 128, 0.05)' },
} as const;
