import { Building2, RotateCcw } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import { Card, CardContent, CardDescription } from '../../../../app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { FilterBar } from '../../../components/filters/FilterBar';
import { DataTable } from '../../../components/tables/DataTable';
import { reportCategoryLabels } from '../../../services/financialReports.service';
import { financeBorderStyle, financeFilterChipStyle } from '../../../utils/financeUi';
import { ReportDetailPanel } from '../components/report-detail-panel';
import { ReportsEmptyState } from '../components/reports-empty-state';
import { REPORT_CATEGORY_FILTER_OPTIONS } from '../constants/admin-financial-reports-page.constants';
import type { ReportsListSectionProps } from '../types/admin-financial-reports-page.types';
import { reportRowAccent } from '../utils/admin-financial-reports-page.utils';

export function ReportsListSection({
  periodMonth,
  onPeriodMonthChange,
  periodOptions,
  unitFilter,
  onUnitFilterChange,
  units,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  hasTableFilters,
  hasContextFilters,
  onClearTableFilters,
  onClearAllFilters,
  sliceRows,
  filteredTableRows,
  sortedRows,
  columns,
  selected,
  onSelect,
  onClosePanel,
  netRevenue,
}: ReportsListSectionProps) {
  return (
    <Card className="border-2" style={financeBorderStyle}>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
              Período de competência
            </p>
            <Select value={periodMonth} onValueChange={onPeriodMonthChange}>
              <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
              Unidade
            </p>
            <Select value={unitFilter} onValueChange={(v) => onUnitFilterChange(v as 'all' | string)}>
              <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as unidades</SelectItem>
                {units.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <FilterBar
          searchPlaceholder="Buscar por ID, linha, unidade ou categoria..."
          searchValue={search}
          onSearchChange={onSearchChange}
          filterValue={categoryFilter}
          onFilterChange={(v) => onCategoryFilterChange(v as typeof categoryFilter)}
          filterLabel="Categoria"
          options={[...REPORT_CATEGORY_FILTER_OPTIONS]}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardDescription>
            {sortedRows.length} linha(s) na grade ·{' '}
            {filteredTableRows.length === sliceRows.length
              ? 'sem refinamento na tabela'
              : 'filtros de busca/categoria ativos'}
          </CardDescription>
          {hasTableFilters || hasContextFilters ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (hasTableFilters && !hasContextFilters) onClearTableFilters();
                else onClearAllFilters();
              }}
              className="h-8 px-2 text-[#6B5D53]"
            >
              <RotateCcw className="size-3.5 mr-1" />
              {hasContextFilters || !hasTableFilters
                ? 'Limpar recorte e tabela'
                : 'Limpar filtros da tabela'}
            </Button>
          ) : null}
        </div>

        {hasTableFilters ? (
          <div className="flex flex-wrap items-center gap-2">
            {search.trim().length > 0 ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                style={financeFilterChipStyle}
              >
                Busca: {search.trim()}
                <span style={{ color: '#6B5D53' }}>×</span>
              </button>
            ) : null}
            {categoryFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => onCategoryFilterChange('all')}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                style={financeFilterChipStyle}
              >
                Categoria: {reportCategoryLabels[categoryFilter]}
                <span style={{ color: '#6B5D53' }}>×</span>
              </button>
            ) : null}
          </div>
        ) : null}

        {sliceRows.length === 0 ? (
          <div
            className="rounded-xl border p-8 text-center"
            style={{ ...financeBorderStyle, background: '#FAFAFA' }}
          >
            <div
              className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3"
              style={financeBorderStyle}
            >
              <Building2 className="size-5 text-[#FFA500]" />
            </div>
            <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
              Sem lançamentos neste período
            </p>
            <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
              Escolha outro mês ou confira os dados consolidados no back-end.
            </p>
          </div>
        ) : sortedRows.length > 0 ? (
          <div className={`grid gap-4 ${selected ? 'xl:grid-cols-[1fr_340px]' : 'grid-cols-1'}`}>
            <DataTable
              rows={sortedRows}
              columns={columns}
              rowKey={(row) => row.id}
              onRowClick={onSelect}
              selectedRowKey={selected?.id ?? null}
              getRowClassName={reportRowAccent}
            />
            {selected ? (
              <ReportDetailPanel selected={selected} netRevenue={netRevenue} onClose={onClosePanel} />
            ) : null}
          </div>
        ) : (
          <ReportsEmptyState onClearTableFilters={onClearTableFilters} />
        )}
      </CardContent>
    </Card>
  );
}
