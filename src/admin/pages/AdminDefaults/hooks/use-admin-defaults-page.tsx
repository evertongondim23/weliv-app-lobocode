import { useEffect, useMemo, useState } from 'react';
import type { DataTableColumn } from '../../../components/tables/DataTable';
import {
  getDefaultRiskSummary,
  listDefaultCases,
  type AdminDefaultCase,
  type DefaultRiskLevel,
  type PlanKind,
  type RecoveryStage,
} from '../../../services/defaultRisk.service';
import { formatBRL } from '../../../utils/formatCurrency';
import { RiskBadge } from '../components/risk-badge';
import { stageLabels } from '../constants/admin-defaults-page.constants';
import {
  criticalAmountSum,
  filterDefaultCases,
  hasDefaultFilters,
  sortDefaultCases,
} from '../utils/admin-defaults-page.utils';

export function useAdminDefaultsPage() {
  const allRows = useMemo(() => listDefaultCases(), []);
  const summary = useMemo(() => getDefaultRiskSummary(allRows), [allRows]);
  const criticalVolume = useMemo(() => criticalAmountSum(allRows), [allRows]);

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | DefaultRiskLevel>('all');
  const [planFilter, setPlanFilter] = useState<'all' | PlanKind>('all');
  const [stageFilter, setStageFilter] = useState<'all' | RecoveryStage>('all');
  const [selected, setSelected] = useState<AdminDefaultCase | null>(null);

  const filtered = useMemo(
    () => filterDefaultCases(allRows, search, riskFilter, planFilter, stageFilter),
    [allRows, search, riskFilter, planFilter, stageFilter],
  );

  const sortedRows = useMemo(() => sortDefaultCases(filtered), [filtered]);

  useEffect(() => {
    if (sortedRows.length === 0) {
      setSelected(null);
      return;
    }
    setSelected((prev) => {
      if (prev && sortedRows.some((r) => r.id === prev.id)) return prev;
      return sortedRows[0];
    });
  }, [sortedRows]);

  const hasActiveFilters = hasDefaultFilters(search, riskFilter, planFilter, stageFilter);

  const clearFilters = () => {
    setSearch('');
    setRiskFilter('all');
    setPlanFilter('all');
    setStageFilter('all');
  };

  const columns: DataTableColumn<AdminDefaultCase>[] = useMemo(
    () => [
      { key: 'id', header: 'ID', render: (row) => <span className="font-semibold tabular-nums">{row.id}</span> },
      {
        key: 'ref',
        header: 'Cobrança',
        render: (row) => <span className="text-sm font-medium tabular-nums">{row.chargeRef}</span>,
      },
      { key: 'patient', header: 'Paciente', className: 'min-w-[130px]', render: (row) => row.patientName },
      {
        key: 'plan',
        header: 'Plano',
        render: (row) => (
          <div className="text-sm">
            <span className="font-medium" style={{ color: '#4A3728' }}>
              {row.planLabel}
            </span>
            <span className="block text-[11px] capitalize" style={{ color: '#6B5D53' }}>
              {row.planKind}
            </span>
          </div>
        ),
      },
      {
        key: 'amt',
        header: 'Valor vencido',
        render: (row) => (
          <span className="font-semibold tabular-nums text-red-900/90">{formatBRL(row.overdueAmount)}</span>
        ),
      },
      {
        key: 'days',
        header: 'Dias',
        render: (row) => (
          <span
            className="tabular-nums font-medium"
            style={{ color: row.daysPastDue > 30 ? '#b91c1c' : '#4A3728' }}
          >
            {row.daysPastDue} d
          </span>
        ),
      },
      { key: 'risk', header: 'Risco', render: (row) => <RiskBadge level={row.riskLevel} /> },
      {
        key: 'stage',
        header: 'Etapa',
        render: (row) => (
          <span className="text-xs" style={{ color: '#6B5D53' }}>
            {stageLabels[row.recoveryStage]}
          </span>
        ),
      },
    ],
    [],
  );

  return {
    kpis: { summary, criticalVolume },
    list: {
      search,
      onSearchChange: setSearch,
      riskFilter,
      onRiskFilterChange: setRiskFilter,
      planFilter,
      onPlanFilterChange: setPlanFilter,
      stageFilter,
      onStageFilterChange: setStageFilter,
      hasActiveFilters,
      onClearFilters: clearFilters,
      sortedRows,
      columns,
      selected,
      onSelect: setSelected,
      onClosePanel: () => setSelected(null),
    },
  };
}
