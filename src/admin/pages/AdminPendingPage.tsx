import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileSearch,
  FileText,
  KeyRound,
  Link2,
  PauseCircle,
  Wallet,
  X,
} from 'lucide-react';
import { Badge } from '../../app/components/ui/badge';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../app/components/ui/card';
import { FilterBar } from '../components/filters/FilterBar';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable, type DataTableColumn } from '../components/tables/DataTable';
import {
  formatDueRelativeLabel,
  formatPendingDateTimeDisplay,
  getDueUrgency,
  getPendingSummary,
  listPendingItems,
  parsePendingDateTime,
  pendingTypeLabels,
  type DueUrgency,
  type PendingItem,
  type PendingPriority,
  type PendingStatus,
  type PendingType,
} from '../services/pendingService';

const priorityMeta: Record<PendingPriority, { label: string; color: string; bg: string }> = {
  high: { label: 'Crítica', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
  medium: { label: 'Média', color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)' },
  low: { label: 'Baixa', color: '#6B5D53', bg: 'rgba(107, 93, 83, 0.1)' },
};

const statusMeta: Record<PendingStatus, { label: string; color: string; bg: string }> = {
  open: { label: 'Aberta', color: '#4A3728', bg: 'rgba(74, 55, 40, 0.08)' },
  'in-progress': { label: 'Em andamento', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' },
  approval: { label: 'Aprovação', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)' },
  blocked: { label: 'Bloqueada', color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)' },
  done: { label: 'Concluída', color: '#047857', bg: 'rgba(4, 120, 87, 0.1)' },
};

const typeIcons: Record<PendingType, React.ReactNode> = {
  integration: <Link2 className="size-3.5 shrink-0" />,
  document: <FileText className="size-3.5 shrink-0" />,
  finance: <Wallet className="size-3.5 shrink-0" />,
  schedule: <CalendarClock className="size-3.5 shrink-0" />,
  access: <KeyRound className="size-3.5 shrink-0" />,
};

const urgencyChipMeta: Record<DueUrgency, { label: string; color: string; bg: string } | null> = {
  overdue: { label: 'Atrasado', color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.12)' },
  today: { label: 'Vence hoje', color: '#c2410c', bg: 'rgba(194, 65, 12, 0.12)' },
  soon: { label: 'Breve', color: '#a16207', bg: 'rgba(161, 98, 7, 0.12)' },
  ok: null,
};

const prioOrder: Record<PendingPriority, number> = { high: 0, medium: 1, low: 2 };

function PriorityBadge({ priority }: { priority: PendingPriority }) {
  const meta = priorityMeta[priority];
  return (
    <Badge variant="outline" style={{ color: meta.color, borderColor: meta.color, background: meta.bg }}>
      {meta.label}
    </Badge>
  );
}

function StatusBadge({ status }: { status: PendingStatus }) {
  const meta = statusMeta[status];
  return (
    <Badge variant="outline" style={{ color: meta.color, borderColor: meta.color, background: meta.bg }}>
      {meta.label}
    </Badge>
  );
}

type KpiHighlight = 'critical' | 'inProgress' | 'approval' | 'blocked' | null;

type DueWindowFilter = 'all' | 'today' | 'overdue';

export function AdminPendingPage() {
  const allRows = useMemo(() => listPendingItems(), []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PendingStatus>('all');
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const [dueWindow, setDueWindow] = useState<DueWindowFilter>('all');
  const [kpiHighlight, setKpiHighlight] = useState<KpiHighlight>(null);
  const [selected, setSelected] = useState<PendingItem | null>(allRows[0] ?? null);

  const summaryGlobal = useMemo(() => getPendingSummary(allRows), [allRows]);

  const dueCounts = (() => {
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
  })();

  const filteredRows = useMemo(() => {
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
  }, [allRows, search, statusFilter, highPriorityOnly, dueWindow]);

  useEffect(() => {
    if (!selected) return;
    if (filteredRows.some((r) => r.id === selected.id)) return;
    setSelected(filteredRows[0] ?? null);
  }, [filteredRows, selected]);

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setHighPriorityOnly(false);
    setDueWindow('all');
    setKpiHighlight(null);
  }

  function onStatusFilterChange(value: string) {
    setStatusFilter(value as 'all' | PendingStatus);
    setHighPriorityOnly(false);
    setKpiHighlight(null);
  }

  function selectKpi(kpi: 'critical' | 'inProgress' | 'approval' | 'blocked') {
    setDueWindow('all');
    setKpiHighlight(kpi);
    setHighPriorityOnly(kpi === 'critical');
    if (kpi === 'critical') {
      setStatusFilter('all');
      return;
    }
    setHighPriorityOnly(false);
    if (kpi === 'inProgress') setStatusFilter('in-progress');
    if (kpi === 'approval') setStatusFilter('approval');
    if (kpi === 'blocked') setStatusFilter('blocked');
  }

  const columns: DataTableColumn<PendingItem>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className="font-semibold">{row.id}</span> },
    { key: 'title', header: 'Pendência', render: (row) => row.title },
    {
      key: 'type',
      header: 'Tipo',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: '#4A3728' }}>
          <span className="text-[#6B5D53]" aria-hidden>
            {typeIcons[row.type]}
          </span>
          {pendingTypeLabels[row.type]}
        </span>
      ),
    },
    { key: 'owner', header: 'Responsável', render: (row) => row.owner },
    {
      key: 'dueAt',
      header: 'Prazo',
      render: (row) => {
        const urg = getDueUrgency(row.dueAt, new Date());
        const chip = urgencyChipMeta[urg];
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-sm tabular-nums">{formatPendingDateTimeDisplay(row.dueAt)}</span>
            {chip ? (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0" style={{ color: chip.color, borderColor: chip.color, background: chip.bg }}>
                {chip.label}
              </Badge>
            ) : null}
          </div>
        );
      },
    },
    { key: 'priority', header: 'Prioridade', render: (row) => <PriorityBadge priority={row.priority} /> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  const hasActiveFilters =
    search.trim().length > 0 ||
    statusFilter !== 'all' ||
    highPriorityOnly ||
    dueWindow !== 'all';

  const slaPanel = selected
    ? (() => {
        const now = new Date();
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
      })()
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pendências"
        description="Central de alertas críticos, aprovações e pendências operacionais. Use os cards e chips para triar por prioridade, status e prazo."
      />

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => selectKpi('critical')}
          className={`text-left rounded-xl transition-[box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]/40 ${
            kpiHighlight === 'critical' ? 'ring-2 ring-[#FFA500]/60' : ''
          }`}
        >
          <Card className="border-2 h-full cursor-pointer hover:bg-[#FFFBF0]/80" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardContent className="pt-5 space-y-1">
              <p className="text-xs uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                Críticas
              </p>
              <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>
                {summaryGlobal.critical}
              </p>
            </CardContent>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => selectKpi('inProgress')}
          className={`text-left rounded-xl transition-[box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]/40 ${
            kpiHighlight === 'inProgress' ? 'ring-2 ring-[#FFA500]/60' : ''
          }`}
        >
          <Card className="border-2 h-full cursor-pointer hover:bg-[#FFFBF0]/80" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardContent className="pt-5 space-y-1">
              <p className="text-xs uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                Em andamento
              </p>
              <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>
                {summaryGlobal.inProgress}
              </p>
            </CardContent>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => selectKpi('approval')}
          className={`text-left rounded-xl transition-[box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]/40 ${
            kpiHighlight === 'approval' ? 'ring-2 ring-[#FFA500]/60' : ''
          }`}
        >
          <Card className="border-2 h-full cursor-pointer hover:bg-[#FFFBF0]/80" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardContent className="pt-5 space-y-1">
              <p className="text-xs uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                Aprovações
              </p>
              <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>
                {summaryGlobal.approvals}
              </p>
            </CardContent>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => selectKpi('blocked')}
          className={`text-left rounded-xl transition-[box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]/40 ${
            kpiHighlight === 'blocked' ? 'ring-2 ring-[#FFA500]/60' : ''
          }`}
        >
          <Card className="border-2 h-full cursor-pointer hover:bg-[#FFFBF0]/80" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardContent className="pt-5 space-y-1">
              <p className="text-xs uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                Bloqueadas
              </p>
              <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>
                {summaryGlobal.blocked}
              </p>
            </CardContent>
          </Card>
        </button>
      </section>

      <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
        <CardContent className="pt-6 space-y-4">
          <FilterBar
            searchPlaceholder="Buscar por ID, título, responsável..."
            searchValue={search}
            onSearchChange={(v) => {
              setSearch(v);
              setKpiHighlight(null);
            }}
            filterValue={statusFilter}
            onFilterChange={onStatusFilterChange}
            filterLabel="Status"
            options={[
              { label: 'Todos os status', value: 'all' },
              { label: 'Aberta', value: 'open' },
              { label: 'Em andamento', value: 'in-progress' },
              { label: 'Aprovação', value: 'approval' },
              { label: 'Bloqueada', value: 'blocked' },
              { label: 'Concluída', value: 'done' },
            ]}
          />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wide mr-1" style={{ color: '#6B5D53' }}>
              Prazo
            </span>
            <Button
              type="button"
              size="sm"
              variant={dueWindow === 'today' ? 'default' : 'outline'}
              className="h-8 text-xs"
              style={
                dueWindow === 'today'
                  ? { background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff' }
                  : { borderColor: 'rgba(255, 165, 0, 0.35)' }
              }
              onClick={() => {
                setDueWindow((d) => (d === 'today' ? 'all' : 'today'));
                setKpiHighlight(null);
                setHighPriorityOnly(false);
              }}
            >
              Vence hoje ({dueCounts.today})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={dueWindow === 'overdue' ? 'default' : 'outline'}
              className="h-8 text-xs"
              style={
                dueWindow === 'overdue'
                  ? { background: 'linear-gradient(135deg, #b91c1c, #991b1b)', color: '#fff' }
                  : { borderColor: 'rgba(255, 165, 0, 0.35)' }
              }
              onClick={() => {
                setDueWindow((d) => (d === 'overdue' ? 'all' : 'overdue'));
                setKpiHighlight(null);
                setHighPriorityOnly(false);
              }}
            >
              Atrasadas ({dueCounts.overdue})
            </Button>
            {hasActiveFilters ? (
              <Button type="button" variant="ghost" size="sm" className="h-8 text-xs ml-auto" onClick={clearFilters}>
                Limpar filtros
              </Button>
            ) : null}
          </div>

          {filteredRows.length > 0 ? (
            <div className={`grid gap-4 ${selected ? 'xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
              <DataTable
                rows={filteredRows}
                columns={columns}
                rowKey={(row) => row.id}
                onRowClick={setSelected}
                selectedRowKey={selected?.id ?? null}
                getRowClassName={(row) =>
                  row.priority === 'high' && row.status !== 'done' ? 'border-l-4 border-l-red-500' : undefined
                }
              />

              {selected ? (
                <Card className="border-2 h-fit xl:sticky xl:top-24" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
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
                      <Button type="button" size="icon" variant="ghost" className="size-8" onClick={() => setSelected(null)}>
                        <X className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {slaPanel ? (
                      <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFF8E7' }}>
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

                    <div className="rounded-lg border p-3 text-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
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
              ) : null}
            </div>
          ) : (
            <div
              className="rounded-xl border p-8 text-center"
              style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FAFAFA' }}
            >
              <div
                className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              >
                <FileSearch className="size-5 text-[#FFA500]" />
              </div>
              <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
                Nenhuma pendência encontrada
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
                Ajuste os filtros ou limpe a busca para ver novamente a lista.
              </p>
              {hasActiveFilters ? (
                <Button type="button" className="mt-4" variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
