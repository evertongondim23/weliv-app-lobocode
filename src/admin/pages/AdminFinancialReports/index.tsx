import { AdminFinancialSubnav } from '../../components/finance/AdminFinancialSubnav';
import { PageHeader } from '../../components/common/PageHeader';
import { useAdminFinancialReportsPage } from './hooks/use-admin-financial-reports-page';
import { ReportsContextBar } from './sections/reports-context-bar';
import { ReportsListSection } from './sections/reports-list-section';
import { ReportsSummarySection } from './sections/reports-summary-section';

export function AdminFinancialReportsPage() {
  const data = useAdminFinancialReportsPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios financeiros"
        description="Relatórios executivos de performance financeira e previsibilidade. Ajuste período e unidade para recortar os KPIs; refine a tabela por busca e categoria."
      />

      <AdminFinancialSubnav />

      <ReportsContextBar {...data.contextBar} />

      <ReportsSummarySection {...data.summary} />

      <ReportsListSection {...data.list} />
    </div>
  );
}
