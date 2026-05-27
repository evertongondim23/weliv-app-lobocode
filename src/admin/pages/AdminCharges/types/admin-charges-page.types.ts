import type { DataTableColumn } from '../../../components/tables/DataTable';
import type { ChargeRow } from '../../../services/charge.service';
import type {
  AdminDefaultCase,
  DefaultRiskLevel,
  PlanKind,
  RecoveryStage,
} from '../../../services/defaultRisk.service';
import type { getChargePortfolioSummary } from '../../../services/charge.service';
import type { getDefaultRiskSummary } from '../../../services/defaultRisk.service';

export type ActiveTab = 'charges' | 'recovery';

export type ChargePortfolioSummary = ReturnType<typeof getChargePortfolioSummary>;
export type DefaultRiskSummary = ReturnType<typeof getDefaultRiskSummary>;

export type ListEmptyStateProps = {
  message: string;
  hint: string;
  onClear?: () => void;
};

export type ChargeDetailPanelProps = {
  charge: ChargeRow;
  onClose: () => void;
};

export type RecoveryDetailPanelProps = {
  case_: AdminDefaultCase;
  onClose: () => void;
};

export type ChargesKpisSectionProps = {
  tab: ActiveTab;
  statusFilter: 'all' | ChargeRow['status'];
  riskFilter: 'all' | DefaultRiskLevel;
  chargeSummary: ChargePortfolioSummary;
  riskSummary: DefaultRiskSummary;
  criticalVolume: number;
  onGoOverdue: () => void;
  onGoCritical: () => void;
};

export type ChargesTabSectionProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | ChargeRow['status'];
  onStatusFilterChange: (value: 'all' | ChargeRow['status']) => void;
  methodFilter: 'all' | ChargeRow['method'];
  onMethodFilterChange: (value: 'all' | ChargeRow['method']) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  filteredCharges: ChargeRow[];
  columns: DataTableColumn<ChargeRow>[];
  selectedCharge: ChargeRow | null;
  onSelectCharge: (row: ChargeRow) => void;
  onCloseCharge: () => void;
};

export type RecoveryTabSectionProps = {
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
  filteredCases: AdminDefaultCase[];
  columns: DataTableColumn<AdminDefaultCase>[];
  selectedCase: AdminDefaultCase | null;
  onSelectCase: (row: AdminDefaultCase) => void;
  onCloseCase: () => void;
};

export type FinanceTabsCardProps = {
  tab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  chargesCount: number;
  recoveryCount: number;
  charges: ChargesTabSectionProps;
  recovery: RecoveryTabSectionProps;
};
