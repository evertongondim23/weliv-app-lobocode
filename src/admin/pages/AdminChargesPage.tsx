import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  Copy,
  FileSearch,
  Handshake,
  Mail,
  Phone,
  Receipt,
  Scale,
  ShieldAlert,
  Timer,
  TrendingDown,
  Wallet,
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
import { AdminFinancialSubnav } from '../components/finance/AdminFinancialSubnav';
import { PaymentMethodCell } from '../components/finance/PaymentMethodCell';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable, type DataTableColumn } from '../components/tables/DataTable';
import { getChargePortfolioSummary, listCharges, type ChargeRow } from '../services/charge.service';
import {
  getDefaultRiskSummary,
  listDefaultCases,
  type AdminDefaultCase,
  type DefaultRiskLevel,
  type PlanKind,
  type RecoveryStage,
} from '../services/defaultRisk.service';
import { formatBRL } from '../utils/formatCurrency';
import { financeBorderStyle, financeFilterChipStyle, financePrimaryActionStyle } from '../utils/financeUi';

type ActiveTab = 'charges' | 'recovery';

// ── Status de cobrança ────────────────────────────────────────────────────────
const chargeStatusConfig: Record<ChargeRow['status'], { label: string; color: string; bg: string; border: string }> = {
  pendente: { label: 'Pendente', color: '#a16207', bg: 'rgba(161, 98, 7, 0.1)', border: 'rgba(161, 98, 7, 0.35)' },
  pago: { label: 'Pago', color: '#047857', bg: 'rgba(4, 120, 87, 0.1)', border: 'rgba(4, 120, 87, 0.35)' },
  atrasado: { label: 'Atrasado', color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)', border: 'rgba(185, 28, 28, 0.35)' },
};

function ChargeStatusBadge({ status }: { status: ChargeRow['status'] }) {
  const c = chargeStatusConfig[status];
  return <Badge variant="outline" style={{ color: c.color, background: c.bg, borderColor: c.border }}>{c.label}</Badge>;
}

function chargeRowAccent(row: ChargeRow): string | undefined {
  if (row.status === 'atrasado') return 'border-l-4 border-l-red-500';
  if (row.status === 'pendente') return 'border-l-4 border-l-amber-500';
  return undefined;
}

// ── Risco de inadimplência ────────────────────────────────────────────────────
const riskConfig: Record<DefaultRiskLevel, { label: string; color: string; bg: string; border: string }> = {
  baixo: { label: 'Risco baixo', color: '#475569', bg: 'rgba(71, 85, 105, 0.1)', border: 'rgba(71, 85, 105, 0.35)' },
  moderado: { label: 'Moderado', color: '#a16207', bg: 'rgba(161, 98, 7, 0.1)', border: 'rgba(161, 98, 7, 0.35)' },
  alto: { label: 'Alto', color: '#c2410c', bg: 'rgba(194, 65, 12, 0.12)', border: 'rgba(194, 65, 12, 0.4)' },
  critico: { label: 'Crítico', color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.12)', border: 'rgba(185, 28, 28, 0.4)' },
};

const stageLabels: Record<RecoveryStage, string> = {
  cobranca_ativa: 'Cobrança ativa',
  negociacao: 'Negociação',
  juridico: 'Jurídico',
  suspenso: 'Suspenso',
};

const riskSort: Record<DefaultRiskLevel, number> = { critico: 0, alto: 1, moderado: 2, baixo: 3 };

function RiskBadge({ level }: { level: DefaultRiskLevel }) {
  const c = riskConfig[level];
  return <Badge variant="outline" style={{ color: c.color, background: c.bg, borderColor: c.border }}>{c.label}</Badge>;
}

function recoveryRowAccent(row: AdminDefaultCase): string | undefined {
  if (row.riskLevel === 'critico') return 'border-l-4 border-l-red-600';
  if (row.riskLevel === 'alto') return 'border-l-4 border-l-orange-600';
  if (row.riskLevel === 'moderado') return 'border-l-4 border-l-amber-500';
  return 'border-l-4 border-l-slate-400';
}

// ── Componente principal ──────────────────────────────────────────────────────
export function AdminChargesPage() {
  const [tab, setTab] = useState<ActiveTab>('charges');

  // ── dados de cobranças ────────────────────────────────────────────────────
  const allCharges = useMemo(() => listCharges(), []);
  const chargeSummary = useMemo(() => getChargePortfolioSummary(allCharges), [allCharges]);

  const [chargeSearch, setChargeSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ChargeRow['status']>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | ChargeRow['method']>('all');
  const [selectedCharge, setSelectedCharge] = useState<ChargeRow | null>(null);

  const filteredCharges = useMemo(() => {
    const q = chargeSearch.trim().toLowerCase();
    const rank: Record<ChargeRow['status'], number> = { atrasado: 0, pendente: 1, pago: 2 };
    return allCharges
      .filter((row) => {
        const hay = `${row.id} ${row.patient} ${row.amount} ${row.unit} ${row.appointmentRef ?? ''} ${row.email ?? ''}`.toLowerCase();
        return (
          (q.length === 0 || hay.includes(q)) &&
          (statusFilter === 'all' || row.status === statusFilter) &&
          (methodFilter === 'all' || row.method === methodFilter)
        );
      })
      .sort((a, b) => rank[a.status] - rank[b.status] || a.dueDateIso.localeCompare(b.dueDateIso));
  }, [allCharges, chargeSearch, statusFilter, methodFilter]);

  useEffect(() => {
    setSelectedCharge((prev) => {
      if (!prev || !filteredCharges.some((r) => r.id === prev.id)) return filteredCharges[0] ?? null;
      return prev;
    });
  }, [filteredCharges]);

  // ── dados de recuperação ─────────────────────────────────────────────────
  const allCases = useMemo(() => listDefaultCases(), []);
  const riskSummary = useMemo(() => getDefaultRiskSummary(allCases), [allCases]);
  const criticalVolume = useMemo(() => allCases.filter((c) => c.riskLevel === 'critico').reduce((s, c) => s + c.overdueAmount, 0), [allCases]);

  const [recoverySearch, setRecoverySearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | DefaultRiskLevel>('all');
  const [planFilter, setPlanFilter] = useState<'all' | PlanKind>('all');
  const [stageFilter, setStageFilter] = useState<'all' | RecoveryStage>('all');
  const [selectedCase, setSelectedCase] = useState<AdminDefaultCase | null>(null);

  const filteredCases = useMemo(() => {
    const q = recoverySearch.trim().toLowerCase();
    return allCases
      .filter((row) => {
        const hay = `${row.id} ${row.chargeRef} ${row.patientName} ${row.planLabel} ${row.unit}`.toLowerCase();
        return (
          (q.length === 0 || hay.includes(q)) &&
          (riskFilter === 'all' || row.riskLevel === riskFilter) &&
          (planFilter === 'all' || row.planKind === planFilter) &&
          (stageFilter === 'all' || row.recoveryStage === stageFilter)
        );
      })
      .sort((a, b) => riskSort[a.riskLevel] - riskSort[b.riskLevel] || b.daysPastDue - a.daysPastDue);
  }, [allCases, recoverySearch, riskFilter, planFilter, stageFilter]);

  useEffect(() => {
    setSelectedCase((prev) => {
      if (!prev || !filteredCases.some((r) => r.id === prev.id)) return filteredCases[0] ?? null;
      return prev;
    });
  }, [filteredCases]);

  // ── colunas ───────────────────────────────────────────────────────────────
  const chargeColumns: DataTableColumn<ChargeRow>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className="font-semibold tabular-nums">{row.id}</span> },
    { key: 'patient', header: 'Paciente', className: 'min-w-[140px]', render: (row) => row.patient },
    { key: 'amount', header: 'Valor', render: (row) => <span className="font-semibold tabular-nums">{row.amount}</span> },
    { key: 'due', header: 'Vencimento', render: (row) => <span className="tabular-nums text-sm">{row.dueDate}</span> },
    { key: 'method', header: 'Meio', render: (row) => <PaymentMethodCell method={row.method} /> },
    { key: 'unit', header: 'Unidade', className: 'max-w-[140px]', render: (row) => <span className="truncate block text-sm" title={row.unit}>{row.unit}</span> },
    { key: 'status', header: 'Status', render: (row) => <ChargeStatusBadge status={row.status} /> },
  ];

  const recoveryColumns: DataTableColumn<AdminDefaultCase>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className="font-semibold tabular-nums">{row.id}</span> },
    { key: 'patient', header: 'Paciente', className: 'min-w-[130px]', render: (row) => row.patientName },
    {
      key: 'plan',
      header: 'Plano',
      render: (row) => (
        <span className="text-sm">
          <span className="font-medium" style={{ color: '#4A3728' }}>{row.planLabel}</span>
          <span className="block text-[11px] capitalize" style={{ color: '#6B5D53' }}>{row.planKind}</span>
        </span>
      ),
    },
    { key: 'amt', header: 'Vencido', render: (row) => <span className="font-semibold tabular-nums text-red-900/90">{formatBRL(row.overdueAmount)}</span> },
    {
      key: 'days',
      header: 'Dias',
      render: (row) => <span className="tabular-nums font-medium" style={{ color: row.daysPastDue > 30 ? '#b91c1c' : '#4A3728' }}>{row.daysPastDue}d</span>,
    },
    { key: 'risk', header: 'Risco', render: (row) => <RiskBadge level={row.riskLevel} /> },
    { key: 'stage', header: 'Etapa', render: (row) => <span className="text-xs" style={{ color: '#6B5D53' }}>{stageLabels[row.recoveryStage]}</span> },
  ];

  const hasChargeFilters = chargeSearch.trim().length > 0 || statusFilter !== 'all' || methodFilter !== 'all';
  const hasRecoveryFilters = recoverySearch.trim().length > 0 || riskFilter !== 'all' || planFilter !== 'all' || stageFilter !== 'all';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cobranças e Inadimplência"
        description="Gerencie a carteira de cobranças e o ciclo de recuperação. Alterne entre a visão operacional e os casos em recuperação ativa."
      />

      <AdminFinancialSubnav />

      {/* KPIs unificados — 4 métricas, sem duplicação */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Wallet className="size-3.5" />
              Em aberto
            </p>
            <p className="text-xl font-bold tabular-nums" style={{ color: '#4A3728' }}>{formatBRL(chargeSummary.openTotal)}</p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>{chargeSummary.openCount} cobrança(s) não liquidada(s)</p>
          </CardContent>
        </Card>
        <button
          type="button"
          onClick={() => { setTab('charges'); setStatusFilter('atrasado'); }}
          className={`text-left rounded-xl transition-[box-shadow] ${tab === 'charges' && statusFilter === 'atrasado' ? 'ring-2 ring-red-400/60' : ''}`}
        >
          <Card className="border-2 h-full cursor-pointer hover:bg-[#FFF5F5]" style={financeBorderStyle}>
            <CardContent className="pt-5 pb-4 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
                <TrendingDown className="size-3.5 text-red-600" />
                Inadimplência
              </p>
              <p className="text-xl font-bold tabular-nums text-red-700">{formatBRL(chargeSummary.overdueTotal)}</p>
              <p className="text-xs" style={{ color: '#6B5D53' }}>{chargeSummary.overdueCount} em atraso</p>
            </CardContent>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => { setTab('recovery'); setRiskFilter('critico'); }}
          className={`text-left rounded-xl transition-[box-shadow] ${tab === 'recovery' && riskFilter === 'critico' ? 'ring-2 ring-red-500/60' : ''}`}
        >
          <Card className="border-2 h-full cursor-pointer hover:bg-[#FFF5F5]" style={financeBorderStyle}>
            <CardContent className="pt-5 pb-4 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
                <ShieldAlert className="size-3.5 text-red-600" />
                Risco crítico
              </p>
              <p className="text-xl font-bold tabular-nums text-red-700">{riskSummary.criticalCount}</p>
              <p className="text-xs" style={{ color: '#6B5D53' }}>{formatBRL(criticalVolume)} em exposição</p>
            </CardContent>
          </Card>
        </button>
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Timer className="size-3.5" />
              Atraso médio
            </p>
            <p className="text-xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
              {riskSummary.avgDaysPastDue}<span className="text-sm ml-1">dias</span>
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>Idade média dos casos vencidos</p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-2" style={financeBorderStyle}>
        {/* Abas */}
        <div className="flex border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.18)' }}>
          {([
            { id: 'charges' as const, label: 'Cobranças', count: allCharges.length },
            { id: 'recovery' as const, label: 'Recuperação', count: riskSummary.caseCount },
          ] as const).map(({ id, label, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={[
                'px-5 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                tab === id
                  ? 'border-[#FFA500] text-[#4A3728]'
                  : 'border-transparent text-[#6B5D53] hover:text-[#4A3728]',
              ].join(' ')}
            >
              {label}
              <span className={['ml-1.5 text-xs rounded-full px-1.5 py-0.5', tab === id ? 'bg-[#FFA500]/15 text-[#4A3728]' : 'bg-slate-100 text-[#6B5D53]'].join(' ')}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <CardContent className="pt-5 space-y-4">

          {tab === 'charges' ? (
            <>
              {/* filtros de cobranças */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                <div className="relative flex-1 min-w-0">
                  <FileSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5D53]" />
                  <Input value={chargeSearch} onChange={(e) => setChargeSearch(e.target.value)} placeholder="Paciente, ID, unidade ou e-mail..." className="pl-9 border-2 bg-white" style={financeBorderStyle} />
                </div>
                <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[360px]">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Status</p>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                      <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="atrasado">{chargeStatusConfig.atrasado.label}</SelectItem>
                        <SelectItem value="pendente">{chargeStatusConfig.pendente.label}</SelectItem>
                        <SelectItem value="pago">{chargeStatusConfig.pago.label}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Meio</p>
                    <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as typeof methodFilter)}>
                      <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}><SelectValue placeholder="Meio" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="cartão">Cartão</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardDescription>{filteredCharges.length} registro(s) · atrasados primeiro</CardDescription>
                {hasChargeFilters ? (
                  <Button type="button" variant="ghost" className="h-8 text-[#6B5D53]" onClick={() => { setChargeSearch(''); setStatusFilter('all'); setMethodFilter('all'); }}>
                    Limpar filtros
                  </Button>
                ) : null}
              </div>

              {hasChargeFilters ? (
                <div className="flex flex-wrap gap-2">
                  {chargeSearch.trim() ? <button type="button" onClick={() => setChargeSearch('')} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs" style={financeFilterChipStyle}>Busca: {chargeSearch.trim()} <span>×</span></button> : null}
                  {statusFilter !== 'all' ? <button type="button" onClick={() => setStatusFilter('all')} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs" style={financeFilterChipStyle}>Status: {chargeStatusConfig[statusFilter].label} <span>×</span></button> : null}
                  {methodFilter !== 'all' ? <button type="button" onClick={() => setMethodFilter('all')} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs" style={financeFilterChipStyle}>Meio: {methodFilter === 'pix' ? 'PIX' : methodFilter === 'boleto' ? 'Boleto' : 'Cartão'} <span>×</span></button> : null}
                </div>
              ) : null}

              {filteredCharges.length === 0 ? (
                <EmptyState message="Nenhuma cobrança encontrada" hint="Ajuste busca, status ou meio de pagamento." onClear={hasChargeFilters ? () => { setChargeSearch(''); setStatusFilter('all'); setMethodFilter('all'); } : undefined} />
              ) : (
                <div className={`grid gap-4 ${selectedCharge ? 'xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
                  <DataTable rows={filteredCharges} columns={chargeColumns} rowKey={(row) => row.id} onRowClick={setSelectedCharge} selectedRowKey={selectedCharge?.id ?? null} getRowClassName={chargeRowAccent} />
                  {selectedCharge ? (
                    <ChargeDetailPanel charge={selectedCharge} onClose={() => setSelectedCharge(null)} />
                  ) : null}
                </div>
              )}
            </>
          ) : (
            <>
              {/* filtros de recuperação */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                <div className="relative flex-1 min-w-0">
                  <FileSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5D53]" />
                  <Input value={recoverySearch} onChange={(e) => setRecoverySearch(e.target.value)} placeholder="Paciente, ID caso, plano ou unidade..." className="pl-9 border-2 bg-white" style={financeBorderStyle} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:min-w-[520px]">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Risco</p>
                    <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as typeof riskFilter)}>
                      <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}><SelectValue placeholder="Risco" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {(['critico', 'alto', 'moderado', 'baixo'] as const).map((r) => <SelectItem key={r} value={r}>{riskConfig[r].label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Plano</p>
                    <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as typeof planFilter)}>
                      <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}><SelectValue placeholder="Plano" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="particular">Particular</SelectItem>
                        <SelectItem value="convenio">Convênio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Etapa</p>
                    <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as typeof stageFilter)}>
                      <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}><SelectValue placeholder="Etapa" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {(Object.entries(stageLabels) as [RecoveryStage, string][]).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardDescription>{filteredCases.length} caso(s) · críticos primeiro</CardDescription>
                {hasRecoveryFilters ? (
                  <Button type="button" variant="ghost" className="h-8 text-[#6B5D53]" onClick={() => { setRecoverySearch(''); setRiskFilter('all'); setPlanFilter('all'); setStageFilter('all'); }}>
                    Limpar filtros
                  </Button>
                ) : null}
              </div>

              {hasRecoveryFilters ? (
                <div className="flex flex-wrap gap-2">
                  {recoverySearch.trim() ? <button type="button" onClick={() => setRecoverySearch('')} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs" style={financeFilterChipStyle}>Busca: {recoverySearch.trim()} <span>×</span></button> : null}
                  {riskFilter !== 'all' ? <button type="button" onClick={() => setRiskFilter('all')} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs" style={financeFilterChipStyle}>Risco: {riskConfig[riskFilter].label} <span>×</span></button> : null}
                  {planFilter !== 'all' ? <button type="button" onClick={() => setPlanFilter('all')} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs" style={financeFilterChipStyle}>Plano: {planFilter === 'particular' ? 'Particular' : 'Convênio'} <span>×</span></button> : null}
                  {stageFilter !== 'all' ? <button type="button" onClick={() => setStageFilter('all')} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs" style={financeFilterChipStyle}>Etapa: {stageLabels[stageFilter]} <span>×</span></button> : null}
                </div>
              ) : null}

              {filteredCases.length === 0 ? (
                <EmptyState message="Nenhum caso encontrado" hint="Ajuste risco, plano ou etapa de recuperação." onClear={hasRecoveryFilters ? () => { setRecoverySearch(''); setRiskFilter('all'); setPlanFilter('all'); setStageFilter('all'); } : undefined} />
              ) : (
                <div className={`grid gap-4 ${selectedCase ? 'xl:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
                  <DataTable rows={filteredCases} columns={recoveryColumns} rowKey={(row) => row.id} onRowClick={setSelectedCase} selectedRowKey={selectedCase?.id ?? null} getRowClassName={recoveryRowAccent} />
                  {selectedCase ? (
                    <RecoveryDetailPanel case_={selectedCase} onClose={() => setSelectedCase(null)} />
                  ) : null}
                </div>
              )}
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

// ── Painéis laterais ──────────────────────────────────────────────────────────
function EmptyState({ message, hint, onClear }: { message: string; hint: string; onClear?: () => void }) {
  return (
    <div className="rounded-xl border p-10 text-center" style={{ ...financeBorderStyle, background: '#FAFAFA' }}>
      <div className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3" style={financeBorderStyle}>
        <FileSearch className="size-5 text-[#FFA500]" />
      </div>
      <p className="text-sm font-medium" style={{ color: '#4A3728' }}>{message}</p>
      <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>{hint}</p>
      {onClear ? <Button type="button" variant="outline" className="mt-4 border-2" style={financeBorderStyle} onClick={onClear}>Limpar filtros</Button> : null}
    </div>
  );
}

function ChargeDetailPanel({ charge, onClose }: { charge: ChargeRow; onClose: () => void }) {
  return (
    <Card className="border-2 h-fit xl:sticky xl:top-24" style={financeBorderStyle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg" style={{ color: '#4A3728' }}>{charge.id}</CardTitle>
              {(() => { const c = chargeStatusConfig[charge.status]; return <Badge variant="outline" style={{ color: c.color, background: c.bg, borderColor: c.border }}>{c.label}</Badge>; })()}
            </div>
            <CardDescription>{charge.patient}</CardDescription>
          </div>
          <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" onClick={onClose}><X className="size-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="rounded-xl border-2 px-4 py-4 text-center" style={{ borderColor: 'rgba(255, 165, 0, 0.35)', background: 'linear-gradient(180deg, #FFFBF0 0%, #FFF8E7 100%)' }}>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#6B5D53' }}>Valor</p>
          <p className="text-2xl font-bold tabular-nums mt-1" style={{ color: '#4A3728' }}>{charge.amount}</p>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs" style={{ color: '#6B5D53' }}>
            <Calendar className="size-3.5" />
            Vence em {charge.dueDate}
          </div>
        </div>

        {charge.status === 'atrasado' ? (
          <div className="rounded-lg border px-3 py-2.5 flex gap-2 items-start text-xs" style={{ borderColor: 'rgba(185, 28, 28, 0.35)', background: 'rgba(185, 28, 28, 0.06)' }}>
            <AlertTriangle className="size-4 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Cobrança em atraso</p>
              <p className="text-red-800/90">Inclua na fila de recuperação ou acesse a aba Recuperação.</p>
            </div>
          </div>
        ) : null}

        <div className="space-y-2.5">
          <PaymentMethodCell method={charge.method} />
          <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}><Building2 className="size-4 shrink-0" /><span>{charge.unit}</span></div>
          {charge.appointmentRef ? <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}><Receipt className="size-4 shrink-0" /><span>Consulta {charge.appointmentRef}</span></div> : null}
          {charge.email ? <div className="flex items-center gap-2 min-w-0" style={{ color: '#6B5D53' }}><Mail className="size-4 shrink-0" /><span className="truncate">{charge.email}</span></div> : null}
          {charge.lastReminderAt ? <p className="text-xs" style={{ color: '#6B5D53' }}>Último lembrete: <span className="font-medium">{charge.lastReminderAt}</span></p> : null}
          {charge.paidAt ? <p className="text-xs text-emerald-700">Pago em <span className="font-medium">{charge.paidAt}</span></p> : null}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Button type="button" variant="outline" className="border-2 justify-start gap-2" style={financeBorderStyle} onClick={() => { navigator.clipboard.writeText(charge.id); toast.success('ID copiado.'); }}>
            <Copy className="size-4" />Copiar ID
          </Button>
          <Button type="button" variant="outline" className="border-2 justify-start" style={financeBorderStyle} disabled={charge.status === 'pago'} onClick={() => toast.message('Demo', { description: 'Lembrete enfileirado.' })}>
            Enviar lembrete
          </Button>
          <Button type="button" className="text-white border-0 justify-start" style={financePrimaryActionStyle} disabled={charge.status === 'pago'} onClick={() => toast.success('Demo: pagamento registrado.')}>
            Registrar pagamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RecoveryDetailPanel({ case_: c, onClose }: { case_: AdminDefaultCase; onClose: () => void }) {
  const riskC = riskConfig[c.riskLevel];
  const isCritical = c.riskLevel === 'critico' || c.riskLevel === 'alto';
  return (
    <Card className="border-2 h-fit xl:sticky xl:top-24" style={financeBorderStyle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg" style={{ color: '#4A3728' }}>{c.id}</CardTitle>
              <Badge variant="outline" style={{ color: riskC.color, background: riskC.bg, borderColor: riskC.border }}>{riskC.label}</Badge>
            </div>
            <CardDescription>{c.patientName} · {c.planLabel}</CardDescription>
          </div>
          <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" onClick={onClose}><X className="size-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="rounded-xl border-2 px-4 py-4 text-center" style={{ borderColor: 'rgba(185, 28, 28, 0.28)', background: 'linear-gradient(180deg, #FFF5F5 0%, #FFFBFB 100%)' }}>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#6B5D53' }}>Valor vencido</p>
          <p className="text-2xl font-bold tabular-nums mt-1 text-red-900">{formatBRL(c.overdueAmount)}</p>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs" style={{ color: '#6B5D53' }}>
            <Timer className="size-3.5" />
            <span><span className="font-semibold text-[#4A3728]">{c.daysPastDue} dias</span> desde {c.oldestDueDate}</span>
          </div>
        </div>

        {isCritical ? (
          <div className="rounded-lg border px-3 py-2.5 flex gap-2 items-start text-xs" style={{ borderColor: 'rgba(185, 28, 28, 0.3)', background: 'rgba(185, 28, 28, 0.06)' }}>
            <AlertTriangle className="size-4 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Ação prioritária</p>
              <p className="text-red-900/85">{c.nextBestAction}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border px-3 py-2.5 text-xs" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFFBF0' }}>
            <p className="font-semibold mb-1" style={{ color: '#4A3728' }}>Próximo passo</p>
            <p style={{ color: '#6B5D53' }}>{c.nextBestAction}</p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs" style={financeBorderStyle}>{stageLabels[c.recoveryStage]}</Badge>
            <Badge variant="secondary" className="text-xs bg-white capitalize">Cobrança {c.chargeRef}</Badge>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}><Building2 className="size-4 shrink-0" />{c.unit}</div>
          <div className="text-xs" style={{ color: '#6B5D53' }}>Último contato: <span className="font-medium text-[#4A3728]">{c.lastContactAt}</span></div>
          {c.notes ? <p className="text-xs rounded-lg border p-2" style={{ borderColor: 'rgba(255, 165, 0, 0.15)', color: '#6B5D53' }}>{c.notes}</p> : null}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Button type="button" variant="outline" className="border-2 justify-start gap-2" style={financeBorderStyle} onClick={() => toast.message('Demo', { description: 'Contato registrado.' })}>
            <Phone className="size-4" />Registrar contato
          </Button>
          <Button type="button" variant="outline" className="border-2 justify-start gap-2" style={financeBorderStyle} onClick={() => toast.message('Demo', { description: 'Proposta enviada.' })}>
            <Handshake className="size-4" />Propor acordo
          </Button>
          {c.planKind === 'convenio' ? (
            <Button type="button" variant="outline" className="border-2 justify-start gap-2" style={financeBorderStyle} onClick={() => toast.message('Demo', { description: 'Trilha de glosa aberta.' })}>
              <Scale className="size-4" />Acionar trilha convênio
            </Button>
          ) : null}
          <Button type="button" className="text-white border-0 justify-start" style={financePrimaryActionStyle} disabled={c.recoveryStage === 'juridico'} onClick={() => toast.success('Demo: escalado para jurídico.')}>
            Escalar para jurídico
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
