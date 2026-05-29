import {
  AlertTriangle,
  Building2,
  Calendar,
  Copy,
  Mail,
  Receipt,
  X,
} from 'lucide-react';
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
import { financeBorderStyle, financePrimaryActionStyle } from '../../../utils/financeUi';
import { ChargeStatusBadge } from './charge-status-badge';
import type { ChargeDetailPanelProps } from '../types/admin-charges-page.types';

export function ChargeDetailPanel({ charge, onClose }: ChargeDetailPanelProps) {
  return (
    <Card className="border-2 h-fit xl:sticky xl:top-24" style={financeBorderStyle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg" style={{ color: '#4A3728' }}>
                {charge.id}
              </CardTitle>
              <ChargeStatusBadge status={charge.status} />
            </div>
            <CardDescription>{charge.patient}</CardDescription>
          </div>
          <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div
          className="rounded-xl border-2 px-4 py-4 text-center"
          style={{
            borderColor: 'rgba(255, 165, 0, 0.35)',
            background: 'linear-gradient(180deg, #FFFBF0 0%, #FFF8E7 100%)',
          }}
        >
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#6B5D53' }}>
            Valor
          </p>
          <p className="text-2xl font-bold tabular-nums mt-1" style={{ color: '#4A3728' }}>
            {charge.amount}
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs" style={{ color: '#6B5D53' }}>
            <Calendar className="size-3.5" />
            Vence em {charge.dueDate}
          </div>
        </div>

        {charge.status === 'atrasado' ? (
          <div
            className="rounded-lg border px-3 py-2.5 flex gap-2 items-start text-xs"
            style={{
              borderColor: 'rgba(185, 28, 28, 0.35)',
              background: 'rgba(185, 28, 28, 0.06)',
            }}
          >
            <AlertTriangle className="size-4 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Cobrança em atraso</p>
              <p className="text-red-800/90">
                Inclua na fila de recuperação ou acesse a aba Recuperação.
              </p>
            </div>
          </div>
        ) : null}

        <div className="space-y-2.5">
          <PaymentMethodCell method={charge.method} />
          <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
            <Building2 className="size-4 shrink-0" />
            <span>{charge.unit}</span>
          </div>
          {charge.appointmentRef ? (
            <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
              <Receipt className="size-4 shrink-0" />
              <span>Consulta {charge.appointmentRef}</span>
            </div>
          ) : null}
          {charge.email ? (
            <div className="flex items-center gap-2 min-w-0" style={{ color: '#6B5D53' }}>
              <Mail className="size-4 shrink-0" />
              <span className="truncate">{charge.email}</span>
            </div>
          ) : null}
          {charge.lastReminderAt ? (
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Último lembrete: <span className="font-medium">{charge.lastReminderAt}</span>
            </p>
          ) : null}
          {charge.paidAt ? (
            <p className="text-xs text-emerald-700">
              Pago em <span className="font-medium">{charge.paidAt}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            className="border-2 justify-start gap-2"
            style={financeBorderStyle}
            onClick={() => {
              navigator.clipboard.writeText(charge.id);
              toast.success('ID copiado.');
            }}
          >
            <Copy className="size-4" />
            Copiar ID
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-2 justify-start"
            style={financeBorderStyle}
            disabled={charge.status === 'pago'}
            onClick={() => toast.message('Demo', { description: 'Lembrete enfileirado.' })}
          >
            Enviar lembrete
          </Button>
          <Button
            type="button"
            className="text-white border-0 justify-start"
            style={financePrimaryActionStyle}
            disabled={charge.status === 'pago'}
            onClick={() => toast.success('Demo: pagamento registrado.')}
          >
            Registrar pagamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
