import { FileSearch } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import { Card, CardContent, CardDescription } from '../../../../app/components/ui/card';
import { Input } from '../../../../app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { DataTable } from '../../../components/tables/DataTable';
import type { AttendanceSla, AttendanceStatus } from '../../../services/attendance.service';
import { AppointmentDetailPanel } from '../components/appointment-detail-panel';
import { AppointmentsEmptyState } from '../components/appointments-empty-state';
import {
  appointmentsCardBorderStyle,
  filterChipStyle,
  slaLabels,
  SLA_FILTER_OPTIONS,
  statusLabels,
} from '../constants/admin-appointments-page.constants';
import type { AppointmentsListSectionProps } from '../types/admin-appointments-page.types';

export function AppointmentsListSection({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  slaFilter,
  onSlaFilterChange,
  hasFilters,
  onClearFilters,
  referenceDateLabel,
  filteredRows,
  columns,
  selected,
  onSelect,
  onClosePanel,
}: AppointmentsListSectionProps) {
  return (
    <Card className="border-2" style={appointmentsCardBorderStyle}>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="relative flex-1 min-w-0">
            <FileSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5D53]" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar paciente, profissional, ID, unidade..."
              className="pl-9 border-2 bg-white"
              style={appointmentsCardBorderStyle}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[440px]">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                Status
              </p>
              <Select
                value={statusFilter}
                onValueChange={(v) => onStatusFilterChange(v as 'all' | AttendanceStatus)}
              >
                <SelectTrigger className="border-2 bg-white w-full" style={appointmentsCardBorderStyle}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {(Object.keys(statusLabels) as AttendanceStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                SLA
              </p>
              <Select value={slaFilter} onValueChange={(v) => onSlaFilterChange(v as 'all' | AttendanceSla)}>
                <SelectTrigger className="border-2 bg-white w-full" style={appointmentsCardBorderStyle}>
                  <SelectValue placeholder="SLA" />
                </SelectTrigger>
                <SelectContent>
                  {SLA_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardDescription>
            {filteredRows.length} registro(s) · KPIs do topo referem-se ao dia{' '}
            <span className="font-medium">{referenceDateLabel}</span>
          </CardDescription>
          {hasFilters ? (
            <Button type="button" variant="ghost" className="h-8 text-[#6B5D53]" onClick={onClearFilters}>
              Limpar filtros
            </Button>
          ) : null}
        </div>

        {hasFilters ? (
          <div className="flex flex-wrap gap-2">
            {search.trim() ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                style={filterChipStyle}
              >
                Busca: {search.trim()}
                <span style={{ color: '#6B5D53' }}>×</span>
              </button>
            ) : null}
            {statusFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => onStatusFilterChange('all')}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                style={filterChipStyle}
              >
                Status: {statusLabels[statusFilter]}
                <span style={{ color: '#6B5D53' }}>×</span>
              </button>
            ) : null}
            {slaFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => onSlaFilterChange('all')}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                style={filterChipStyle}
              >
                SLA: {slaLabels[slaFilter].label}
                <span style={{ color: '#6B5D53' }}>×</span>
              </button>
            ) : null}
          </div>
        ) : null}

        {filteredRows.length === 0 ? (
          <AppointmentsEmptyState />
        ) : (
          <div className={`grid gap-4 ${selected ? 'xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
            <DataTable
              rows={filteredRows}
              columns={columns}
              rowKey={(row) => row.id}
              onRowClick={onSelect}
              selectedRowKey={selected?.id ?? null}
            />

            {selected ? <AppointmentDetailPanel selected={selected} onClose={onClosePanel} /> : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
