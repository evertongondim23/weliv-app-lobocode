import type { DataTableColumn } from '../../../components/tables/DataTable';
import type { AdminDefaultCase, DefaultRiskLevel, PlanKind, RecoveryStage } from '../../../services/defaultRisk.service';
import type { getDefaultRiskSummary } from '../../../services/defaultRisk.service';

export type DefaultRiskSummary = ReturnType<typeof getDefaultRiskSummary>;

export type ListEmptyStateProps = {
  message: string;
  hint: string;
};

export type DefaultDetailPanelProps = {
  selected: AdminDefaultCase;
  onClose: () => void;
};

export type DefaultsKpisSectionProps = {
  summary: DefaultRiskSummary;
  criticalVolume: number;
};

export type DefaultsListSectionProps = {
  search: string;
  onSearchChange: (value: string) => void;
  riskFilter: 'all' | DefaultRiskLevel;
  onRiskFilterChange: (value: 'all' | DefaultRiskLevel) => void;
  planFilter: 'all' | PlanKind;
  onPlanFilterChange: (value: 'all' | PlanKind) => void;
  stageFilter: 'all' | RecoveryStage;
  onStageFilterChange: (value: 'all' | RecoveryStage) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  sortedRows: AdminDefaultCase[];
  columns: DataTableColumn<AdminDefaultCase>[];
  selected: AdminDefaultCase | null;
  onSelect: (row: AdminDefaultCase) => void;
  onClosePanel: () => void;
};
