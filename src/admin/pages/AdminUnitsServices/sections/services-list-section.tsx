import { RotateCcw } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import { Card, CardContent, CardDescription } from '../../../../app/components/ui/card';
import { Checkbox } from '../../../../app/components/ui/checkbox';
import { PageHeader } from '../../../components/common/PageHeader';
import { BulkActionBar } from '../../../components/bulk/BulkActionBar';
import { AssignSpecialtyDrawer } from '../../../components/drawers/AssignSpecialtyDrawer';
import { FilterBar } from '../../../components/filters/FilterBar';
import { DataTable } from '../../../components/tables/DataTable';
import {
  STATUS_FILTER_OPTIONS,
  unitsServicesCardBorderStyle,
} from '../constants/admin-units-services-page.constants';
import type { ServicesListSectionProps } from '../types/admin-units-services-page.types';

export function ServicesListSection({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  filteredServices,
  serviceColumns,
  allFilteredSelected,
  onToggleSelectPage,
  hasActiveFilters,
  onClearFilters,
  selectedCount,
  onClearSelection,
  onOpenDrawer,
  drawerOpen,
  onDrawerOpenChange,
  specialtyOptions,
  onConfirmAssign,
}: ServicesListSectionProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Unidades e serviços"
        description="Catálogo de unidades, especialidades e serviços ofertados."
      />

      <Card className="border-2" style={unitsServicesCardBorderStyle}>
        <CardContent className="pt-6 space-y-4">
          <FilterBar
            searchPlaceholder="Buscar por nome ou ID do serviço..."
            searchValue={search}
            onSearchChange={onSearchChange}
            filterValue={statusFilter}
            onFilterChange={(v) => onStatusFilterChange(v as typeof statusFilter)}
            filterLabel="Status"
            options={[...STATUS_FILTER_OPTIONS]}
          />

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardDescription>{filteredServices.length} registro(s) encontrado(s)</CardDescription>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 bg-white">
                <Checkbox
                  checked={allFilteredSelected}
                  onCheckedChange={(v) => onToggleSelectPage(Boolean(v))}
                  disabled={filteredServices.length === 0}
                />
                <span className="text-xs" style={{ color: '#4A3728' }}>
                  Selecionar página
                </span>
              </div>

              {hasActiveFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClearFilters}
                  className="h-8 px-2 text-[#6B5D53]"
                >
                  <RotateCcw className="size-3.5 mr-1" />
                  Limpar filtros
                </Button>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <DataTable rows={filteredServices} columns={serviceColumns} rowKey={(row) => row.id} />

            <BulkActionBar
              selectedCount={selectedCount}
              onClearSelection={onClearSelection}
              onPrimaryAction={onOpenDrawer}
            />
          </div>
        </CardContent>
      </Card>

      <AssignSpecialtyDrawer
        open={drawerOpen}
        onOpenChange={onDrawerOpenChange}
        selectedCount={selectedCount}
        specialtyOptions={specialtyOptions}
        onConfirm={onConfirmAssign}
      />
    </div>
  );
}
