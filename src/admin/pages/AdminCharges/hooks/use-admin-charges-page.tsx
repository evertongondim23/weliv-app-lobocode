import { useEffect, useMemo, useState } from 'react';
import type { DataTableColumn } from '../../../components/tables/DataTable';
import { PaymentMethodCell } from '../../../components/finance/PaymentMethodCell';
import { getChargePortfolioSummary, listCharges, type ChargeRow } from '../../../services/charge.service';
import {
  getDefaultRiskSummary,
  listDefaultCases,
  type AdminDefaultCase,
  type DefaultRiskLevel,
  type PlanKind,
  type RecoveryStage,
} from '../../../services/defaultRisk.service';
import { formatBRL } from '../../../utils/formatCurrency';
import { ChargeStatusBadge } from '../components/charge-status-badge';
import { RiskBadge } from '../components/risk-badge';
import { stageLabels } from '../constants/admin-charges-page.constants';
import type { ActiveTab } from '../types/admin-charges-page.types';
import {
  filterCharges,
  filterRecoveryCases,
  hasChargeFilters,
  hasRecoveryFilters,
} from '../utils/admin-charges-page.utils';

export function useAdminChargesPage() {
  const [tab, setTab] = useState<ActiveTab>('charges');

  const allCharges = useMemo(() => listCharges(), []);
  const chargeSummary = useMemo(() => getChargePortfolioSummary(allCharges), [allCharges]);

  const [chargeSearch, setChargeSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ChargeRow['status']>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | ChargeRow['method']>('all');
  const [selectedCharge, setSelectedCharge] = useState<ChargeRow | null>(null);

  const filteredCharges = useMemo(
    () => filterCharges(allCharges, chargeSearch, statusFilter, methodFilter),
    [allCharges, chargeSearch, statusFilter, methodFilter],
  );

  useEffect(() => {
    setSelectedCharge((prev) => {
      if (!prev || !filteredCharges.some((r) => r.id === prev.id)) return filteredCharges[0] ?? null;
      return prev;
    });
  }, [filteredCharges]);

  const allCases = useMemo(() => listDefaultCases(), []);
  const riskSummary = useMemo(() => getDefaultRiskSummary(allCases), [allCases]);
  const criticalVolume = useMemo(
    () => allCases.filter((c) => c.riskLevel === 'critico').reduce((s, c) => s + c.overdueAmount, 0),
    [allCases],
  );

  const [recoverySearch, setRecoverySearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | DefaultRiskLevel>('all');
  const [planFilter, setPlanFilter] = useState<'all' | PlanKind>('all');
  const [stageFilter, setStageFilter] = useState<'all' | RecoveryStage>('all');
  const [selectedCase, setSelectedCase] = useState<AdminDefaultCase | null>(null);

  const filteredCases = useMemo(
    () => filterRecoveryCases(allCases, recoverySearch, riskFilter, planFilter, stageFilter),
    [allCases, recoverySearch, riskFilter, planFilter, stageFilter],
  );

  useEffect(() => {
    setSelectedCase((prev) => {
      if (!prev || !filteredCases.some((r) => r.id === prev.id)) return filteredCases[0] ?? null;
      return prev;
    });
  }, [filteredCases]);

  const chargeColumns: DataTableColumn<ChargeRow>[] = useMemo(
    () => [
      { key: 'id', header: 'ID', render: (row) => <span className="font-semibold tabular-nums">{row.id}</span> },
      { key: 'patient', header: 'Paciente', className: 'min-w-[140px]', render: (row) => row.patient },
      {
        key: 'amount',
        header: 'Valor',
        render: (row) => <span className="font-semibold tabular-nums">{row.amount}</span>,
      },
      {
        key: 'due',
        header: 'Vencimento',
        render: (row) => <span className="tabular-nums text-sm">{row.dueDate}</span>,
      },
      { key: 'method', header: 'Meio', render: (row) => <PaymentMethodCell method={row.method} /> },
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
      { key: 'status', header: 'Status', render: (row) => <ChargeStatusBadge status={row.status} /> },
    ],
    [],
  );

  const recoveryColumns: DataTableColumn<AdminDefaultCase>[] = useMemo(
    () => [
      { key: 'id', header: 'ID', render: (row) => <span className="font-semibold tabular-nums">{row.id}</span> },
      {
        key: 'patient',
        header: 'Paciente',
        className: 'min-w-[130px]',
        render: (row) => row.patientName,
      },
      {
        key: 'plan',
        header: 'Plano',
        render: (row) => (
          <span className="text-sm">
            <span className="font-medium" style={{ color: '#4A3728' }}>
              {row.planLabel}
            </span>
            <span className="block text-[11px] capitalize" style={{ color: '#6B5D53' }}>
              {row.planKind}
            </span>
          </span>
        ),
      },
      {
        key: 'amt',
        header: 'Vencido',
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
            {row.daysPastDue}d
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

  const chargeFiltersActive = hasChargeFilters(chargeSearch, statusFilter, methodFilter);
  const recoveryFiltersActive = hasRecoveryFilters(recoverySearch, riskFilter, planFilter, stageFilter);

  const clearChargeFilters = () => {
    setChargeSearch('');
    setStatusFilter('all');
    setMethodFilter('all');
  };

  const clearRecoveryFilters = () => {
    setRecoverySearch('');
    setRiskFilter('all');
    setPlanFilter('all');
    setStageFilter('all');
  };

  return {
    tab,
    setTab,
    allChargesCount: allCharges.length,
    kpis: {
      tab,
      statusFilter,
      riskFilter,
      chargeSummary,
      riskSummary,
      criticalVolume,
      onGoOverdue: () => {
        setTab('charges');
        setStatusFilter('atrasado');
      },
      onGoCritical: () => {
        setTab('recovery');
        setRiskFilter('critico');
      },
    },
    chargesTab: {
      search: chargeSearch,
      onSearchChange: setChargeSearch,
      statusFilter,
      onStatusFilterChange: setStatusFilter,
      methodFilter,
      onMethodFilterChange: setMethodFilter,
      hasActiveFilters: chargeFiltersActive,
      onClearFilters: clearChargeFilters,
      filteredCharges,
      columns: chargeColumns,
      selectedCharge,
      onSelectCharge: setSelectedCharge,
      onCloseCharge: () => setSelectedCharge(null),
    },
    recoveryTab: {
      search: recoverySearch,
      onSearchChange: setRecoverySearch,
      riskFilter,
      onRiskFilterChange: setRiskFilter,
      planFilter,
      onPlanFilterChange: setPlanFilter,
      stageFilter,
      onStageFilterChange: setStageFilter,
      hasActiveFilters: recoveryFiltersActive,
      onClearFilters: clearRecoveryFilters,
      filteredCases,
      columns: recoveryColumns,
      selectedCase,
      onSelectCase: setSelectedCase,
      onCloseCase: () => setSelectedCase(null),
    },
    financeTabs: {
      recoveryCount: riskSummary.caseCount,
    },
  };
}
