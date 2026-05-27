import { Heart } from 'lucide-react';
import { WelcomeCard } from '../../../components/common';
import { usePatientDashboard } from './hooks/use-patient-dashboard';
import { DashboardSummarySection } from './sections/dashboard-summary-section';
import { NextAppointmentSection } from './sections/next-appointment-section';
import { QuickActionsSection } from './sections/quick-actions-section';
import { UpcomingAppointmentsSection } from './sections/upcoming-appointments-section';

export function PatientDashboard() {
  const { welcome, nextAppointment, summary, quickActions, upcoming } = usePatientDashboard();

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={Heart}
        title="Painel do Paciente"
        subtitle={`Olá, ${welcome.firstName} — como posso ajudar hoje?`}
        iconFilled
      />

      <NextAppointmentSection {...nextAppointment} />
      <DashboardSummarySection {...summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionsSection {...quickActions} />
        <UpcomingAppointmentsSection {...upcoming} />
      </div>
    </div>
  );
}
