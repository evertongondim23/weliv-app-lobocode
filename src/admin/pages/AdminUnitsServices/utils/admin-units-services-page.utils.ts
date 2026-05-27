import type { AdminCatalogService, AdminCatalogSpecialty } from '../../../mocks/adminCatalogEntities';
import type { StatusFilter } from '../types/admin-units-services-page.types';

export function buildSpecialtyById(specialties: AdminCatalogSpecialty[]) {
  return specialties.reduce<Record<string, string>>((acc, s) => {
    acc[s.id] = s.name;
    return acc;
  }, {});
}

export function filterCatalogServices(
  services: AdminCatalogService[],
  search: string,
  statusFilter: StatusFilter
) {
  const text = search.trim().toLowerCase();
  return services.filter((svc) => {
    const matchesSearch = text.length === 0 || `${svc.id} ${svc.name}`.toLowerCase().includes(text);
    const matchesStatus = statusFilter === 'all' || svc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
}

export function hasUnitsServicesFilters(search: string, statusFilter: StatusFilter) {
  return search.trim().length > 0 || statusFilter !== 'all';
}
