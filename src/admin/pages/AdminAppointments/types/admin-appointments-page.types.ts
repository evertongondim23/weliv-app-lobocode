import type { DataTableColumn } from '../../../components/tables/DataTable';
import type {
  AdminAttendance,
  AttendanceDaySummary,
  AttendanceSla,
  AttendanceStatus,
} from '../../../services/attendance.service';

export type AppointmentsSummarySectionProps = {
  daySummary: AttendanceDaySummary;
  referenceDateLabel: string;
};

export type AppointmentsEmptyStateProps = Record<string, never>;

export type AppointmentDetailPanelProps = {
  selected: AdminAttendance;
  onClose: () => void;
};

export type AppointmentsListSectionProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | AttendanceStatus;
  onStatusFilterChange: (value: 'all' | AttendanceStatus) => void;
  slaFilter: 'all' | AttendanceSla;
  onSlaFilterChange: (value: 'all' | AttendanceSla) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
  referenceDateLabel: string;
  filteredRows: AdminAttendance[];
  columns: DataTableColumn<AdminAttendance>[];
  selected: AdminAttendance | null;
  onSelect: (row: AdminAttendance) => void;
  onClosePanel: () => void;
};
