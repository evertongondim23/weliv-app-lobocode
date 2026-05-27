import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  GENERAL_SUMMARY_CARD_STYLE,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-financial.constants';
import type { GeneralSummarySectionProps } from '../types/professional-financial.types';
import { formatCurrency } from '../utils/professional-financial.utils';

export function GeneralSummarySection({ period, metrics, consultationPrice }: GeneralSummarySectionProps) {
  const { totalRevenue, totalAppointments, noShowAppointments, cancelledAppointments } = metrics;

  const averageDailyRevenue =
    period === 'daily'
      ? totalRevenue / 7
      : period === 'monthly'
        ? totalRevenue / 30
        : totalRevenue / 365;

  const utilizationRate =
    totalAppointments > 0
      ? (
          ((totalAppointments - noShowAppointments.length - cancelledAppointments.length) /
            totalAppointments) *
          100
        ).toFixed(1)
      : '0';

  return (
    <Card className="border-2" style={GENERAL_SUMMARY_CARD_STYLE}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: TEXT_PRIMARY_COLOR }}>
          <FileText className="size-5" style={{ color: '#FFA500' }} />
          Resumo Geral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Valor Médio por Consulta</p>
            <p className="text-2xl font-bold" style={{ color: TEXT_PRIMARY_COLOR }}>
              R$ {formatCurrency(consultationPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Receita Média por Dia</p>
            <p className="text-2xl font-bold" style={{ color: TEXT_PRIMARY_COLOR }}>
              R$ {formatCurrency(averageDailyRevenue)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Taxa de Aproveitamento</p>
            <p className="text-2xl font-bold" style={{ color: '#10b981' }}>
              {utilizationRate}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
