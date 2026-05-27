import { ArrowRightLeft, Receipt, Scale, Wallet } from 'lucide-react';
import { Card, CardContent } from '../../../../app/components/ui/card';
import { formatBRL } from '../../../utils/formatCurrency';
import { financeBorderStyle } from '../../../utils/financeUi';
import type { PaymentsSummarySectionProps } from '../types/admin-payments-page.types';

export function PaymentsSummarySection({ summary }: PaymentsSummarySectionProps) {
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <ArrowRightLeft className="size-3.5" />
            Pendente de conciliação
          </p>
          <p className="text-xl font-bold tabular-nums" style={{ color: '#a16207' }}>
            {formatBRL(summary.pendingGross)}
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            {summary.pendingCount} captura(s) · líquido previsto {formatBRL(summary.pendingNet)}
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Wallet className="size-3.5 text-emerald-700" />
            Já conciliados
          </p>
          <p className="text-xl font-bold tabular-nums text-emerald-800">
            {formatBRL(summary.reconciledNet)}
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            {summary.reconciledCount} registro(s) · total líquido repassado
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Receipt className="size-3.5" />
            Taxas (MDR) no período
          </p>
          <p className="text-xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
            {formatBRL(summary.totalFees)}
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Soma das taxas das linhas da demo
          </p>
        </CardContent>
      </Card>
      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-5 pb-4 space-y-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: '#6B5D53' }}
          >
            <Scale className="size-3.5 text-orange-700" />
            Disputa / estorno
          </p>
          <p className="text-2xl font-bold tabular-nums text-orange-900">{summary.attentionCount}</p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Requer acompanhamento com adquirente
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
