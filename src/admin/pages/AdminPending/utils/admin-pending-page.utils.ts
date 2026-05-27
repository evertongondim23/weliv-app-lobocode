import {
  formatDueRelativeLabel,
  getDueUrgency,
  parsePendingDateTime,
  pendingTypeLabels,
  type PendingItem,
  type PendingStatus,
  type PendingType,
} from '../../../services/pending.service';
import { prioOrder } from '../constants/admin-pending-page.constants';
import type { DueWindowFilter, SlaPanelContent } from '../types/admin-pending-page.types';

export function countDueWindows(allRows: PendingItem[]): { today: number; overdue: number } {
  const now = new Date();
  let today = 0;
  let overdue = 0;
  for (const item of allRows) {
    if (item.status === 'done') continue;
    const u = getDueUrgency(item.dueAt, now);
    if (u === 'today') today += 1;
    if (u === 'overdue') overdue += 1;
  }
  return { today, overdue };
}

export function filterAndSortPendingItems(
  allRows: PendingItem[],
  search: string,
  statusFilter: 'all' | PendingStatus,
  highPriorityOnly: boolean,
  dueWindow: DueWindowFilter,
): PendingItem[] {
  const now = new Date();
  const query = search.trim().toLowerCase();
  const labelByType = (t: PendingType) => pendingTypeLabels[t].toLowerCase();
  const out = allRows.filter((item) => {
    const matchesSearch =
      query.length === 0 ||
      `${item.id} ${item.title} ${item.owner} ${item.type} ${labelByType(item.type)}`
        .toLowerCase()
        .includes(query);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCritical =
      !highPriorityOnly || (item.priority === 'high' && item.status !== 'done');
    const urg = getDueUrgency(item.dueAt, now);
    const matchesDue =
      dueWindow === 'all' ||
      (dueWindow === 'today' && urg === 'today') ||
      (dueWindow === 'overdue' && urg === 'overdue');
    return matchesSearch && matchesStatus && matchesCritical && matchesDue;
  });

  return [...out].sort((a, b) => {
    const pa = prioOrder[a.priority];
    const pb = prioOrder[b.priority];
    if (pa !== pb) return pa - pb;
    const da = parsePendingDateTime(a.dueAt)?.getTime() ?? Number.POSITIVE_INFINITY;
    const db = parsePendingDateTime(b.dueAt)?.getTime() ?? Number.POSITIVE_INFINITY;
    return da - db;
  });
}

export function hasPendingFilters(
  search: string,
  statusFilter: 'all' | PendingStatus,
  highPriorityOnly: boolean,
  dueWindow: DueWindowFilter,
): boolean {
  return (
    search.trim().length > 0 ||
    statusFilter !== 'all' ||
    highPriorityOnly ||
    dueWindow !== 'all'
  );
}

export function pendingRowAccent(row: PendingItem): string | undefined {
  if (row.priority === 'high' && row.status !== 'done') return 'border-l-4 border-l-red-500';
  return undefined;
}

export function buildSlaPanel(selected: PendingItem, now = new Date()): SlaPanelContent {
  const urg = getDueUrgency(selected.dueAt, now);
  const rel = formatDueRelativeLabel(selected.dueAt, now);
  if (urg === 'overdue') {
    return {
      title: 'Prazo em atraso',
      body: rel || 'Revise o prazo e atualize o status.',
      accent: 'text-red-700',
    };
  }
  if (urg === 'today') {
    return {
      title: 'Vence hoje',
      body: rel || 'Priorize o encerramento ainda hoje.',
      accent: 'text-amber-700',
    };
  }
  return {
    title: 'Prazo dentro do planejado',
    body: rel || 'Acompanhe conforme o fluxo padrão.',
    accent: 'text-emerald-800',
  };
}
