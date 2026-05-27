import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import { SummaryCard } from '../components/summary-card';
import {
  INDICATOR_CARD_BORDER,
  REVENUE_CARD_BORDER,
} from '../constants/professional-financial.constants';
import type { FinancialSummarySectionProps } from '../types/professional-financial.types';
import { formatCurrency } from '../utils/professional-financial.utils';

export function FinancialSummarySection({
  completedAppointments,
  scheduledAppointments,
  noShowAppointments,
  cancelledAppointments,
  totalRevenue,
  potentialRevenue,
  lostRevenue,
  totalAppointments,
  noShowRate,
  remarcations,
  remarcationRate,
}: FinancialSummarySectionProps) {
  const lostCount = noShowAppointments.length + cancelledAppointments.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Faturamento Realizado"
          icon={DollarSign}
          iconClassName="size-5 text-green-600"
          value={`R$ ${formatCurrency(totalRevenue)}`}
          valueClassName="text-green-600"
          subtitle={`${completedAppointments.length} consulta${completedAppointments.length !== 1 ? 's' : ''} realizada${completedAppointments.length !== 1 ? 's' : ''}`}
          borderStyle={{ borderColor: REVENUE_CARD_BORDER.realized }}
        />
        <SummaryCard
          title="Faturamento Previsto"
          icon={TrendingUp}
          iconClassName="size-5 text-blue-600"
          value={`R$ ${formatCurrency(potentialRevenue)}`}
          valueClassName="text-blue-600"
          subtitle={`${scheduledAppointments.length} consulta${scheduledAppointments.length !== 1 ? 's' : ''} agendada${scheduledAppointments.length !== 1 ? 's' : ''}`}
          borderStyle={{ borderColor: REVENUE_CARD_BORDER.potential }}
        />
        <SummaryCard
          title="Receita Perdida"
          icon={AlertCircle}
          iconClassName="size-5 text-red-600"
          value={`R$ ${formatCurrency(lostRevenue)}`}
          valueClassName="text-red-600"
          subtitle={`${lostCount} falta${lostCount !== 1 ? 's' : ''} e cancelamento${lostCount !== 1 ? 's' : ''}`}
          borderStyle={{ borderColor: REVENUE_CARD_BORDER.lost }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Total de Consultas"
          icon={Users}
          iconClassName="size-4"
          iconStyle={{ color: '#FFA500' }}
          value={totalAppointments}
          headerLayout="column"
          borderStyle={{ borderColor: INDICATOR_CARD_BORDER.total }}
        />
        <SummaryCard
          title="Taxa de Faltas"
          icon={XCircle}
          iconClassName="size-4 text-red-600"
          value={`${noShowRate}%`}
          valueClassName="text-red-600"
          subtitle={`${noShowAppointments.length} falta${noShowAppointments.length !== 1 ? 's' : ''}`}
          headerLayout="column"
          borderStyle={{ borderColor: INDICATOR_CARD_BORDER.noShow }}
        />
        <SummaryCard
          title="Taxa de Remarcação"
          icon={Calendar}
          iconClassName="size-4"
          iconStyle={{ color: '#FFA500' }}
          value={`${remarcationRate}%`}
          valueStyle={{ color: '#FFA500' }}
          subtitle={`${remarcations} remarcaç${remarcations !== 1 ? 'ões' : 'ão'}`}
          headerLayout="column"
          borderStyle={{ borderColor: INDICATOR_CARD_BORDER.remarcation }}
        />
        <SummaryCard
          title="Taxa de Eficiência"
          icon={CheckCircle2}
          iconClassName="size-4 text-green-600"
          value={`${
            totalAppointments > 0
              ? ((completedAppointments.length / totalAppointments) * 100).toFixed(1)
              : '0'
          }%`}
          valueClassName="text-green-600"
          subtitle="Consultas realizadas"
          headerLayout="column"
          borderStyle={{ borderColor: INDICATOR_CARD_BORDER.efficiency }}
        />
      </div>
    </>
  );
}
