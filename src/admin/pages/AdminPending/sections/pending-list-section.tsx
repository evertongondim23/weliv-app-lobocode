import { Button } from '../../../../app/components/ui/button';
import { Card, CardContent } from '../../../../app/components/ui/card';
import { FilterBar } from '../../../components/filters/FilterBar';
import { DataTable } from '../../../components/tables/DataTable';
import { PendingDetailPanel } from '../components/pending-detail-panel';
import { PendingEmptyState } from '../components/pending-empty-state';
import {
  pendingCardBorderStyle,
  STATUS_FILTER_OPTIONS,
} from '../constants/admin-pending-page.constants';
import type { PendingListSectionProps } from '../types/admin-pending-page.types';
import { pendingRowAccent } from '../utils/admin-pending-page.utils';

export function PendingListSection({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dueWindow,
  onDueWindowTodayToggle,
  onDueWindowOverdueToggle,
  dueCounts,
  hasActiveFilters,
  onClearFilters,
  filteredRows,
  columns,
  selected,
  onSelect,
  onClosePanel,
  slaPanel,
}: PendingListSectionProps) {
  return (
    <Card className="border-2" style={pendingCardBorderStyle}>
      <CardContent className="pt-6 space-y-4">
        <FilterBar
          searchPlaceholder="Buscar por ID, título, responsável..."
          searchValue={search}
          onSearchChange={onSearchChange}
          filterValue={statusFilter}
          onFilterChange={onStatusFilterChange}
          filterLabel="Status"
          options={[...STATUS_FILTER_OPTIONS]}
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide mr-1" style={{ color: '#6B5D53' }}>
            Prazo
          </span>
          <Button
            type="button"
            size="sm"
            variant={dueWindow === 'today' ? 'default' : 'outline'}
            className="h-8 text-xs"
            style={
              dueWindow === 'today'
                ? { background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff' }
                : { borderColor: 'rgba(255, 165, 0, 0.35)' }
            }
            onClick={onDueWindowTodayToggle}
          >
            Vence hoje ({dueCounts.today})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={dueWindow === 'overdue' ? 'default' : 'outline'}
            className="h-8 text-xs"
            style={
              dueWindow === 'overdue'
                ? { background: 'linear-gradient(135deg, #b91c1c, #991b1b)', color: '#fff' }
                : { borderColor: 'rgba(255, 165, 0, 0.35)' }
            }
            onClick={onDueWindowOverdueToggle}
          >
            Atrasadas ({dueCounts.overdue})
          </Button>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs ml-auto"
              onClick={onClearFilters}
            >
              Limpar filtros
            </Button>
          ) : null}
        </div>

        {filteredRows.length > 0 ? (
          <div className={`grid gap-4 ${selected ? 'xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
            <DataTable
              rows={filteredRows}
              columns={columns}
              rowKey={(row) => row.id}
              onRowClick={onSelect}
              selectedRowKey={selected?.id ?? null}
              getRowClassName={pendingRowAccent}
            />
            {selected ? (
              <PendingDetailPanel selected={selected} slaPanel={slaPanel} onClose={onClosePanel} />
            ) : null}
          </div>
        ) : (
          <PendingEmptyState hasActiveFilters={hasActiveFilters} onClearFilters={onClearFilters} />
        )}
      </CardContent>
    </Card>
  );
}
