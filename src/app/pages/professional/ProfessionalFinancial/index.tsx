import { BarChart3 } from 'lucide-react';
import { WelcomeCard } from '../../../components/common';
import { useProfessionalFinancial } from './hooks/use-professional-financial';
import { DetailedBreakdownSection } from './sections/detailed-breakdown-section';
import { FinancialChartsSection } from './sections/financial-charts-section';
import { FinancialFiltersSection } from './sections/financial-filters-section';
import { FinancialSummarySection } from './sections/financial-summary-section';
import { GeneralSummarySection } from './sections/general-summary-section';
import { TodayConfirmationSection } from './sections/today-confirmation-section';

export function ProfessionalFinancial() {
  const {
    welcome,
    filters,
    todayConfirmation,
    summary,
    charts,
    detailedBreakdown,
    generalSummary,
  } = useProfessionalFinancial();

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={BarChart3}
        title="Relatórios e Financeiro"
        subtitle={`Período: ${welcome.periodLabel}`}
      />

      <FinancialFiltersSection {...filters} />

      {todayConfirmation.appointments.length > 0 ? (
        <TodayConfirmationSection {...todayConfirmation} />
      ) : null}

      <FinancialSummarySection {...summary} />
      <FinancialChartsSection {...charts} />
      <DetailedBreakdownSection {...detailedBreakdown} />
      <GeneralSummarySection {...generalSummary} />
    </div>
  );
}
