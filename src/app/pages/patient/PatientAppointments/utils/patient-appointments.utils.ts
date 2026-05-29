import type { Appointment } from '../../../../types';

export function getMyAppointments(
  appointments: Appointment[],
  patientId: string | undefined,
): Appointment[] {
  return appointments.filter((apt) => apt.patientId === patientId);
}

export function getUpcomingAppointments(myAppointments: Appointment[]): Appointment[] {
  return myAppointments.filter(
    (apt) =>
      ['scheduled', 'confirmed'].includes(apt.status) &&
      new Date(`${apt.date}T${apt.time}`) >= new Date(),
  );
}

export function getPastAppointments(myAppointments: Appointment[]): Appointment[] {
  return myAppointments.filter(
    (apt) =>
      apt.status === 'completed' || new Date(`${apt.date}T${apt.time}`) < new Date(),
  );
}

export function getCancelledAppointments(myAppointments: Appointment[]): Appointment[] {
  return myAppointments.filter(
    (apt) => apt.status === 'cancelled' || apt.status === 'no-show',
  );
}

export function partitionPatientAppointments(
  appointments: Appointment[],
  patientId: string | undefined,
) {
  const myAppointments = getMyAppointments(appointments, patientId);
  return {
    upcoming: getUpcomingAppointments(myAppointments),
    past: getPastAppointments(myAppointments),
    cancelled: getCancelledAppointments(myAppointments),
  };
}
