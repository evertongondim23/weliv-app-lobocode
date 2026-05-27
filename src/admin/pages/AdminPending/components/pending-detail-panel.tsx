import { AlertTriangle, CheckCircle2, Clock3, PauseCircle, X } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../app/components/ui/card';
import { formatPendingDateTimeDisplay, pendingTypeLabels } from '../../../services/pending.service';
import { pendingCardBorderStyle } from '../constants/admin-pending-page.constants';
import type { PendingDetailPanelProps } from '../types/admin-pending-page.types';
import { PriorityBadge } from './priority-badge';
import { StatusBadge } from './status-badge';

export function PendingDetailPanel({ selected, slaPanel, onClose }: PendingDetailPanelProps) {
  return (
    <Card className="border-2 h-fit xl:sticky xl:top-24" style={pendingCardBorderStyle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-xl" style={{ color: '#4A3728' }}>
                {selected.id}
              </CardTitle>
              <PriorityBadge priority={selected.priority} />
              <StatusBadge status={selected.status} />
            </div>
            <CardDescription>{selected.title}</CardDescription>
          </div>
          <Button type="button" size="icon" variant="ghost" className="size-8" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {slaPanel ? (
          <div
            className="rounded-lg border p-3"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFF8E7' }}
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className={`size-4 mt-0.5 ${slaPanel.accent}`} />
              <div>
                <p className={`text-sm font-semibold ${slaPanel.accent}`}>{slaPanel.title}</p>
                <p className="text-xs" style={{ color: '#6B5D53' }}>
                  {slaPanel.body}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-2 text-sm">
          <p>
            <strong>Responsável:</strong> {selected.owner}
          </p>
          <p>
            <strong>Criada em:</strong> {formatPendingDateTimeDisplay(selected.createdAt)}
          </p>
          <p>
            <strong>Prazo:</strong> {formatPendingDateTimeDisplay(selected.dueAt)}
          </p>
          <p>
            <strong>Tipo:</strong> {pendingTypeLabels[selected.type]}
          </p>
        </div>

        <div className="rounded-lg border p-3 text-sm" style={pendingCardBorderStyle}>
          {selected.description}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button className="text-white" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            <CheckCircle2 className="size-4 mr-1.5" />
            Concluir OS
          </Button>
          <Button variant="outline">
            <Clock3 className="size-4 mr-1.5" />
            Assumir
          </Button>
          <Button variant="outline">
            <PauseCircle className="size-4 mr-1.5" />
            Pausar
          </Button>
          <Button variant="outline">
            <AlertTriangle className="size-4 mr-1.5" />
            Escalar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
