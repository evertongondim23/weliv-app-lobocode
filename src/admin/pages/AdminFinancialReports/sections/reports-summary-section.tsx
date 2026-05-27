import { Landmark, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent } from '../../../../app/components/ui/card';
import { formatBRL } from '../../../utils/formatCurrency';
import { financeBorderStyle } from '../../../utils/financeUi';
import type { ReportsSummarySectionProps } from '../types/admin-financial-reports-page.types';
import { formatPct } from '../utils/admin-financial-reports-page.utils';

export function ReportsSummarySection({ kpis, sliceCount }: ReportsSummarySectionProps) {
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Wallet className="size-3.5" />
            Receita líquida
          </p>
          <p className="text-xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
            {formatBRL(kpis.netRevenue)}
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Soma das linhas do recorte ({sliceCount} lançamento(s))
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <TrendingUp className="size-3.5" />
            vs mês anterior
          </p>
          <p
            className={`text-xl font-bold tabular-nums ${kpis.variancePct != null && kpis.variancePct >= 0 ? 'text-emerald-800' : 'text-red-700'}`}
          >
            {formatPct(kpis.variancePct)}
          </p>
          <p className="text-xs tabular-nums" style={{ color: '#6B5D53' }}>
            Mês ant.: {formatBRL(kpis.prevNetRevenue)}
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <TrendingDown className="size-3.5 text-amber-600" />
            Inadimplência (ref.)
          </p>
          <p className="text-xl font-bold tabular-nums text-amber-800">
            {kpis.defaultRatePct.toFixed(1)}%
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Indicador de referência no período (mock)
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Landmark className="size-3.5 text-emerald-700" />
            Previsão caixa 30d
          </p>
          <p className="text-xl font-bold tabular-nums text-emerald-800">
            {formatBRL(kpis.cashForecast30d)}
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Projeção simplificada para alinhamento executivo
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
