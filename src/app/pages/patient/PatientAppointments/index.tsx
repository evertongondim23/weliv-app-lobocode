import { Calendar } from 'lucide-react';
import { WelcomeCard } from '../../../components/common';
import { CancelAppointmentDialog } from './components/cancel-appointment-dialog';
import { RescheduleAppointmentDialog } from './components/reschedule-appointment-dialog';
import { usePatientAppointments } from './hooks/use-patient-appointments';
import { AppointmentsTabsSection } from './sections/appointments-tabs-section';

export function PatientAppointments() {
  const { tabs, cancelDialog, rescheduleDialog } = usePatientAppointments();

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={Calendar}
        title="Minhas Consultas"
        subtitle="Gerencie seus agendamentos e histórico"
      />
      <AppointmentsTabsSection {...tabs} />
      <CancelAppointmentDialog {...cancelDialog} />
      <RescheduleAppointmentDialog {...rescheduleDialog} />
    </div>
  );
}
