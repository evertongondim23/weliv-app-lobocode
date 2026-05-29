import {
  AlertTriangle,
  Building2,
  Handshake,
  Phone,
  Scale,
  Timer,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../../../app/components/ui/badge';
import { Button } from '../../../../app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../app/components/ui/card';
import { formatBRL } from '../../../utils/formatCurrency';
import { financeBorderStyle, financePrimaryActionStyle } from '../../../utils/financeUi';
import { riskConfig, stageLabels } from '../constants/admin-charges-page.constants';
import type { RecoveryDetailPanelProps } from '../types/admin-charges-page.types';

export function RecoveryDetailPanel({ case_: c, onClose }: RecoveryDetailPanelProps) {
  const riskC = riskConfig[c.riskLevel];
  const isCritical = c.riskLevel === 'critico' || c.riskLevel === 'alto';

  return (
    <Card className="border-2 h-fit xl:sticky xl:top-24" style={financeBorderStyle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg" style={{ color: '#4A3728' }}>
                {c.id}
              </CardTitle>
              <Badge variant="outline" style={{ color: riskC.color, background: riskC.bg, borderColor: riskC.border }}>
                {riskC.label}
              </Badge>
            </div>
            <CardDescription>
              {c.patientName} · {c.planLabel}
            </CardDescription>
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
            borderColor: 'rgba(185, 28, 28, 0.28)',
            background: 'linear-gradient(180deg, #FFF5F5 0%, #FFFBFB 100%)',
          }}
        >
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#6B5D53' }}>
            Valor vencido
          </p>
          <p className="text-2xl font-bold tabular-nums mt-1 text-red-900">{formatBRL(c.overdueAmount)}</p>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs" style={{ color: '#6B5D53' }}>
            <Timer className="size-3.5" />
            <span>
              <span className="font-semibold text-[#4A3728]">{c.daysPastDue} dias</span> desde{' '}
              {c.oldestDueDate}
            </span>
          </div>
        </div>

        {isCritical ? (
          <div
            className="rounded-lg border px-3 py-2.5 flex gap-2 items-start text-xs"
            style={{
              borderColor: 'rgba(185, 28, 28, 0.3)',
              background: 'rgba(185, 28, 28, 0.06)',
            }}
          >
            <AlertTriangle className="size-4 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Ação prioritária</p>
              <p className="text-red-900/85">{c.nextBestAction}</p>
            </div>
          </div>
        ) : (
          <div
            className="rounded-lg border px-3 py-2.5 text-xs"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFFBF0' }}
          >
            <p className="font-semibold mb-1" style={{ color: '#4A3728' }}>
              Próximo passo
            </p>
            <p style={{ color: '#6B5D53' }}>{c.nextBestAction}</p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs" style={financeBorderStyle}>
              {stageLabels[c.recoveryStage]}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-white capitalize">
              Cobrança {c.chargeRef}
            </Badge>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
            <Building2 className="size-4 shrink-0" />
            {c.unit}
          </div>
          <div className="text-xs" style={{ color: '#6B5D53' }}>
            Último contato: <span className="font-medium text-[#4A3728]">{c.lastContactAt}</span>
          </div>
          {c.notes ? (
            <p
              className="text-xs rounded-lg border p-2"
              style={{ borderColor: 'rgba(255, 165, 0, 0.15)', color: '#6B5D53' }}
            >
              {c.notes}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            className="border-2 justify-start gap-2"
            style={financeBorderStyle}
            onClick={() => toast.message('Demo', { description: 'Contato registrado.' })}
          >
            <Phone className="size-4" />
            Registrar contato
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-2 justify-start gap-2"
            style={financeBorderStyle}
            onClick={() => toast.message('Demo', { description: 'Proposta enviada.' })}
          >
            <Handshake className="size-4" />
            Propor acordo
          </Button>
          {c.planKind === 'convenio' ? (
            <Button
              type="button"
              variant="outline"
              className="border-2 justify-start gap-2"
              style={financeBorderStyle}
              onClick={() => toast.message('Demo', { description: 'Trilha de glosa aberta.' })}
            >
              <Scale className="size-4" />
              Acionar trilha convênio
            </Button>
          ) : null}
          <Button
            type="button"
            className="text-white border-0 justify-start"
            style={financePrimaryActionStyle}
            disabled={c.recoveryStage === 'juridico'}
            onClick={() => toast.success('Demo: escalado para jurídico.')}
          >
            Escalar para jurídico
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
