import type { SortBy } from '../types/search-professionals.types';

export const FIELD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const PRIMARY_ACTION_STYLE = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
} as const;

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'nearest', label: 'Mais próximo' },
  { value: 'price', label: 'Menor preço' },
  { value: 'availability', label: 'Disponibilidade' },
];
