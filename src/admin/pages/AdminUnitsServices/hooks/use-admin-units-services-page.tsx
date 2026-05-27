import { useMemo, useState } from 'react';
import { Checkbox } from '../../../../app/components/ui/checkbox';
import type { AssignSpecialtyOption } from '../../../components/drawers/AssignSpecialtyDrawer';
import type { DataTableColumn } from '../../../components/tables/DataTable';
import {
  adminCatalogServicesSeed,
  adminCatalogSpecialties,
  type AdminCatalogService,
} from '../../../mocks/adminCatalogEntities';
import { statusLabel } from '../constants/admin-units-services-page.constants';
import type { StatusFilter } from '../types/admin-units-services-page.types';
import {
  buildSpecialtyById,
  filterCatalogServices,
  hasUnitsServicesFilters,
} from '../utils/admin-units-services-page.utils';

export function useAdminUnitsServicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [services, setServices] = useState<AdminCatalogService[]>(adminCatalogServicesSeed);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const specialtyById = useMemo(() => buildSpecialtyById(adminCatalogSpecialties), []);

  const specialtyOptions: AssignSpecialtyOption[] = useMemo(() => {
    return adminCatalogSpecialties.map((s) => ({
      id: s.id,
      label: s.name,
      disabled: s.status !== 'active',
    }));
  }, []);

  const filteredServices = useMemo(
    () => filterCatalogServices(services, search, statusFilter),
    [search, services, statusFilter]
  );

  const selectedCount = selectedIds.size;
  const hasActiveFilters = hasUnitsServicesFilters(search, statusFilter);

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
  }

  function toggleRow(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const allFilteredSelected =
    filteredServices.length > 0 && filteredServices.every((svc) => selectedIds.has(svc.id));

  function toggleSelectPage(checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) filteredServices.forEach((svc) => next.add(svc.id));
      else filteredServices.forEach((svc) => next.delete(svc.id));
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function onConfirmAssign(specialtyId: string) {
    setServices((prev) =>
      prev.map((svc) => (selectedIds.has(svc.id) ? { ...svc, specialtyId } : svc))
    );
    setDrawerOpen(false);
    clearSelection();
  }

  const serviceColumns: DataTableColumn<AdminCatalogService>[] = useMemo(() => {
    return [
      {
        key: 'select',
        header: '',
        className: 'w-[44px]',
        render: (row) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selectedIds.has(row.id)}
              onCheckedChange={(v) => toggleRow(row.id, Boolean(v))}
            />
          </div>
        ),
      },
      {
        key: 'name',
        header: 'Serviço',
        className: 'min-w-[360px]',
        render: (row) => (
          <div className="space-y-0.5">
            <div className="text-sm font-medium" style={{ color: '#4A3728' }}>
              {row.name}
            </div>
            <div className="text-xs" style={{ color: '#6B5D53' }}>
              {row.id}
            </div>
          </div>
        ),
      },
      {
        key: 'specialty',
        header: 'Especialidade',
        render: (row) => (
          <span className="text-sm" style={{ color: '#6B5D53' }}>
            {row.specialtyId ? specialtyById[row.specialtyId] : '—'}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <span className="text-xs font-medium" style={{ color: '#6B5D53' }}>
            {statusLabel(row.status)}
          </span>
        ),
      },
    ];
  }, [selectedIds, specialtyById]);

  return {
    servicesCount: services.length,
    specialtiesCount: adminCatalogSpecialties.length,
    servicesTab: {
      search,
      onSearchChange: setSearch,
      statusFilter,
      onStatusFilterChange: setStatusFilter,
      filteredServices,
      serviceColumns,
      allFilteredSelected,
      onToggleSelectPage: toggleSelectPage,
      hasActiveFilters,
      onClearFilters: clearFilters,
      selectedCount,
      onClearSelection: clearSelection,
      onOpenDrawer: () => setDrawerOpen(true),
      drawerOpen,
      onDrawerOpenChange: setDrawerOpen,
      specialtyOptions,
      onConfirmAssign,
    },
  };
}
