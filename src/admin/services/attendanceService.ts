/**
 * Módulo Atendimentos — dados demo para listagem administrativa.
 * Em produção: substituir por API real e timezone da unidade.
 */

export type AttendanceStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AttendanceSla = 'on_time' | 'at_risk' | 'breached';

export type AdminAttendance = {
  id: string;
  patientName: string;
  professionalName: string;
  specialty: string;
  date: string;
  time: string;
  channel: 'presencial' | 'online';
  status: AttendanceStatus;
  sla: AttendanceSla;
  /** Minutos até o fim da janela de SLA; negativo = atraso. */
  slaMinutesRemaining: number;
  unit: string;
  depositPaid: boolean;
  notes?: string;
};

/** Dia de referência fixo na demo (alinha KPIs “do dia”). */
export const ATTENDANCE_REFERENCE_DATE = '2026-03-24';

const mockAttendances: AdminAttendance[] = [
  {
    id: 'ATD-2401',
    patientName: 'João Santos',
    professionalName: 'Dra. Ana Silva',
    specialty: 'Cardiologia',
    date: '2026-03-24',
    time: '08:30',
    channel: 'presencial',
    status: 'completed',
    sla: 'on_time',
    slaMinutesRemaining: 12,
    unit: 'Unidade Paulista',
    depositPaid: true,
    notes: 'Retorno pós-exame; evolução estável.',
  },
  {
    id: 'ATD-2402',
    patientName: 'Maria Silva',
    professionalName: 'Dra. Ana Silva',
    specialty: 'Cardiologia',
    date: '2026-03-24',
    time: '09:00',
    channel: 'presencial',
    status: 'in_progress',
    sla: 'at_risk',
    slaMinutesRemaining: -4,
    unit: 'Unidade Paulista',
    depositPaid: true,
  },
  {
    id: 'ATD-2403',
    patientName: 'Carlos Eduardo Lima',
    professionalName: 'Dr. Carlos Mendes',
    specialty: 'Ortopedia',
    date: '2026-03-24',
    time: '09:30',
    channel: 'online',
    status: 'checked_in',
    sla: 'on_time',
    slaMinutesRemaining: 18,
    unit: 'Unidade Augusta',
    depositPaid: false,
    notes: 'Aguardando assinatura digital do termo.',
  },
  {
    id: 'ATD-2404',
    patientName: 'Fernanda Oliveira',
    professionalName: 'Dr. Carlos Mendes',
    specialty: 'Ortopedia',
    date: '2026-03-24',
    time: '10:00',
    channel: 'presencial',
    status: 'confirmed',
    sla: 'on_time',
    slaMinutesRemaining: 45,
    unit: 'Unidade Augusta',
    depositPaid: true,
  },
  {
    id: 'ATD-2405',
    patientName: 'Paula Ribeiro',
    professionalName: 'Dra. Beatriz Costa',
    specialty: 'Dermatologia',
    date: '2026-03-24',
    time: '10:30',
    channel: 'presencial',
    status: 'scheduled',
    sla: 'breached',
    slaMinutesRemaining: -22,
    unit: 'Unidade Faria Lima',
    depositPaid: false,
    notes: 'Paciente ainda não fez check-in — possível atraso de transporte.',
  },
  {
    id: 'ATD-2406',
    patientName: 'Ricardo Alves',
    professionalName: 'Dra. Beatriz Costa',
    specialty: 'Dermatologia',
    date: '2026-03-24',
    time: '11:00',
    channel: 'online',
    status: 'no_show',
    sla: 'breached',
    slaMinutesRemaining: -35,
    unit: 'Unidade Faria Lima',
    depositPaid: false,
  },
  {
    id: 'ATD-2407',
    patientName: 'Helena Prado',
    professionalName: 'Dra. Ana Silva',
    specialty: 'Cardiologia',
    date: '2026-03-24',
    time: '14:00',
    channel: 'presencial',
    status: 'cancelled',
    sla: 'on_time',
    slaMinutesRemaining: 0,
    unit: 'Unidade Paulista',
    depositPaid: true,
    notes: 'Cancelado por solicitação da paciente (48h).',
  },
  {
    id: 'ATD-2308',
    patientName: 'Marcos Vieira',
    professionalName: 'Dr. Carlos Mendes',
    specialty: 'Ortopedia',
    date: '2026-03-23',
    time: '16:00',
    channel: 'presencial',
    status: 'completed',
    sla: 'on_time',
    slaMinutesRemaining: 8,
    unit: 'Unidade Augusta',
    depositPaid: true,
  },
  {
    id: 'ATD-2309',
    patientName: 'Juliana Costa',
    professionalName: 'Dra. Beatriz Costa',
    specialty: 'Dermatologia',
    date: '2026-03-23',
    time: '11:30',
    channel: 'presencial',
    status: 'completed',
    sla: 'at_risk',
    slaMinutesRemaining: -2,
    unit: 'Unidade Faria Lima',
    depositPaid: true,
  },
];

export function listAdminAttendances(): AdminAttendance[] {
  return [...mockAttendances].sort((a, b) => {
    const dc = b.date.localeCompare(a.date);
    if (dc !== 0) return dc;
    return b.time.localeCompare(a.time);
  });
}

export type AttendanceDaySummary = {
  /** Atendimentos com data = referência. */
  todayTotal: number;
  /** Em sala ou em atendimento. */
  inFlow: number;
  /** SLA em risco ou atrasado (referência). */
  slaAttention: number;
  /** Concluídos na data de referência. */
  completedOnRef: number;
};

export function getAttendanceDaySummary(
  items: AdminAttendance[],
  referenceDate: string = ATTENDANCE_REFERENCE_DATE
): AttendanceDaySummary {
  const today = items.filter((a) => a.date === referenceDate);
  const inFlow = today.filter((a) =>
    ['checked_in', 'in_progress'].includes(a.status)
  ).length;
  const slaAttention = today.filter((a) => a.sla === 'at_risk' || a.sla === 'breached').length;
  const completedOnRef = today.filter((a) => a.status === 'completed').length;
  return {
    todayTotal: today.length,
    inFlow,
    slaAttention,
    completedOnRef,
  };
}
