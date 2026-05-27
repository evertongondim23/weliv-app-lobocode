import { AlertCircle, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  BREAKDOWN_ROW_STYLE,
  CARD_BORDER_STYLE,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-financial.constants';
import type { DetailedBreakdownSectionProps } from '../types/professional-financial.types';
import { formatCurrency } from '../utils/professional-financial.utils';

export function DetailedBreakdownSection({ metrics, consultationPrice }: DetailedBreakdownSectionProps) {
  const {
    completedAppointments,
    scheduledAppointments,
    noShowAppointments,
    cancelledAppointments,
    totalRevenue,
    potentialRevenue,
  } = metrics;

  return (
    <Card className="border-2" style={CARD_BORDER_STYLE}>
      <CardHeader>
        <CardTitle style={{ color: TEXT_PRIMARY_COLOR }}>Resumo Detalhado</CardTitle>
        <CardDescription>Análise completa do período</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className="flex items-center justify-between p-4 rounded-lg border-2"
          style={BREAKDOWN_ROW_STYLE.completed}
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium" style={{ color: TEXT_PRIMARY_COLOR }}>
                Consultas Realizadas
              </p>
              <p className="text-sm text-muted-foreground">
                {completedAppointments.length} atendimento
                {completedAppointments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <p className="text-lg font-bold text-green-600">R$ {formatCurrency(totalRevenue)}</p>
        </div>

        <div
          className="flex items-center justify-between p-4 rounded-lg border-2"
          style={BREAKDOWN_ROW_STYLE.scheduled}
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium" style={{ color: TEXT_PRIMARY_COLOR }}>
                Consultas Agendadas
              </p>
              <p className="text-sm text-muted-foreground">
                {scheduledAppointments.length} pendente
                {scheduledAppointments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <p className="text-lg font-bold text-blue-600">R$ {formatCurrency(potentialRevenue)}</p>
        </div>

        <div
          className="flex items-center justify-between p-4 rounded-lg border-2"
          style={BREAKDOWN_ROW_STYLE.noShow}
        >
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <XCircle className="size-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium" style={{ color: TEXT_PRIMARY_COLOR }}>
                Faltas
              </p>
              <p className="text-sm text-muted-foreground">
                {noShowAppointments.length} paciente
                {noShowAppointments.length !== 1 ? 's' : ''} não comparece
                {noShowAppointments.length !== 1 ? 'ram' : 'u'}
              </p>
            </div>
          </div>
          <p className="text-lg font-bold text-red-600">
            R$ {formatCurrency(noShowAppointments.length * consultationPrice)}
          </p>
        </div>

        <div
          className="flex items-center justify-between p-4 rounded-lg border-2"
          style={BREAKDOWN_ROW_STYLE.cancelled}
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <AlertCircle className="size-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium" style={{ color: TEXT_PRIMARY_COLOR }}>
                Cancelamentos
              </p>
              <p className="text-sm text-muted-foreground">
                {cancelledAppointments.length} consulta
                {cancelledAppointments.length !== 1 ? 's' : ''} cancelada
                {cancelledAppointments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-600">
            R$ {formatCurrency(cancelledAppointments.length * consultationPrice)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
