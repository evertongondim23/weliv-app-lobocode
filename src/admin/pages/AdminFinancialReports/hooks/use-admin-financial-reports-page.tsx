import { useEffect, useMemo, useState } from 'react';
import type { DataTableColumn } from '../../../components/tables/DataTable';
import { formatBRL } from '../../../utils/formatCurrency';
import {
  computeReportKpis,
  distinctReportUnits,
  listFinancialReportRows,
  pctOfTotal,
  reportPeriodOptions,
  type FinancialReportRow,
  type ReportCategory,
} from '../../../services/financialReports.service';
import { CategoryBadge } from '../components/category-badge';
import { VarianceCell } from '../components/variance-cell';
import {
  filterTableRows,
  hasContextFilters,
  hasTableFilters,
  sliceRowsByContext,
  sortReportRows,
} from '../utils/admin-financial-reports-page.utils';

export function useAdminFinancialReportsPage() {
  const allRows = useMemo(() => listFinancialReportRows(), []);
  const units = useMemo(() => distinctReportUnits(allRows), [allRows]);

  const [periodMonth, setPeriodMonth] = useState(reportPeriodOptions[0]?.value ?? '2026-03');
  const [unitFilter, setUnitFilter] = useState<'all' | string>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ReportCategory>('all');
  const [selected, setSelected] = useState<FinancialReportRow | null>(null);

  const periodLabel =
    reportPeriodOptions.find((p) => p.value === periodMonth)?.label ?? periodMonth;

  const sliceRows = useMemo(
    () => sliceRowsByContext(allRows, periodMonth, unitFilter),
    [allRows, periodMonth, unitFilter],
  );

  const kpis = useMemo(() => computeReportKpis(sliceRows), [sliceRows]);

  const filteredTableRows = useMemo(
    () => filterTableRows(sliceRows, search, categoryFilter),
    [sliceRows, search, categoryFilter],
  );

  const sortedRows = useMemo(() => sortReportRows(filteredTableRows), [filteredTableRows]);

  useEffect(() => {
    if (!selected) return;
    if (sortedRows.some((r) => r.id === selected.id)) return;
    setSelected(sortedRows[0] ?? null);
  }, [sortedRows, selected]);

  const tableFiltersActive = hasTableFilters(search, categoryFilter);
  const contextFiltersActive = hasContextFilters(unitFilter);

  const clearTableFilters = () => {
    setSearch('');
    setCategoryFilter('all');
  };

  const clearAllFilters = () => {
    clearTableFilters();
    setUnitFilter('all');
  };

  const columns: DataTableColumn<FinancialReportRow>[] = useMemo(
    () => [
      {
        key: 'id',
        header: 'ID',
        render: (row) => <span className="font-semibold tabular-nums">{row.id}</span>,
      },
      {
        key: 'label',
        header: 'Linha / dimensão',
        className: 'min-w-[160px]',
        render: (row) => (
          <span className="text-sm font-medium" style={{ color: '#4A3728' }}>
            {row.label}
          </span>
        ),
      },
      {
        key: 'unit',
        header: 'Unidade',
        className: 'max-w-[140px]',
        render: (row) => (
          <span className="truncate block text-sm" title={row.unit}>
            {row.unit}
          </span>
        ),
      },
      { key: 'category', header: 'Categoria', render: (row) => <CategoryBadge category={row.category} /> },
      {
        key: 'amount',
        header: 'Valor ( período )',
        render: (row) => (
          <span
            className={`tabular-nums font-semibold ${row.amount < 0 ? 'text-red-700' : ''}`}
            style={row.amount >= 0 ? { color: '#4A3728' } : undefined}
          >
            {formatBRL(row.amount)}
          </span>
        ),
      },
      {
        key: 'share',
        header: '% do total',
        render: (row) => (
          <span className="text-sm tabular-nums text-[#6B5D53]">
            {kpis.netRevenue === 0 ? '—' : `${pctOfTotal(row.amount, kpis.netRevenue).toFixed(1)}%`}
          </span>
        ),
      },
      {
        key: 'var',
        header: 'vs mês ant.',
        render: (row) => <VarianceCell current={row.amount} previous={row.prevAmount} />,
      },
    ],
    [kpis.netRevenue],
  );

  return {
    contextBar: {
      periodLabel,
      unitFilter,
    },
    summary: {
      kpis,
      sliceCount: sliceRows.length,
    },
    list: {
      periodMonth,
      onPeriodMonthChange: setPeriodMonth,
      periodOptions: reportPeriodOptions,
      unitFilter,
      onUnitFilterChange: setUnitFilter,
      units,
      search,
      onSearchChange: setSearch,
      categoryFilter,
      onCategoryFilterChange: setCategoryFilter,
      hasTableFilters: tableFiltersActive,
      hasContextFilters: contextFiltersActive,
      onClearTableFilters: clearTableFilters,
      onClearAllFilters: clearAllFilters,
      sliceRows,
      filteredTableRows,
      sortedRows,
      columns,
      selected,
      onSelect: setSelected,
      onClosePanel: () => setSelected(null),
      netRevenue: kpis.netRevenue,
    },
  };
}
