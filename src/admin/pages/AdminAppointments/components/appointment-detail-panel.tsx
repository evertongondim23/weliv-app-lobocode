import {
  AlertTriangle,
  ClipboardList,
  Phone,
  Stethoscope,
  User,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../../app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import {
  appointmentsCardBorderStyle,
  appointmentsPrimaryActionStyle,
} from '../constants/admin-appointments-page.constants';
import type { AppointmentDetailPanelProps } from '../types/admin-appointments-page.types';
import { formatDatePt } from '../utils/admin-appointments-page.utils';
import { SlaBadge } from './sla-badge';
import { StatusBadge } from './status-badge';

export function AppointmentDetailPanel({ selected, onClose }: AppointmentDetailPanelProps) {
  return (
    <Card className="border-2 h-fit xl:sticky xl:top-24" style={appointmentsCardBorderStyle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg" style={{ color: '#4A3728' }}>
                {selected.id}
              </CardTitle>
              <StatusBadge status={selected.status} />
              <SlaBadge sla={selected.sla} />
            </div>
            <CardDescription className="line-clamp-2">
              {selected.patientName} · {formatDatePt(selected.date)} às {selected.time} ({selected.channel})
            </CardDescription>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8 shrink-0"
            onClick={onClose}
            aria-label="Fechar detalhe"
          >
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {selected.sla !== 'on_time' ? (
          <div
            className="rounded-lg border px-3 py-2.5 text-xs flex gap-2 items-start"
            style={{ borderColor: 'rgba(217, 119, 6, 0.35)', background: '#FFFBF0' }}
          >
            <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold" style={{ color: '#4A3728' }}>
                Janela de SLA
              </p>
              <p style={{ color: '#6B5D53' }}>
                {selected.slaMinutesRemaining >= 0
                  ? `${selected.slaMinutesRemaining} min restantes na janela`
                  : `${Math.abs(selected.slaMinutesRemaining)} min além do limite`}
              </p>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
            <User className="size-4 shrink-0" />
            <span>
              <span className="font-medium" style={{ color: '#4A3728' }}>
                {selected.patientName}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
            <Stethoscope className="size-4 shrink-0" />
            <span>
              {selected.professionalName}
              <span className="text-xs block" style={{ color: '#6B5D53' }}>
                {selected.specialty}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
            <ClipboardList className="size-4 shrink-0" />
            <span>{selected.unit}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
            <Phone className="size-4 shrink-0" />
            <span>
              Sinal: {selected.depositPaid ? 'confirmado' : 'pendente'} <span className="text-xs">(demo)</span>
            </span>
          </div>
        </div>

        {selected.notes ? (
          <div className="rounded-lg border p-3 text-xs" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
            <p className="font-semibold mb-1" style={{ color: '#4A3728' }}>
              Observações
            </p>
            <p style={{ color: '#6B5D53' }}>{selected.notes}</p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
            Ações rápidas (demo)
          </p>
          <div className="grid grid-cols-1 gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-2 justify-start"
              style={appointmentsCardBorderStyle}
              onClick={() => toast.message('Demo', { description: 'Check-in registrado (simulado).' })}
              disabled={['completed', 'cancelled', 'no_show'].includes(selected.status)}
            >
              Registrar check-in
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-2 justify-start"
              style={appointmentsCardBorderStyle}
              onClick={() =>
                toast.message('Demo', { description: 'Timeline do atendimento abriria em módulo futuro.' })
              }
            >
              Ver linha do tempo
            </Button>
            <Button
              type="button"
              className="text-white border-0 justify-start"
              style={appointmentsPrimaryActionStyle}
              onClick={() => toast.success('Demo: atendimento marcado como concluído.')}
            >
              Encerrar atendimento
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
