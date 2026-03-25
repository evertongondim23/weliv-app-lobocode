import type { CSSProperties } from 'react';

/** Tokens visuais compartilhados do módulo Financeiro (admin). */
export const financeBorderStyle = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const financePrimaryActionStyle = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
} as const;

export const financeFilterChipStyle: CSSProperties = {
  borderColor: 'rgba(255, 165, 0, 0.25)',
  color: '#4A3728',
  background: '#FFF8E7',
};
