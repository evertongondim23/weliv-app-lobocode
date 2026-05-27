import { reportCategoryLabels } from '../../../services/financialReports.service';
import type { FinancialReportRow, ReportCategory } from '../../../services/financialReports.service';

export function formatPct(value: number | null, digits = 1): string {
  if (value === null || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

export function sliceRowsByContext(
  allRows: FinancialReportRow[],
  periodMonth: string,
  unitFilter: 'all' | string,
): FinancialReportRow[] {
  return allRows.filter((r) => {
    if (r.periodMonth !== periodMonth) return false;
    if (unitFilter !== 'all' && r.unit !== unitFilter) return false;
    return true;
  });
}

export function filterTableRows(
  sliceRows: FinancialReportRow[],
  search: string,
  categoryFilter: 'all' | ReportCategory,
): FinancialReportRow[] {
  const q = search.trim().toLowerCase();
  return sliceRows.filter((row) => {
    const hay = `${row.id} ${row.label} ${row.unit} ${reportCategoryLabels[row.category]}`.toLowerCase();
    const okSearch = q.length === 0 || hay.includes(q);
    const okCat = categoryFilter === 'all' || row.category === categoryFilter;
    return okSearch && okCat;
  });
}

export function sortReportRows(filtered: FinancialReportRow[]): FinancialReportRow[] {
  return [...filtered].sort((a, b) => {
    if (b.amount !== a.amount) return b.amount - a.amount;
    return a.label.localeCompare(b.label);
  });
}

export function hasTableFilters(search: string, categoryFilter: 'all' | ReportCategory): boolean {
  return search.trim().length > 0 || categoryFilter !== 'all';
}

export function hasContextFilters(unitFilter: 'all' | string): boolean {
  return unitFilter !== 'all';
}

export function reportRowAccent(row: FinancialReportRow): string | undefined {
  if (row.category === 'estornos') return 'border-l-4 border-l-red-500';
  return undefined;
}
