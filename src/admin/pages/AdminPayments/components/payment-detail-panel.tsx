import { Building2, Copy, Landmark, Link2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../../app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../app/components/ui/card';
import { PaymentMethodCell } from '../../../components/finance/PaymentMethodCell';
import { formatBRL } from '../../../utils/formatCurrency';
import { financeBorderStyle, financePrimaryActionStyle } from '../../../utils/financeUi';
import type { PaymentDetailPanelProps } from '../types/admin-payments-page.types';
import { PaymentStatusBadge } from './payment-status-badge';

export function PaymentDetailPanel({ selected, onClose }: PaymentDetailPanelProps) {
  return (
    <Card className="border-2 h-fit xl:sticky xl:top-24" style={financeBorderStyle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg" style={{ color: '#4A3728' }}>
                {selected.id}
              </CardTitle>
              <PaymentStatusBadge status={selected.status} />
            </div>
            <CardDescription>
              {selected.patientName} · Cobrança {selected.chargeRef}
            </CardDescription>
          </div>
          <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div
          className="rounded-xl border-2 overflow-hidden"
          style={{ borderColor: 'rgba(255, 165, 0, 0.35)' }}
        >
          <div
            className="grid grid-cols-3 divide-x text-center"
            style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}
          >
            <div className="p-3 bg-[#FFFBF0]">
              <p className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: '#6B5D53' }}>
                Bruto
              </p>
              <p className="text-sm font-bold tabular-nums mt-0.5" style={{ color: '#4A3728' }}>
                {formatBRL(selected.grossAmount)}
              </p>
            </div>
            <div className="p-3 bg-white">
              <p className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: '#6B5D53' }}>
                Taxa
              </p>
              <p className="text-sm font-semibold tabular-nums mt-0.5 text-red-700">
                − {formatBRL(selected.feeAmount)}
              </p>
            </div>
            <div className="p-3 bg-emerald-50/80">
              <p className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: '#047857' }}>
                Líquido
              </p>
              <p className="text-sm font-bold tabular-nums mt-0.5 text-emerald-900">
                {formatBRL(selected.netAmount)}
              </p>
            </div>
          </div>
          <div
            className="px-3 py-2 text-xs flex items-center gap-2 border-t"
            style={{ borderColor: 'rgba(255, 165, 0, 0.12)', color: '#6B5D53' }}
          >
            <Landmark className="size-3.5 shrink-0" />
            Repasse previsto: <span className="font-medium text-[#4A3728]">{selected.settlementEta}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <PaymentMethodCell method={selected.method} />
            <span
              className="text-xs px-2 py-0.5 rounded-md border"
              style={{ borderColor: 'rgba(255, 165, 0, 0.25)', color: '#4A3728' }}
            >
              {selected.gateway}
            </span>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
            <Building2 className="size-4 shrink-0" />
            {selected.unit}
          </div>
          {selected.nsu ? (
            <div
              className="flex items-center justify-between gap-2 rounded-lg border px-2 py-1.5"
              style={financeBorderStyle}
            >
              <span className="text-xs truncate" style={{ color: '#6B5D53' }}>
                NSU <span className="font-mono font-medium text-[#4A3728]">{selected.nsu}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => {
                  navigator.clipboard.writeText(selected.nsu ?? '');
                  toast.success('NSU copiado.');
                }}
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
          ) : null}
          {selected.reconciledAt ? (
            <p className="text-xs text-emerald-800">
              Conciliado em <span className="font-medium">{selected.reconciledAt}</span>
            </p>
          ) : null}
          {selected.notes ? (
            <p
              className="text-xs rounded-lg border p-2"
              style={{ borderColor: 'rgba(255, 165, 0, 0.15)', color: '#6B5D53' }}
            >
              {selected.notes}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
            Ações rápidas (demo)
          </p>
          <Button
            type="button"
            variant="outline"
            className="border-2 justify-start gap-2"
            style={financeBorderStyle}
            onClick={() => toast.message('Demo', { description: 'Busca do NSU no extrato do gateway.' })}
          >
            <Link2 className="size-4" />
            Abrir no extrato (gateway)
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-2 justify-start"
            style={financeBorderStyle}
            disabled={selected.status === 'reconciled'}
            onClick={() => toast.success('Demo: conciliação manual registrada.')}
          >
            Marcar como conciliado
          </Button>
          <Button
            type="button"
            className="text-white border-0 justify-start"
            style={financePrimaryActionStyle}
            disabled={selected.status !== 'pending_gateway'}
            onClick={() => toast.message('Demo', { description: 'Webhook de confirmação reprocessado.' })}
          >
            Reprocessar confirmação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
