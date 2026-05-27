import { Layers, ShieldAlert, Timer, Wallet } from 'lucide-react';
import { Card, CardContent } from '../../../../app/components/ui/card';
import { formatBRL } from '../../../utils/formatCurrency';
import { financeBorderStyle } from '../../../utils/financeUi';
import type { DefaultsKpisSectionProps } from '../types/admin-defaults-page.types';

export function DefaultsKpisSection({ summary, criticalVolume }: DefaultsKpisSectionProps) {
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Wallet className="size-3.5" />
            Carteira vencida
          </p>
          <p className="text-xl font-bold tabular-nums text-red-900">{formatBRL(summary.totalOverdue)}</p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            {summary.caseCount} caso(s) ativo(s) na demo
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <ShieldAlert className="size-3.5 text-red-600" />
            Risco crítico
          </p>
          <p className="text-2xl font-bold tabular-nums text-red-700">{summary.criticalCount}</p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            {formatBRL(criticalVolume)} em exposição crítica
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Timer className="size-3.5" />
            Atraso médio
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
            {summary.avgDaysPastDue}
            <span className="text-sm font-semibold ml-1">dias</span>
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Idade média das dívidas listadas
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Layers className="size-3.5" />
            Mix carteira
          </p>
          <p className="text-sm font-semibold tabular-nums" style={{ color: '#4A3728' }}>
            Conv.: {formatBRL(summary.convenioTotal)}
          </p>
          <p className="text-sm font-semibold tabular-nums" style={{ color: '#6B5D53' }}>
            Part.: {formatBRL(summary.particularTotal)}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
