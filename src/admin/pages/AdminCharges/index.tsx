import { AdminFinancialSubnav } from '../../components/finance/AdminFinancialSubnav';
import { PageHeader } from '../../components/common/PageHeader';
import { useAdminChargesPage } from './hooks/use-admin-charges-page';
import { ChargesKpisSection } from './sections/charges-kpis-section';
import { FinanceTabsCard } from './sections/finance-tabs-card';

export function AdminChargesPage() {
  const data = useAdminChargesPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cobranças e Inadimplência"
        description="Gerencie a carteira de cobranças e o ciclo de recuperação. Alterne entre a visão operacional e os casos em recuperação ativa."
      />

      <AdminFinancialSubnav />

      <ChargesKpisSection {...data.kpis} />

      <FinanceTabsCard
        tab={data.tab}
        onTabChange={data.setTab}
        chargesCount={data.allChargesCount}
        recoveryCount={data.financeTabs.recoveryCount}
        charges={data.chargesTab}
        recovery={data.recoveryTab}
      />
    </div>
  );
}
