import type { AttendanceSla, AttendanceStatus } from '../../../services/attendance.service';

export const appointmentsCardBorderStyle = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const appointmentsPrimaryActionStyle = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
} as const;

export const filterChipStyle = {
  borderColor: 'rgba(255, 165, 0, 0.25)',
  color: '#4A3728',
  background: '#FFF8E7',
} as const;

export const statusLabels: Record<AttendanceStatus, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  checked_in: 'Check-in',
  in_progress: 'Em atendimento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'No-show',
};

export const statusTone: Record<AttendanceStatus, { c: string; b: string }> = {
  scheduled: { c: '#6B5D53', b: 'rgba(107, 93, 83, 0.12)' },
  confirmed: { c: '#1d4ed8', b: 'rgba(29, 78, 216, 0.1)' },
  checked_in: { c: '#7c3aed', b: 'rgba(124, 58, 237, 0.12)' },
  in_progress: { c: '#c2410c', b: 'rgba(194, 65, 12, 0.12)' },
  completed: { c: '#047857', b: 'rgba(4, 120, 87, 0.1)' },
  cancelled: { c: '#64748b', b: 'rgba(100, 116, 139, 0.15)' },
  no_show: { c: '#b91c1c', b: 'rgba(185, 28, 28, 0.1)' },
};

export const slaLabels: Record<AttendanceSla, { label: string; color: string; bg: string }> = {
  on_time: { label: 'No prazo', color: '#047857', bg: 'rgba(4, 120, 87, 0.1)' },
  at_risk: { label: 'Risco SLA', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' },
  breached: { label: 'SLA estourado', color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)' },
};

export const SLA_FILTER_OPTIONS = [
  { label: 'Todos', value: 'all' },
  { label: slaLabels.on_time.label, value: 'on_time' },
  { label: slaLabels.at_risk.label, value: 'at_risk' },
  { label: slaLabels.breached.label, value: 'breached' },
] as const;
