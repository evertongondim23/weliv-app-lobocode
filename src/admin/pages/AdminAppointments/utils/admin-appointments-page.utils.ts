import type {
  AdminAttendance,
  AttendanceSla,
  AttendanceStatus,
} from '../../../services/attendance.service';

export function formatDatePt(iso: string) {
  const [y, mo, d] = iso.split('-').map(Number);
  if (!y || !mo || !d) return iso;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(y, mo - 1, d)
  );
}

export function filterAttendanceRows(
  allRows: AdminAttendance[],
  search: string,
  statusFilter: 'all' | AttendanceStatus,
  slaFilter: 'all' | AttendanceSla
) {
  const q = search.trim().toLowerCase();
  return allRows.filter((row) => {
    const hay =
      `${row.id} ${row.patientName} ${row.professionalName} ${row.specialty} ${row.unit} ${row.channel}`.toLowerCase();
    const okSearch = q.length === 0 || hay.includes(q);
    const okStatus = statusFilter === 'all' || row.status === statusFilter;
    const okSla = slaFilter === 'all' || row.sla === slaFilter;
    return okSearch && okStatus && okSla;
  });
}

export function hasAttendanceFilters(
  search: string,
  statusFilter: 'all' | AttendanceStatus,
  slaFilter: 'all' | AttendanceSla
) {
  return search.trim().length > 0 || statusFilter !== 'all' || slaFilter !== 'all';
}
