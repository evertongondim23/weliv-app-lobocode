import { AdminFinancialSubnav } from '../../components/finance/AdminFinancialSubnav';
import { PageHeader } from '../../components/common/PageHeader';
import { useAdminPaymentsPage } from './hooks/use-admin-payments-page';
import { PaymentsListSection } from './sections/payments-list-section';
import { PaymentsSummarySection } from './sections/payments-summary-section';

export function AdminPaymentsPage() {
  const data = useAdminPaymentsPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagamentos"
        description="Concilie capturas com o extrato do gateway, acompanhe taxas (MDR) e previsão de repasse. A lista prioriza pendências e disputas; o painel lateral mostra o de/para bruto → taxa → líquido."
      />

      <AdminFinancialSubnav />

      <PaymentsSummarySection {...data.summary} />

      <PaymentsListSection {...data.list} />
    </div>
  );
}
