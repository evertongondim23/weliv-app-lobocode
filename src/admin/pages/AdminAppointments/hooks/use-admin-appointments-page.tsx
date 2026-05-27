import { useEffect, useMemo, useState } from 'react';
import type { DataTableColumn } from '../../../components/tables/DataTable';
import {
  ATTENDANCE_REFERENCE_DATE,
  getAttendanceDaySummary,
  listAdminAttendances,
  type AdminAttendance,
  type AttendanceSla,
  type AttendanceStatus,
} from '../../../services/attendance.service';
import { SlaBadge } from '../components/sla-badge';
import { StatusBadge } from '../components/status-badge';
import {
  filterAttendanceRows,
  formatDatePt,
  hasAttendanceFilters,
} from '../utils/admin-appointments-page.utils';

export function useAdminAppointmentsPage() {
  const allRows = useMemo(() => listAdminAttendances(), []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus>('all');
  const [slaFilter, setSlaFilter] = useState<'all' | AttendanceSla>('all');
  const [selected, setSelected] = useState<AdminAttendance | null>(null);

  const daySummary = useMemo(
    () => getAttendanceDaySummary(allRows, ATTENDANCE_REFERENCE_DATE),
    [allRows]
  );

  const referenceDateLabel = useMemo(() => formatDatePt(ATTENDANCE_REFERENCE_DATE), []);

  const filteredRows = useMemo(
    () => filterAttendanceRows(allRows, search, statusFilter, slaFilter),
    [allRows, search, statusFilter, slaFilter]
  );

  useEffect(() => {
    if (filteredRows.length === 0) {
      setSelected(null);
      return;
    }
    setSelected((prev) => {
      if (prev && filteredRows.some((r) => r.id === prev.id)) return prev;
      return filteredRows[0];
    });
  }, [filteredRows]);

  const hasFilters = hasAttendanceFilters(search, statusFilter, slaFilter);

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setSlaFilter('all');
  }

  const columns: DataTableColumn<AdminAttendance>[] = useMemo(
    () => [
      {
        key: 'id',
        header: 'ID',
        render: (row) => <span className="font-semibold tabular-nums">{row.id}</span>,
      },
      {
        key: 'patient',
        header: 'Paciente',
        className: 'min-w-[140px]',
        render: (row) => row.patientName,
      },
      {
        key: 'prof',
        header: 'Profissional',
        className: 'min-w-[140px]',
        render: (row) => row.professionalName,
      },
      {
        key: 'when',
        header: 'Data / hora',
        render: (row) => (
          <span className="text-sm tabular-nums">
            {formatDatePt(row.date)} · {row.time}
          </span>
        ),
      },
      {
        key: 'channel',
        header: 'Modalidade',
        render: (row) => (
          <span className="capitalize text-sm" style={{ color: '#6B5D53' }}>
            {row.channel}
          </span>
        ),
      },
      { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
      { key: 'sla', header: 'SLA', render: (row) => <SlaBadge sla={row.sla} /> },
    ],
    []
  );

  return {
    summary: { daySummary, referenceDateLabel },
    list: {
      search,
      onSearchChange: setSearch,
      statusFilter,
      onStatusFilterChange: setStatusFilter,
      slaFilter,
      onSlaFilterChange: setSlaFilter,
      hasFilters,
      onClearFilters: clearFilters,
      referenceDateLabel,
      filteredRows,
      columns,
      selected,
      onSelect: setSelected,
      onClosePanel: () => setSelected(null),
    },
  };
}
