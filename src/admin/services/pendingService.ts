export type PendingPriority = 'high' | 'medium' | 'low';
export type PendingStatus = 'open' | 'in-progress' | 'approval' | 'blocked' | 'done';

export type PendingItem = {
  id: string;
  title: string;
  type: 'integration' | 'document' | 'finance' | 'schedule' | 'access';
  owner: string;
  createdAt: string;
  dueAt: string;
  priority: PendingPriority;
  status: PendingStatus;
  description: string;
};

export type PendingType = PendingItem['type'];

export const pendingTypeLabels: Record<PendingItem['type'], string> = {
  integration: 'Integração',
  document: 'Documento',
  finance: 'Financeiro',
  schedule: 'Agenda',
  access: 'Acesso',
};

export type DueUrgency = 'overdue' | 'today' | 'soon' | 'ok';

/** Datas mock no formato `YYYY-MM-DD` ou `YYYY-MM-DD HH:mm` (interpretadas no fuso local). */
export function parsePendingDateTime(value: string): Date | null {
  const t = value.trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}))?$/.exec(t);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const day = Number(m[3]);
  const h = m[4] ? Number(m[4]) : 0;
  const min = m[5] ? Number(m[5]) : 0;
  const d = new Date(y, mo, day, h, min, 0, 0);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatPendingDateTimeDisplay(value: string): string {
  const d = parsePendingDateTime(value);
  if (!d) return value;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(d);
}

export function getDueUrgency(dueAt: string, now: Date = new Date()): DueUrgency {
  const due = parsePendingDateTime(dueAt);
  if (!due) return 'ok';
  const nowMs = now.getTime();
  if (due.getTime() < nowMs) return 'overdue';
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (dueDay === nowDay) return 'today';
  const dayMs = 86400000;
  if (dueDay === nowDay + dayMs) return 'soon';
  if (due.getTime() - nowMs < 7 * dayMs) return 'soon';
  return 'ok';
}

/** Texto curto para painel de detalhe (ex.: "Atrasado há 3h", "Em menos de 5h"). */
export function formatDueRelativeLabel(dueAt: string, now: Date = new Date()): string {
  const due = parsePendingDateTime(dueAt);
  if (!due) return '';
  const u = getDueUrgency(dueAt, now);
  if (u === 'overdue') {
    const diffMs = now.getTime() - due.getTime();
    const h = Math.floor(diffMs / 3600000);
    if (h < 48) return `Atrasado há ${Math.max(1, h)}h`;
    const days = Math.floor(diffMs / 86400000);
    return `Atrasado há ${days} dia(s)`;
  }
  const diffMs = due.getTime() - now.getTime();
  const h = Math.max(1, Math.ceil(diffMs / 3600000));
  if (h <= 24) return `Vence em até ${h}h`;
  const days = Math.ceil(diffMs / 86400000);
  return `Vence em ${days} dia(s)`;
}

const pendingItemsMock: PendingItem[] = [
  {
    id: 'OS-1250',
    title: 'Verificar conexão intermitente',
    type: 'integration',
    owner: 'Integrações',
    createdAt: '2026-03-24 08:30',
    dueAt: '2026-03-24 14:00',
    priority: 'high',
    status: 'in-progress',
    description: 'Webhook do laboratório apresenta perda intermitente de eventos em horários de pico.',
  },
  {
    id: 'OS-1248',
    title: 'Aprovar lote de documentos pendentes',
    type: 'document',
    owner: 'Backoffice',
    createdAt: '2026-03-24 07:55',
    dueAt: '2026-03-24 12:00',
    priority: 'high',
    status: 'approval',
    description: 'Existem 18 laudos aguardando validação para liberação ao paciente.',
  },
  {
    id: 'OS-1242',
    title: 'Conferir divergência de conciliação PIX',
    type: 'finance',
    owner: 'Financeiro',
    createdAt: '2026-03-23 16:20',
    dueAt: '2026-03-24 18:00',
    priority: 'medium',
    status: 'open',
    description: 'Duas cobranças foram liquidadas no gateway e não refletiram no relatório diário.',
  },
  {
    id: 'OS-1239',
    title: 'Resolver conflito de agenda da unidade Centro',
    type: 'schedule',
    owner: 'Operação',
    createdAt: '2026-03-23 14:10',
    dueAt: '2026-03-25 10:00',
    priority: 'medium',
    status: 'open',
    description: 'Profissionais com bloqueio manual sobrepostos em três horários de alta demanda.',
  },
  {
    id: 'OS-1234',
    title: 'Revalidar permissões de usuário bloqueado',
    type: 'access',
    owner: 'TI/Admin',
    createdAt: '2026-03-22 10:05',
    dueAt: '2026-03-25 16:00',
    priority: 'low',
    status: 'blocked',
    description: 'Solicitação depende de confirmação da gestão da unidade para reativação.',
  },
];

export function listPendingItems(): PendingItem[] {
  return pendingItemsMock;
}

export function getPendingSummary(items: PendingItem[]) {
  const critical = items.filter((item) => item.priority === 'high' && item.status !== 'done').length;
  const approvals = items.filter((item) => item.status === 'approval').length;
  const inProgress = items.filter((item) => item.status === 'in-progress').length;
  const blocked = items.filter((item) => item.status === 'blocked').length;

  return { critical, approvals, inProgress, blocked };
}
