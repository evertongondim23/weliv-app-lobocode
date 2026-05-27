import { Calendar } from 'lucide-react';
import { EmptyState } from '../../../../components/EmptyState';
import type { AppointmentsTabPanelProps } from '../types/patient-appointments.types';
import { PatientAppointmentCard } from './patient-appointment-card';

export function AppointmentsTabPanel({
  appointments,
  professionals,
  emptyTitle,
  emptyDescription,
  onCancel,
  onReschedule,
}: AppointmentsTabPanelProps) {
  if (appointments.length === 0) {
    return (
      <EmptyState icon={Calendar} title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <>
      {appointments.map((appointment) => {
        const professional = professionals.find((p) => p.id === appointment.professionalId);
        if (!professional) return null;

        return (
          <PatientAppointmentCard
            key={appointment.id}
            appointment={appointment}
            professional={professional}
            onCancel={onCancel}
            onReschedule={onReschedule}
          />
        );
      })}
    </>
  );
}
