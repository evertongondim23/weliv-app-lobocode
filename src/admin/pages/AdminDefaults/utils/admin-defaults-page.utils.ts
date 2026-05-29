import type {
  AdminDefaultCase,
  DefaultRiskLevel,
  PlanKind,
  RecoveryStage,
} from '../../../services/defaultRisk.service';
import { riskSort } from '../constants/admin-defaults-page.constants';

export function criticalAmountSum(cases: AdminDefaultCase[]): number {
  return cases.filter((c) => c.riskLevel === 'critico').reduce((s, c) => s + c.overdueAmount, 0);
}

export function filterDefaultCases(
  allRows: AdminDefaultCase[],
  search: string,
  riskFilter: 'all' | DefaultRiskLevel,
  planFilter: 'all' | PlanKind,
  stageFilter: 'all' | RecoveryStage,
): AdminDefaultCase[] {
  const q = search.trim().toLowerCase();
  return allRows.filter((row) => {
    const hay =
      `${row.id} ${row.chargeRef} ${row.patientName} ${row.planLabel} ${row.unit}`.toLowerCase();
    const okSearch = q.length === 0 || hay.includes(q);
    const okRisk = riskFilter === 'all' || row.riskLevel === riskFilter;
    const okPlan = planFilter === 'all' || row.planKind === planFilter;
    const okStage = stageFilter === 'all' || row.recoveryStage === stageFilter;
    return okSearch && okRisk && okPlan && okStage;
  });
}

export function sortDefaultCases(filtered: AdminDefaultCase[]): AdminDefaultCase[] {
  return [...filtered].sort((a, b) => {
    const dr = riskSort[a.riskLevel] - riskSort[b.riskLevel];
    if (dr !== 0) return dr;
    return b.daysPastDue - a.daysPastDue;
  });
}

export function rowAccent(row: AdminDefaultCase): string | undefined {
  if (row.riskLevel === 'critico') return 'border-l-4 border-l-red-600';
  if (row.riskLevel === 'alto') return 'border-l-4 border-l-orange-600';
  if (row.riskLevel === 'moderado') return 'border-l-4 border-l-amber-500';
  return 'border-l-4 border-l-slate-400';
}

export function hasDefaultFilters(
  search: string,
  riskFilter: 'all' | DefaultRiskLevel,
  planFilter: 'all' | PlanKind,
  stageFilter: 'all' | RecoveryStage,
): boolean {
  return (
    search.trim().length > 0 ||
    riskFilter !== 'all' ||
    planFilter !== 'all' ||
    stageFilter !== 'all'
  );
}
