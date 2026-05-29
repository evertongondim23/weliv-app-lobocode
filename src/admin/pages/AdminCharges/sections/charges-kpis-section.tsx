import { ShieldAlert, Timer, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardContent } from '../../../../app/components/ui/card';
import { formatBRL } from '../../../utils/formatCurrency';
import { financeBorderStyle } from '../../../utils/financeUi';
import type { ChargesKpisSectionProps } from '../types/admin-charges-page.types';

export function ChargesKpisSection({
  tab,
  statusFilter,
  riskFilter,
  chargeSummary,
  riskSummary,
  criticalVolume,
  onGoOverdue,
  onGoCritical,
}: ChargesKpisSectionProps) {
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Wallet className="size-3.5" />
            Em aberto
          </p>
          <p className="text-xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
            {formatBRL(chargeSummary.openTotal)}
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            {chargeSummary.openCount} cobrança(s) não liquidada(s)
          </p>
        </CardContent>
      </Card>
      <button
        type="button"
        onClick={onGoOverdue}
        className={`text-left rounded-xl transition-[box-shadow] ${tab === 'charges' && statusFilter === 'atrasado' ? 'ring-2 ring-red-400/60' : ''}`}
      >
        <Card className="border-2 h-full cursor-pointer hover:bg-[#FFF5F5]" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p
              className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
              style={{ color: '#6B5D53' }}
            >
              <TrendingDown className="size-3.5 text-red-600" />
              Inadimplência
            </p>
            <p className="text-xl font-bold tabular-nums text-red-700">
              {formatBRL(chargeSummary.overdueTotal)}
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              {chargeSummary.overdueCount} em atraso
            </p>
          </CardContent>
        </Card>
      </button>
      <button
        type="button"
        onClick={onGoCritical}
        className={`text-left rounded-xl transition-[box-shadow] ${tab === 'recovery' && riskFilter === 'critico' ? 'ring-2 ring-red-500/60' : ''}`}
      >
        <Card className="border-2 h-full cursor-pointer hover:bg-[#FFF5F5]" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p
              className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
              style={{ color: '#6B5D53' }}
            >
              <ShieldAlert className="size-3.5 text-red-600" />
              Risco crítico
            </p>
            <p className="text-xl font-bold tabular-nums text-red-700">{riskSummary.criticalCount}</p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              {formatBRL(criticalVolume)} em exposição
            </p>
          </CardContent>
        </Card>
      </button>
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Timer className="size-3.5" />
            Atraso médio
          </p>
          <p className="text-xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
            {riskSummary.avgDaysPastDue}
            <span className="text-sm ml-1">dias</span>
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Idade média dos casos vencidos
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
