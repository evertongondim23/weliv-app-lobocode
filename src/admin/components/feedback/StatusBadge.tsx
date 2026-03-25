import React from 'react';
import { Badge } from '../../../app/components/ui/badge';

const statusMap: Record<string, { color: string; bg: string; border: string }> = {
  ativo: { color: '#047857', bg: 'rgba(4, 120, 87, 0.1)', border: 'rgba(4, 120, 87, 0.35)' },
  pago: { color: '#047857', bg: 'rgba(4, 120, 87, 0.1)', border: 'rgba(4, 120, 87, 0.35)' },
  saudável: { color: '#047857', bg: 'rgba(4, 120, 87, 0.1)', border: 'rgba(4, 120, 87, 0.35)' },
  ok: { color: '#047857', bg: 'rgba(4, 120, 87, 0.1)', border: 'rgba(4, 120, 87, 0.35)' },
  pendente: { color: '#a16207', bg: 'rgba(161, 98, 7, 0.1)', border: 'rgba(161, 98, 7, 0.35)' },
  atenção: { color: '#a16207', bg: 'rgba(161, 98, 7, 0.1)', border: 'rgba(161, 98, 7, 0.35)' },
  instável: { color: '#a16207', bg: 'rgba(161, 98, 7, 0.1)', border: 'rgba(161, 98, 7, 0.35)' },
  alerta: { color: '#a16207', bg: 'rgba(161, 98, 7, 0.1)', border: 'rgba(161, 98, 7, 0.35)' },
  atrasado: { color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)', border: 'rgba(185, 28, 28, 0.35)' },
  bloqueado: { color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)', border: 'rgba(185, 28, 28, 0.35)' },
  fora: { color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)', border: 'rgba(185, 28, 28, 0.35)' },
  crítico: { color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)', border: 'rgba(185, 28, 28, 0.35)' },
  normal: { color: '#1d4ed8', bg: 'rgba(29, 78, 216, 0.1)', border: 'rgba(29, 78, 216, 0.3)' },
  lotado: { color: '#7c2d12', bg: 'rgba(124, 45, 18, 0.1)', border: 'rgba(124, 45, 18, 0.35)' },
  inativo: { color: '#475569', bg: 'rgba(71, 85, 105, 0.12)', border: 'rgba(71, 85, 105, 0.35)' },
};

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusMap[status] ?? { color: '#6B5D53', bg: 'rgba(63, 103, 131, 0.1)', border: 'rgba(63, 103, 131, 0.3)' };
  return (
    <Badge
      variant="outline"
      className="capitalize"
      style={{ color: style.color, background: style.bg, borderColor: style.border }}
    >
      {status}
    </Badge>
  );
}
