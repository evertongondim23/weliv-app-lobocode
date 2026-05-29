import type { Appointment } from '../../../../types';

export function filterPatientAppointments(appointments: Appointment[], patientId: string | undefined) {
  return appointments.filter((apt) => apt.patientId === patientId);
}

export function getUpcomingAppointments(myAppointments: Appointment[]) {
  return myAppointments
    .filter((apt) => apt.status === 'scheduled' || apt.status === 'confirmed')
    .sort((a, b) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
    );
}

export function getUpcomingPreview(upcoming: Appointment[], limit = 4) {
  return upcoming.slice(0, limit);
}
