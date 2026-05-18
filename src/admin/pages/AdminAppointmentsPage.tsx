import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Phone,
  Stethoscope,
  User,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../app/components/ui/badge';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Input } from '../../app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../app/components/ui/select';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable, type DataTableColumn } from '../components/tables/DataTable';
import {
  ATTENDANCE_REFERENCE_DATE,
  getAttendanceDaySummary,
  listAdminAttendances,
  type AdminAttendance,
  type AttendanceSla,
  type AttendanceStatus,
} from '../services/attendance.service';

const border = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;
const primaryAction = { background: 'linear-gradient(135deg, #FFA500, #FF8C00)' } as const;

const statusLabels: Record<AttendanceStatus, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  checked_in: 'Check-in',
  in_progress: 'Em atendimento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'No-show',
};

const slaLabels: Record<AttendanceSla, { label: string; color: string; bg: string }> = {
  on_time: { label: 'No prazo', color: '#047857', bg: 'rgba(4, 120, 87, 0.1)' },
  at_risk: { label: 'Risco SLA', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' },
  breached: { label: 'SLA estourado', color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)' },
};

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const tone: Record<AttendanceStatus, { c: string; b: string }> = {
    scheduled: { c: '#6B5D53', b: 'rgba(107, 93, 83, 0.12)' },
    confirmed: { c: '#1d4ed8', b: 'rgba(29, 78, 216, 0.1)' },
    checked_in: { c: '#7c3aed', b: 'rgba(124, 58, 237, 0.12)' },
    in_progress: { c: '#c2410c', b: 'rgba(194, 65, 12, 0.12)' },
    completed: { c: '#047857', b: 'rgba(4, 120, 87, 0.1)' },
    cancelled: { c: '#64748b', b: 'rgba(100, 116, 139, 0.15)' },
    no_show: { c: '#b91c1c', b: 'rgba(185, 28, 28, 0.1)' },
  };
  const t = tone[status];
  return (
    <Badge variant="outline" style={{ color: t.c, borderColor: t.c, background: t.b }}>
      {statusLabels[status]}
    </Badge>
  );
}

function SlaBadge({ sla }: { sla: AttendanceSla }) {
  const m = slaLabels[sla];
  return (
    <Badge variant="outline" style={{ color: m.color, borderColor: m.color, background: m.bg }}>
      {m.label}
    </Badge>
  );
}

function formatDatePt(iso: string) {
  const [y, mo, d] = iso.split('-').map(Number);
  if (!y || !mo || !d) return iso;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(y, mo - 1, d)
  );
}

export function AdminAppointmentsPage() {
  const allRows = useMemo(() => listAdminAttendances(), []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus>('all');
  const [slaFilter, setSlaFilter] = useState<'all' | AttendanceSla>('all');
  const [selected, setSelected] = useState<AdminAttendance | null>(null);

  const daySummary = useMemo(
    () => getAttendanceDaySummary(allRows, ATTENDANCE_REFERENCE_DATE),
    [allRows]
  );

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRows.filter((row) => {
      const hay = `${row.id} ${row.patientName} ${row.professionalName} ${row.specialty} ${row.unit} ${row.channel}`.toLowerCase();
      const okSearch = q.length === 0 || hay.includes(q);
      const okStatus = statusFilter === 'all' || row.status === statusFilter;
      const okSla = slaFilter === 'all' || row.sla === slaFilter;
      return okSearch && okStatus && okSla;
    });
  }, [allRows, search, statusFilter, slaFilter]);

  useEffect(() => {
    if (filteredRows.length === 0) {
      setSelected(null);
      return;
    }
    setSelected((prev) => {
      if (prev && filteredRows.some((r) => r.id === prev.id)) return prev;
      return filteredRows[0];
    });
  }, [filteredRows]);

  const hasFilters = search.trim().length > 0 || statusFilter !== 'all' || slaFilter !== 'all';
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setSlaFilter('all');
  };

  const columns: DataTableColumn<AdminAttendance>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className="font-semibold tabular-nums">{row.id}</span> },
    { key: 'patient', header: 'Paciente', className: 'min-w-[140px]', render: (row) => row.patientName },
    { key: 'prof', header: 'Profissional', className: 'min-w-[140px]', render: (row) => row.professionalName },
    {
      key: 'when',
      header: 'Data / hora',
      render: (row) => (
        <span className="text-sm tabular-nums">
          {formatDatePt(row.date)} · {row.time}
        </span>
      ),
    },
    {
      key: 'channel',
      header: 'Modalidade',
      render: (row) => (
        <span className="capitalize text-sm" style={{ color: '#6B5D53' }}>
          {row.channel}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'sla', header: 'SLA', render: (row) => <SlaBadge sla={row.sla} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atendimentos"
        description="Listagem central com status em tempo de espera e SLA operacional. Use filtros para priorizar fila e riscos — detalhes abrem ao lado em desktop."
      />

      {/* KPIs: âncora visual antes da lista (decisão rápida sem rolar a tabela) */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-2" style={border}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <CalendarClock className="size-3.5" />
              No dia {formatDatePt(ATTENDANCE_REFERENCE_DATE)}
            </p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
              {daySummary.todayTotal}
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Atendimentos agendados nesta data
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={border}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Activity className="size-3.5" />
              Em fluxo
            </p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: '#c2410c' }}>
              {daySummary.inFlow}
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Check-in ou em atendimento
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={border}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <AlertTriangle className="size-3.5 text-amber-600" />
              SLA sob atenção
            </p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: '#b45309' }}>
              {daySummary.slaAttention}
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Risco ou atraso no dia
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={border}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              Concluídos
            </p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: '#047857' }}>
              {daySummary.completedOnRef}
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Encerrados com sucesso (dia ref.)
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-2" style={border}>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="relative flex-1 min-w-0">
              <FileSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5D53]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar paciente, profissional, ID, unidade..."
                className="pl-9 border-2 bg-white"
                style={border}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[440px]">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                  Status
                </p>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                  <SelectTrigger className="border-2 bg-white w-full" style={border}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {(Object.keys(statusLabels) as AttendanceStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                  SLA
                </p>
                <Select value={slaFilter} onValueChange={(v) => setSlaFilter(v as typeof slaFilter)}>
                  <SelectTrigger className="border-2 bg-white w-full" style={border}>
                    <SelectValue placeholder="SLA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="on_time">{slaLabels.on_time.label}</SelectItem>
                    <SelectItem value="at_risk">{slaLabels.at_risk.label}</SelectItem>
                    <SelectItem value="breached">{slaLabels.breached.label}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardDescription>
              {filteredRows.length} registro(s) · KPIs do topo referem-se ao dia{' '}
              <span className="font-medium">{formatDatePt(ATTENDANCE_REFERENCE_DATE)}</span>
            </CardDescription>
            {hasFilters ? (
              <Button type="button" variant="ghost" className="h-8 text-[#6B5D53]" onClick={clearFilters}>
                Limpar filtros
              </Button>
            ) : null}
          </div>

          {hasFilters ? (
            <div className="flex flex-wrap gap-2">
              {search.trim() ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.25)', color: '#4A3728', background: '#FFF8E7' }}
                >
                  Busca: {search.trim()}
                  <span style={{ color: '#6B5D53' }}>×</span>
                </button>
              ) : null}
              {statusFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.25)', color: '#4A3728', background: '#FFF8E7' }}
                >
                  Status: {statusLabels[statusFilter]}
                  <span style={{ color: '#6B5D53' }}>×</span>
                </button>
              ) : null}
              {slaFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setSlaFilter('all')}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.25)', color: '#4A3728', background: '#FFF8E7' }}
                >
                  SLA: {slaLabels[slaFilter].label}
                  <span style={{ color: '#6B5D53' }}>×</span>
                </button>
              ) : null}
            </div>
          ) : null}

          {filteredRows.length === 0 ? (
            <div
              className="rounded-xl border p-10 text-center"
              style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FAFAFA' }}
            >
              <div
                className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3"
                style={border}
              >
                <FileSearch className="size-5 text-[#FFA500]" />
              </div>
              <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
                Nenhum atendimento encontrado
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
                Ajuste busca ou filtros de status / SLA.
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 ${selected ? 'xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
              <DataTable
                rows={filteredRows}
                columns={columns}
                rowKey={(row) => row.id}
                onRowClick={setSelected}
                selectedRowKey={selected?.id ?? null}
              />

              {selected ? (
                <Card className="border-2 h-fit xl:sticky xl:top-24" style={border}>
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
                          {selected.patientName} · {formatDatePt(selected.date)} às {selected.time} (
                          {selected.channel})
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-8 shrink-0"
                        onClick={() => setSelected(null)}
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
                          Sinal: {selected.depositPaid ? 'confirmado' : 'pendente'}{' '}
                          <span className="text-xs">(demo)</span>
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
                          style={border}
                          onClick={() => toast.message('Demo', { description: 'Check-in registrado (simulado).' })}
                          disabled={['completed', 'cancelled', 'no_show'].includes(selected.status)}
                        >
                          Registrar check-in
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-2 justify-start"
                          style={border}
                          onClick={() =>
                            toast.message('Demo', { description: 'Timeline do atendimento abriria em módulo futuro.' })
                          }
                        >
                          Ver linha do tempo
                        </Button>
                        <Button type="button" className="text-white border-0 justify-start" style={primaryAction} onClick={() => toast.success('Demo: atendimento marcado como concluído.')}>
                          Encerrar atendimento
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
