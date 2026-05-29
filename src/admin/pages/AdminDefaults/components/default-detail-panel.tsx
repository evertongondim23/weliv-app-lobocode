import {
  AlertTriangle,
  Building2,
  Handshake,
  Mail,
  Phone,
  Scale,
  Timer,
  User,
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
import { stageLabels } from '../constants/admin-defaults-page.constants';
import type { DefaultDetailPanelProps } from '../types/admin-defaults-page.types';
import { RiskBadge } from './risk-badge';

export function DefaultDetailPanel({ selected, onClose }: DefaultDetailPanelProps) {
  return (
    <Card className="border-2 h-fit xl:sticky xl:top-24" style={financeBorderStyle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg" style={{ color: '#4A3728' }}>
                {selected.id}
              </CardTitle>
              <RiskBadge level={selected.riskLevel} />
            </div>
            <CardDescription>
              {selected.patientName} · {selected.planLabel} ({selected.planKind})
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
          <p className="text-2xl font-bold tabular-nums mt-1 text-red-900">
            {formatBRL(selected.overdueAmount)}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs" style={{ color: '#6B5D53' }}>
            <Timer className="size-3.5" />
            <span>
              <span className="font-semibold text-[#4A3728]">{selected.daysPastDue} dias</span> desde o
              vencimento mais antigo
            </span>
            <span className="text-[#94a3b8]">·</span>
            <span>Venc. {selected.oldestDueDate}</span>
          </div>
        </div>

        {selected.riskLevel === 'critico' || selected.riskLevel === 'alto' ? (
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
              <p className="text-red-900/85">{selected.nextBestAction}</p>
            </div>
          </div>
        ) : (
          <div
            className="rounded-lg border px-3 py-2.5 text-xs"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFFBF0' }}
          >
            <p className="font-semibold mb-1" style={{ color: '#4A3728' }}>
              Próximo passo sugerido
            </p>
            <p style={{ color: '#6B5D53' }}>{selected.nextBestAction}</p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs" style={financeBorderStyle}>
              {stageLabels[selected.recoveryStage]}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-white capitalize">
              Cobrança {selected.chargeRef}
            </Badge>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
            <Building2 className="size-4 shrink-0" />
            {selected.unit}
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#6B5D53' }}>
            <span className="inline-flex items-center gap-1">
              {selected.contactChannel === 'email' ? <Mail className="size-3.5" /> : null}
              {selected.contactChannel === 'telefone' ? <Phone className="size-3.5" /> : null}
              {selected.contactChannel === 'whatsapp' ? <Phone className="size-3.5" /> : null}
              Último contato: <span className="font-medium text-[#4A3728]">{selected.lastContactAt}</span>
            </span>
          </div>
          {selected.email ? (
            <div className="flex items-center gap-2 min-w-0" style={{ color: '#6B5D53' }}>
              <User className="size-4 shrink-0" />
              <span className="truncate text-xs">{selected.email}</span>
            </div>
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
            Ações de recuperação (demo)
          </p>
          <Button
            type="button"
            variant="outline"
            className="border-2 justify-start gap-2"
            style={financeBorderStyle}
            onClick={() => toast.message('Demo', { description: 'Registro de tentativa de contato salvo.' })}
          >
            <Phone className="size-4" />
            Registrar contato
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-2 justify-start gap-2"
            style={financeBorderStyle}
            onClick={() =>
              toast.message('Demo', { description: 'Proposta de parcelamento enviada (e-mail/WhatsApp).' })
            }
          >
            <Handshake className="size-4" />
            Propor acordo / parcelamento
          </Button>
          {selected.planKind === 'convenio' ? (
            <Button
              type="button"
              variant="outline"
              className="border-2 justify-start gap-2"
              style={financeBorderStyle}
              onClick={() =>
                toast.message('Demo', { description: 'Fluxo de glosa/coparticipação aberto com a operadora.' })
              }
            >
              <Scale className="size-4" />
              Acionar trilha convênio / glosa
            </Button>
          ) : null}
          <Button
            type="button"
            className="text-white border-0 justify-start"
            style={financePrimaryActionStyle}
            onClick={() => toast.success('Demo: caso escalado para jurídico.')}
            disabled={selected.recoveryStage === 'juridico'}
          >
            Escalar para jurídico
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
