import type { AdminCatalogService } from '../../../mocks/adminCatalogEntities';

export const unitsServicesCardBorderStyle = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const STATUS_FILTER_OPTIONS = [
  { label: 'Todos', value: 'all' },
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' },
] as const;

export function statusLabel(status: AdminCatalogService['status']) {
  return status === 'active' ? 'Ativo' : 'Inativo';
}
