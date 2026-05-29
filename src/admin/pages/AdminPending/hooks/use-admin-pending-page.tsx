import { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../../../app/components/ui/badge';
import type { DataTableColumn } from '../../../components/tables/DataTable';
import {
  formatPendingDateTimeDisplay,
  getDueUrgency,
  getPendingSummary,
  listPendingItems,
  pendingTypeLabels,
  type PendingItem,
  type PendingStatus,
} from '../../../services/pending.service';
import { PriorityBadge } from '../components/priority-badge';
import { StatusBadge } from '../components/status-badge';
import { urgencyChipMeta } from '../constants/admin-pending-page.constants';
import { typeIcons } from '../constants/pending-type-icons';
import type { DueWindowFilter, KpiHighlight } from '../types/admin-pending-page.types';
import {
  buildSlaPanel,
  countDueWindows,
  filterAndSortPendingItems,
  hasPendingFilters,
} from '../utils/admin-pending-page.utils';

export function useAdminPendingPage() {
  const allRows = useMemo(() => listPendingItems(), []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PendingStatus>('all');
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const [dueWindow, setDueWindow] = useState<DueWindowFilter>('all');
  const [kpiHighlight, setKpiHighlight] = useState<KpiHighlight>(null);
  const [selected, setSelected] = useState<PendingItem | null>(allRows[0] ?? null);

  const summaryGlobal = useMemo(() => getPendingSummary(allRows), [allRows]);
  const dueCounts = useMemo(() => countDueWindows(allRows), [allRows]);

  const filteredRows = useMemo(
    () => filterAndSortPendingItems(allRows, search, statusFilter, highPriorityOnly, dueWindow),
    [allRows, search, statusFilter, highPriorityOnly, dueWindow],
  );

  useEffect(() => {
    if (!selected) return;
    if (filteredRows.some((r) => r.id === selected.id)) return;
    setSelected(filteredRows[0] ?? null);
  }, [filteredRows, selected]);

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setHighPriorityOnly(false);
    setDueWindow('all');
    setKpiHighlight(null);
  }

  function onStatusFilterChange(value: string) {
    setStatusFilter(value as 'all' | PendingStatus);
    setHighPriorityOnly(false);
    setKpiHighlight(null);
  }

  function selectKpi(kpi: 'critical' | 'inProgress' | 'approval' | 'blocked') {
    setDueWindow('all');
    setKpiHighlight(kpi);
    setHighPriorityOnly(kpi === 'critical');
    if (kpi === 'critical') {
      setStatusFilter('all');
      return;
    }
    setHighPriorityOnly(false);
    if (kpi === 'inProgress') setStatusFilter('in-progress');
    if (kpi === 'approval') setStatusFilter('approval');
    if (kpi === 'blocked') setStatusFilter('blocked');
  }

  const columns: DataTableColumn<PendingItem>[] = useMemo(
    () => [
      { key: 'id', header: 'ID', render: (row) => <span className="font-semibold">{row.id}</span> },
      { key: 'title', header: 'Pendência', render: (row) => row.title },
      {
        key: 'type',
        header: 'Tipo',
        render: (row) => (
          <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: '#4A3728' }}>
            <span className="text-[#6B5D53]" aria-hidden>
              {typeIcons[row.type]}
            </span>
            {pendingTypeLabels[row.type]}
          </span>
        ),
      },
      { key: 'owner', header: 'Responsável', render: (row) => row.owner },
      {
        key: 'dueAt',
        header: 'Prazo',
        render: (row) => {
          const urg = getDueUrgency(row.dueAt, new Date());
          const chip = urgencyChipMeta[urg];
          return (
            <div className="flex flex-col gap-1 items-start">
              <span className="text-sm tabular-nums">{formatPendingDateTimeDisplay(row.dueAt)}</span>
              {chip ? (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0"
                  style={{ color: chip.color, borderColor: chip.color, background: chip.bg }}
                >
                  {chip.label}
                </Badge>
              ) : null}
            </div>
          );
        },
      },
      { key: 'priority', header: 'Prioridade', render: (row) => <PriorityBadge priority={row.priority} /> },
      { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    ],
    [],
  );

  const hasActiveFilters = hasPendingFilters(search, statusFilter, highPriorityOnly, dueWindow);
  const slaPanel = selected ? buildSlaPanel(selected) : null;

  return {
    summary: {
      summaryGlobal,
      kpiHighlight,
      onSelectKpi: selectKpi,
    },
    list: {
      search,
      onSearchChange: (v: string) => {
        setSearch(v);
        setKpiHighlight(null);
      },
      statusFilter,
      onStatusFilterChange,
      dueWindow,
      onDueWindowTodayToggle: () => {
        setDueWindow((d) => (d === 'today' ? 'all' : 'today'));
        setKpiHighlight(null);
        setHighPriorityOnly(false);
      },
      onDueWindowOverdueToggle: () => {
        setDueWindow((d) => (d === 'overdue' ? 'all' : 'overdue'));
        setKpiHighlight(null);
        setHighPriorityOnly(false);
      },
      dueCounts,
      hasActiveFilters,
      onClearFilters: clearFilters,
      filteredRows,
      columns,
      selected,
      onSelect: setSelected,
      onClosePanel: () => setSelected(null),
      slaPanel,
    },
  };
}
