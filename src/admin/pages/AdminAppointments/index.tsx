import { PageHeader } from '../../components/common/PageHeader';
import { useAdminAppointmentsPage } from './hooks/use-admin-appointments-page';
import { AppointmentsListSection } from './sections/appointments-list-section';
import { AppointmentsSummarySection } from './sections/appointments-summary-section';

export function AdminAppointmentsPage() {
  const data = useAdminAppointmentsPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atendimentos"
        description="Listagem central com status em tempo de espera e SLA operacional. Use filtros para priorizar fila e riscos — detalhes abrem ao lado em desktop."
      />

      <AppointmentsSummarySection {...data.summary} />

      <AppointmentsListSection {...data.list} />
    </div>
  );
}
