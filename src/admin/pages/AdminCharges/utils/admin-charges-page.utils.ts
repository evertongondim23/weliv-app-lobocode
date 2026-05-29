import type { ChargeRow } from '../../../services/charge.service';
import type {
  AdminDefaultCase,
  DefaultRiskLevel,
  PlanKind,
  RecoveryStage,
} from '../../../services/defaultRisk.service';
import { riskSort } from '../constants/admin-charges-page.constants';

export function filterCharges(
  allCharges: ChargeRow[],
  search: string,
  statusFilter: 'all' | ChargeRow['status'],
  methodFilter: 'all' | ChargeRow['method'],
): ChargeRow[] {
  const q = search.trim().toLowerCase();
  const rank: Record<ChargeRow['status'], number> = { atrasado: 0, pendente: 1, pago: 2 };
  return allCharges
    .filter((row) => {
      const hay =
        `${row.id} ${row.patient} ${row.amount} ${row.unit} ${row.appointmentRef ?? ''} ${row.email ?? ''}`.toLowerCase();
      return (
        (q.length === 0 || hay.includes(q)) &&
        (statusFilter === 'all' || row.status === statusFilter) &&
        (methodFilter === 'all' || row.method === methodFilter)
      );
    })
    .sort((a, b) => rank[a.status] - rank[b.status] || a.dueDateIso.localeCompare(b.dueDateIso));
}

export function filterRecoveryCases(
  allCases: AdminDefaultCase[],
  search: string,
  riskFilter: 'all' | DefaultRiskLevel,
  planFilter: 'all' | PlanKind,
  stageFilter: 'all' | RecoveryStage,
): AdminDefaultCase[] {
  const q = search.trim().toLowerCase();
  return allCases
    .filter((row) => {
      const hay =
        `${row.id} ${row.chargeRef} ${row.patientName} ${row.planLabel} ${row.unit}`.toLowerCase();
      return (
        (q.length === 0 || hay.includes(q)) &&
        (riskFilter === 'all' || row.riskLevel === riskFilter) &&
        (planFilter === 'all' || row.planKind === planFilter) &&
        (stageFilter === 'all' || row.recoveryStage === stageFilter)
      );
    })
    .sort(
      (a, b) =>
        riskSort[a.riskLevel] - riskSort[b.riskLevel] || b.daysPastDue - a.daysPastDue,
    );
}

export function chargeRowAccent(row: ChargeRow): string | undefined {
  if (row.status === 'atrasado') return 'border-l-4 border-l-red-500';
  if (row.status === 'pendente') return 'border-l-4 border-l-amber-500';
  return undefined;
}

export function recoveryRowAccent(row: AdminDefaultCase): string | undefined {
  if (row.riskLevel === 'critico') return 'border-l-4 border-l-red-600';
  if (row.riskLevel === 'alto') return 'border-l-4 border-l-orange-600';
  if (row.riskLevel === 'moderado') return 'border-l-4 border-l-amber-500';
  return 'border-l-4 border-l-slate-400';
}

export function hasChargeFilters(
  search: string,
  statusFilter: 'all' | ChargeRow['status'],
  methodFilter: 'all' | ChargeRow['method'],
): boolean {
  return search.trim().length > 0 || statusFilter !== 'all' || methodFilter !== 'all';
}

export function hasRecoveryFilters(
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
