import type { DataTableColumn } from '../../../components/tables/DataTable';
import type {
  FinancialReportKpis,
  FinancialReportRow,
  ReportCategory,
} from '../../../services/financialReports.service';

export type ReportsContextBarProps = {
  periodLabel: string;
  unitFilter: 'all' | string;
};

export type ReportsSummarySectionProps = {
  kpis: FinancialReportKpis;
  sliceCount: number;
};

export type ReportsEmptyStateProps = {
  onClearTableFilters: () => void;
};

export type ReportDetailPanelProps = {
  selected: FinancialReportRow;
  netRevenue: number;
  onClose: () => void;
};

export type ReportsListSectionProps = {
  periodMonth: string;
  onPeriodMonthChange: (value: string) => void;
  periodOptions: { value: string; label: string }[];
  unitFilter: 'all' | string;
  onUnitFilterChange: (value: 'all' | string) => void;
  units: string[];
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: 'all' | ReportCategory;
  onCategoryFilterChange: (value: 'all' | ReportCategory) => void;
  hasTableFilters: boolean;
  hasContextFilters: boolean;
  onClearTableFilters: () => void;
  onClearAllFilters: () => void;
  sliceRows: FinancialReportRow[];
  filteredTableRows: FinancialReportRow[];
  sortedRows: FinancialReportRow[];
  columns: DataTableColumn<FinancialReportRow>[];
  selected: FinancialReportRow | null;
  onSelect: (row: FinancialReportRow) => void;
  onClosePanel: () => void;
  netRevenue: number;
};
