import { AdminFinancialSubnav } from '../../components/finance/AdminFinancialSubnav';
import { PageHeader } from '../../components/common/PageHeader';
import { useAdminDefaultsPage } from './hooks/use-admin-defaults-page';
import { DefaultsKpisSection } from './sections/defaults-kpis-section';
import { DefaultsListSection } from './sections/defaults-list-section';

export function AdminDefaultsPage() {
  const data = useAdminDefaultsPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inadimplência"
        description="Priorize por risco e idade da dívida. Convênio exige trilha de glosa e coparticipação; particular acelera negociação direta. A lista ordena críticos primeiro, depois maior atraso."
      />

      <AdminFinancialSubnav />

      <DefaultsKpisSection {...data.kpis} />

      <DefaultsListSection {...data.list} />
    </div>
  );
}
