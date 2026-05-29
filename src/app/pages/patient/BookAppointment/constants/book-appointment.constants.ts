export const CARD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;
export const PRIMARY_GRADIENT_STYLE = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
} as const;
export const CARD_TOP_BAR_STYLE = PRIMARY_GRADIENT_STYLE;
export const OUTLINE_BUTTON_STYLE = {
  borderColor: 'rgba(255, 165, 0, 0.2)',
  color: '#4A3728',
} as const;
export const TITLE_COLOR = '#4A3728';
export const MUTED_COLOR = '#6B5D53';
export const AVATAR_BORDER_COLOR = '#FFA500';
export const AVATAR_FALLBACK_STYLE = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
  color: 'white',
} as const;
export const CARD_HEADER_STYLE = {
  borderColor: 'rgba(74, 55, 40, 0.08)',
  background: 'linear-gradient(135deg, #FFF8E7, #FFFFFF)',
} as const;
export const ALERT_BOX_STYLE = {
  borderColor: 'rgba(255, 165, 0, 0.2)',
  background: '#FFF8E7',
} as const;
export const ADDRESS_BOX_BORDER = { borderColor: 'rgba(74, 55, 40, 0.12)' } as const;
export const SUMMARY_CARD_STYLE = {
  borderColor: 'rgba(255, 165, 0, 0.2)',
  background: 'linear-gradient(135deg, #FFF8E7, #FFFFFF)',
} as const;

export const APPOINTMENT_TYPE_LABEL = 'Consulta Presencial';

export const SLOT_LEGEND = [
  { label: 'Disponível', colorClass: 'bg-[#FFA500]' },
  { label: 'Indisponível (bloqueado)', colorClass: 'bg-[#9CA3AF]' },
  { label: 'Ocupado', colorClass: 'bg-[#4A3728]/40' },
] as const;
