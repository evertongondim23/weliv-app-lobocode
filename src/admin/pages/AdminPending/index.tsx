import { PageHeader } from '../../components/common/PageHeader';
import { useAdminPendingPage } from './hooks/use-admin-pending-page';
import { PendingListSection } from './sections/pending-list-section';
import { PendingSummarySection } from './sections/pending-summary-section';

export function AdminPendingPage() {
  const data = useAdminPendingPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pendências"
        description="Central de alertas críticos, aprovações e pendências operacionais. Use os cards e chips para triar por prioridade, status e prazo."
      />

      <PendingSummarySection {...data.summary} />

      <PendingListSection {...data.list} />
    </div>
  );
}
