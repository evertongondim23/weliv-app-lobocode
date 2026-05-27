import type { Appointment, Professional } from '../../../../types';
import type { DepositInfo, PatientSlotRow } from '../types/book-appointment.types';

export function getBookedTimesForDay(
  appointments: Appointment[],
  professionalId: string,
  dateStr: string,
): string[] {
  return appointments
    .filter(
      (apt) =>
        apt.professionalId === professionalId &&
        apt.date === dateStr &&
        apt.status !== 'cancelled',
    )
    .map((apt) => apt.time);
}

export function getAvailableSlotsFromRows(slotRows: PatientSlotRow[]): string[] {
  return slotRows.filter((r) => r.status === 'available').map((r) => r.slot);
}

export function getDepositInfo(professional: Professional): DepositInfo {
  const depositAmount = professional.consultationPrice * (professional.depositPercentage / 100);
  return {
    depositAmount,
    requiresDeposit: professional.depositPercentage > 0,
  };
}

export function parseBookingSearchParams(search: string) {
  const params = new URLSearchParams(search);
  return {
    rescheduleId: params.get('reschedule'),
    prefillDate: params.get('date'),
    prefillTime: params.get('time'),
  };
}

export function findRescheduleAppointment(
  appointments: Appointment[],
  rescheduleId: string | null,
  patientId: string | undefined,
) {
  if (!rescheduleId || !patientId) return undefined;
  return appointments.find((apt) => apt.id === rescheduleId && apt.patientId === patientId);
}

export function getStartOfToday(): Date {
  return new Date(new Date().setHours(0, 0, 0, 0));
}
