import type { DataTableColumn } from '../../../components/tables/DataTable';
import type { PendingItem, PendingStatus } from '../../../services/pending.service';
import type { getPendingSummary } from '../../../services/pending.service';

export type KpiHighlight = 'critical' | 'inProgress' | 'approval' | 'blocked' | null;

export type DueWindowFilter = 'all' | 'today' | 'overdue';

export type PendingSummary = ReturnType<typeof getPendingSummary>;

export type SlaPanelContent = {
  title: string;
  body: string;
  accent: string;
};

export type PendingEmptyStateProps = {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export type PendingDetailPanelProps = {
  selected: PendingItem;
  slaPanel: SlaPanelContent | null;
  onClose: () => void;
};

export type PendingSummarySectionProps = {
  summaryGlobal: PendingSummary;
  kpiHighlight: KpiHighlight;
  onSelectKpi: (kpi: 'critical' | 'inProgress' | 'approval' | 'blocked') => void;
};

export type PendingListSectionProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | PendingStatus;
  onStatusFilterChange: (value: string) => void;
  dueWindow: DueWindowFilter;
  onDueWindowTodayToggle: () => void;
  onDueWindowOverdueToggle: () => void;
  dueCounts: { today: number; overdue: number };
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  filteredRows: PendingItem[];
  columns: DataTableColumn<PendingItem>[];
  selected: PendingItem | null;
  onSelect: (row: PendingItem) => void;
  onClosePanel: () => void;
  slaPanel: SlaPanelContent | null;
};
