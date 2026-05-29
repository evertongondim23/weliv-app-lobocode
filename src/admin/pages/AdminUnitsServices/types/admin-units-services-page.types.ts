import type { AssignSpecialtyOption } from '../../../components/drawers/AssignSpecialtyDrawer';
import type { DataTableColumn } from '../../../components/tables/DataTable';
import type { AdminCatalogService } from '../../../mocks/adminCatalogEntities';

export type StatusFilter = 'all' | 'active' | 'inactive';

export type ServicesListSectionProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  filteredServices: AdminCatalogService[];
  serviceColumns: DataTableColumn<AdminCatalogService>[];
  allFilteredSelected: boolean;
  onToggleSelectPage: (checked: boolean) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onOpenDrawer: () => void;
  drawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  specialtyOptions: AssignSpecialtyOption[];
  onConfirmAssign: (specialtyId: string) => void;
};
