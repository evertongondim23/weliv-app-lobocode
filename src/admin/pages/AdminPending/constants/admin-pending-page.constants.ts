import type { DueUrgency, PendingPriority, PendingStatus } from '../../../services/pending.service';

export const pendingCardBorderStyle = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const priorityMeta: Record<PendingPriority, { label: string; color: string; bg: string }> = {
  high: { label: 'Crítica', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
  medium: { label: 'Média', color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)' },
  low: { label: 'Baixa', color: '#6B5D53', bg: 'rgba(107, 93, 83, 0.1)' },
};

export const statusMeta: Record<PendingStatus, { label: string; color: string; bg: string }> = {
  open: { label: 'Aberta', color: '#4A3728', bg: 'rgba(74, 55, 40, 0.08)' },
  'in-progress': { label: 'Em andamento', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' },
  approval: { label: 'Aprovação', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)' },
  blocked: { label: 'Bloqueada', color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)' },
  done: { label: 'Concluída', color: '#047857', bg: 'rgba(4, 120, 87, 0.1)' },
};

export const urgencyChipMeta: Record<
  DueUrgency,
  { label: string; color: string; bg: string } | null
> = {
  overdue: { label: 'Atrasado', color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.12)' },
  today: { label: 'Vence hoje', color: '#c2410c', bg: 'rgba(194, 65, 12, 0.12)' },
  soon: { label: 'Breve', color: '#a16207', bg: 'rgba(161, 98, 7, 0.12)' },
  ok: null,
};

export const prioOrder: Record<PendingPriority, number> = { high: 0, medium: 1, low: 2 };

export const STATUS_FILTER_OPTIONS = [
  { label: 'Todos os status', value: 'all' },
  { label: 'Aberta', value: 'open' },
  { label: 'Em andamento', value: 'in-progress' },
  { label: 'Aprovação', value: 'approval' },
  { label: 'Bloqueada', value: 'blocked' },
  { label: 'Concluída', value: 'done' },
] as const;
