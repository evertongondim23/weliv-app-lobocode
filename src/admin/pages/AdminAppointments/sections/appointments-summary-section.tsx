import { Activity, AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../../../../app/components/ui/card';
import { appointmentsCardBorderStyle } from '../constants/admin-appointments-page.constants';
import type { AppointmentsSummarySectionProps } from '../types/admin-appointments-page.types';

export function AppointmentsSummarySection({ daySummary, referenceDateLabel }: AppointmentsSummarySectionProps) {
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      <Card className="border-2" style={appointmentsCardBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <CalendarClock className="size-3.5" />
            No dia {referenceDateLabel}
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
            {daySummary.todayTotal}
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Atendimentos agendados nesta data
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={appointmentsCardBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Activity className="size-3.5" />
            Em fluxo
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: '#c2410c' }}>
            {daySummary.inFlow}
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Check-in ou em atendimento
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={appointmentsCardBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <AlertTriangle className="size-3.5 text-amber-600" />
            SLA sob atenção
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: '#b45309' }}>
            {daySummary.slaAttention}
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Risco ou atraso no dia
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={appointmentsCardBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            Concluídos
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: '#047857' }}>
            {daySummary.completedOnRef}
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Encerrados com sucesso (dia ref.)
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
