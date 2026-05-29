import { Activity } from 'lucide-react';
import { WelcomeCard } from '../../../components/common';
import { useProfessionalDashboard } from './hooks/use-professional-dashboard';
import { NextAppointmentSection } from './sections/next-appointment-section';
import { QuickActionsSection } from './sections/quick-actions-section';
import { StatsSection } from './sections/stats-section';
import { TodayAppointmentsSection } from './sections/today-appointments-section';

export function ProfessionalDashboard() {
  const { welcome, nextAppointment, stats, quickActions, today } = useProfessionalDashboard();

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={Activity}
        title="Painel Profissional"
        subtitle={`Bem-vindo, Dr(a). ${welcome.firstName}`}
      />

      <NextAppointmentSection {...nextAppointment} />
      <StatsSection stats={stats.items} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionsSection {...quickActions} />
        <TodayAppointmentsSection {...today} />
      </div>
    </div>
  );
}
