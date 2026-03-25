import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  FileSearch,
  Handshake,
  Layers,
  Mail,
  Phone,
  Scale,
  ShieldAlert,
  Timer,
  User,
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
import { PageHeader } from '../components/common/PageHeader';
import { DataTable, type DataTableColumn } from '../components/tables/DataTable';
import {
  getDefaultRiskSummary,
  listDefaultCases,
  type AdminDefaultCase,
  type DefaultRiskLevel,
  type PlanKind,
  type RecoveryStage,
} from '../services/defaultRiskService';
import { formatBRL } from '../utils/formatCurrency';
import { financeBorderStyle, financeFilterChipStyle, financePrimaryActionStyle } from '../utils/financeUi';

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
  suspenso: 'Suspenso / pausa',
};

const riskSort: Record<DefaultRiskLevel, number> = {
  critico: 0,
  alto: 1,
  moderado: 2,
  baixo: 3,
};

function RiskBadge({ level }: { level: DefaultRiskLevel }) {
  const c = riskConfig[level];
  return (
    <Badge variant="outline" style={{ color: c.color, background: c.bg, borderColor: c.border }}>
      {c.label}
    </Badge>
  );
}

function rowAccent(row: AdminDefaultCase): string | undefined {
  if (row.riskLevel === 'critico') return 'border-l-4 border-l-red-600';
  if (row.riskLevel === 'alto') return 'border-l-4 border-l-orange-600';
  if (row.riskLevel === 'moderado') return 'border-l-4 border-l-amber-500';
  return 'border-l-4 border-l-slate-400';
}

function criticalAmountSum(cases: AdminDefaultCase[]) {
  return cases.filter((c) => c.riskLevel === 'critico').reduce((s, c) => s + c.overdueAmount, 0);
}

export function AdminDefaultsPage() {
  const allRows = useMemo(() => listDefaultCases(), []);
  const summary = useMemo(() => getDefaultRiskSummary(allRows), [allRows]);
  const criticalVolume = useMemo(() => criticalAmountSum(allRows), [allRows]);

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | DefaultRiskLevel>('all');
  const [planFilter, setPlanFilter] = useState<'all' | PlanKind>('all');
  const [stageFilter, setStageFilter] = useState<'all' | RecoveryStage>('all');
  const [selected, setSelected] = useState<AdminDefaultCase | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRows.filter((row) => {
      const hay = `${row.id} ${row.chargeRef} ${row.patientName} ${row.planLabel} ${row.unit}`.toLowerCase();
      const okSearch = q.length === 0 || hay.includes(q);
      const okRisk = riskFilter === 'all' || row.riskLevel === riskFilter;
      const okPlan = planFilter === 'all' || row.planKind === planFilter;
      const okStage = stageFilter === 'all' || row.recoveryStage === stageFilter;
      return okSearch && okRisk && okPlan && okStage;
    });
  }, [allRows, search, riskFilter, planFilter, stageFilter]);

  const sortedRows = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dr = riskSort[a.riskLevel] - riskSort[b.riskLevel];
      if (dr !== 0) return dr;
      return b.daysPastDue - a.daysPastDue;
    });
  }, [filtered]);

  useEffect(() => {
    if (sortedRows.length === 0) {
      setSelected(null);
      return;
    }
    setSelected((prev) => {
      if (prev && sortedRows.some((r) => r.id === prev.id)) return prev;
      return sortedRows[0];
    });
  }, [sortedRows]);

  const hasFilters =
    search.trim().length > 0 || riskFilter !== 'all' || planFilter !== 'all' || stageFilter !== 'all';
  const clearFilters = () => {
    setSearch('');
    setRiskFilter('all');
    setPlanFilter('all');
    setStageFilter('all');
  };

  const columns: DataTableColumn<AdminDefaultCase>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className="font-semibold tabular-nums">{row.id}</span> },
    { key: 'ref', header: 'Cobrança', render: (row) => <span className="text-sm font-medium tabular-nums">{row.chargeRef}</span> },
    { key: 'patient', header: 'Paciente', className: 'min-w-[130px]', render: (row) => row.patientName },
    {
      key: 'plan',
      header: 'Plano',
      render: (row) => (
        <div className="text-sm">
          <span className="font-medium" style={{ color: '#4A3728' }}>
            {row.planLabel}
          </span>
          <span className="block text-[11px] capitalize" style={{ color: '#6B5D53' }}>
            {row.planKind}
          </span>
        </div>
      ),
    },
    {
      key: 'amt',
      header: 'Valor vencido',
      render: (row) => <span className="font-semibold tabular-nums text-red-900/90">{formatBRL(row.overdueAmount)}</span>,
    },
    {
      key: 'days',
      header: 'Dias',
      render: (row) => (
        <span className="tabular-nums font-medium" style={{ color: row.daysPastDue > 30 ? '#b91c1c' : '#4A3728' }}>
          {row.daysPastDue} d
        </span>
      ),
    },
    { key: 'risk', header: 'Risco', render: (row) => <RiskBadge level={row.riskLevel} /> },
    { key: 'stage', header: 'Etapa', render: (row) => <span className="text-xs" style={{ color: '#6B5D53' }}>{stageLabels[row.recoveryStage]}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inadimplência"
        description="Priorize por risco e idade da dívida. Convênio exige trilha de glosa e coparticipação; particular acelera negociação direta. A lista ordena críticos primeiro, depois maior atraso."
      />

      <AdminFinancialSubnav />

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Wallet className="size-3.5" />
              Carteira vencida
            </p>
            <p className="text-xl font-bold tabular-nums text-red-900">{formatBRL(summary.totalOverdue)}</p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              {summary.caseCount} caso(s) ativo(s) na demo
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <ShieldAlert className="size-3.5 text-red-600" />
              Risco crítico
            </p>
            <p className="text-2xl font-bold tabular-nums text-red-700">{summary.criticalCount}</p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              {formatBRL(criticalVolume)} em exposição crítica
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Timer className="size-3.5" />
              Atraso médio
            </p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
              {summary.avgDaysPastDue}
              <span className="text-sm font-semibold ml-1">dias</span>
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Idade média das dívidas listadas
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Layers className="size-3.5" />
              Mix carteira
            </p>
            <p className="text-sm font-semibold tabular-nums" style={{ color: '#4A3728' }}>
              Conv.: {formatBRL(summary.convenioTotal)}
            </p>
            <p className="text-sm font-semibold tabular-nums" style={{ color: '#6B5D53' }}>
              Part.: {formatBRL(summary.particularTotal)}
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col gap-3">
            <div className="relative w-full">
              <FileSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5D53]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Paciente, ID caso, cobrança, plano ou unidade..."
                className="pl-9 border-2 bg-white"
                style={financeBorderStyle}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                  Nível de risco
                </p>
                <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as typeof riskFilter)}>
                  <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                    <SelectValue placeholder="Risco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="critico">{riskConfig.critico.label}</SelectItem>
                    <SelectItem value="alto">{riskConfig.alto.label}</SelectItem>
                    <SelectItem value="moderado">{riskConfig.moderado.label}</SelectItem>
                    <SelectItem value="baixo">{riskConfig.baixo.label}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                  Tipo de plano
                </p>
                <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as typeof planFilter)}>
                  <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                    <SelectValue placeholder="Plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="convenio">Convênio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                  Etapa de recuperação
                </p>
                <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as typeof stageFilter)}>
                  <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                    <SelectValue placeholder="Etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {(Object.keys(stageLabels) as RecoveryStage[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {stageLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardDescription>
              {sortedRows.length} caso(s) · ordenação: risco decrescente, depois dias em atraso
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
                  style={financeFilterChipStyle}
                >
                  Busca: {search.trim()}
                  <span style={{ color: '#6B5D53' }}>×</span>
                </button>
              ) : null}
              {riskFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setRiskFilter('all')}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={financeFilterChipStyle}
                >
                  Risco: {riskConfig[riskFilter].label}
                  <span style={{ color: '#6B5D53' }}>×</span>
                </button>
              ) : null}
              {planFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setPlanFilter('all')}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={financeFilterChipStyle}
                >
                  Plano: {planFilter === 'particular' ? 'Particular' : 'Convênio'}
                  <span style={{ color: '#6B5D53' }}>×</span>
                </button>
              ) : null}
              {stageFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setStageFilter('all')}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={financeFilterChipStyle}
                >
                  Etapa: {stageLabels[stageFilter]}
                  <span style={{ color: '#6B5D53' }}>×</span>
                </button>
              ) : null}
            </div>
          ) : null}

          {sortedRows.length === 0 ? (
            <div className="rounded-xl border p-10 text-center" style={{ ...financeBorderStyle, background: '#FAFAFA' }}>
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3" style={financeBorderStyle}>
                <FileSearch className="size-5 text-[#FFA500]" />
              </div>
              <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
                Nenhum caso encontrado
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
                Ajuste busca ou filtros de risco, plano e etapa.
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 ${selected ? 'xl:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
              <DataTable
                rows={sortedRows}
                columns={columns}
                rowKey={(row) => row.id}
                onRowClick={setSelected}
                selectedRowKey={selected?.id ?? null}
                getRowClassName={rowAccent}
              />

              {selected ? (
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
                      <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" onClick={() => setSelected(null)}>
                        <X className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div
                      className="rounded-xl border-2 px-4 py-4 text-center"
                      style={{ borderColor: 'rgba(185, 28, 28, 0.28)', background: 'linear-gradient(180deg, #FFF5F5 0%, #FFFBFB 100%)' }}
                    >
                      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                        Valor vencido
                      </p>
                      <p className="text-2xl font-bold tabular-nums mt-1 text-red-900">{formatBRL(selected.overdueAmount)}</p>
                      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs" style={{ color: '#6B5D53' }}>
                        <Timer className="size-3.5" />
                        <span>
                          <span className="font-semibold text-[#4A3728]">{selected.daysPastDue} dias</span> desde o vencimento mais antigo
                        </span>
                        <span className="text-[#94a3b8]">·</span>
                        <span>Venc. {selected.oldestDueDate}</span>
                      </div>
                    </div>

                    {(selected.riskLevel === 'critico' || selected.riskLevel === 'alto') ? (
                      <div
                        className="rounded-lg border px-3 py-2.5 flex gap-2 items-start text-xs"
                        style={{ borderColor: 'rgba(185, 28, 28, 0.3)', background: 'rgba(185, 28, 28, 0.06)' }}
                      >
                        <AlertTriangle className="size-4 shrink-0 text-red-600" />
                        <div>
                          <p className="font-semibold text-red-900">Ação prioritária</p>
                          <p className="text-red-900/85">{selected.nextBestAction}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border px-3 py-2.5 text-xs" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFFBF0' }}>
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
                        <p className="text-xs rounded-lg border p-2" style={{ borderColor: 'rgba(255, 165, 0, 0.15)', color: '#6B5D53' }}>
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
                        onClick={() => toast.message('Demo', { description: 'Proposta de parcelamento enviada (e-mail/WhatsApp).' })}
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
                          onClick={() => toast.message('Demo', { description: 'Fluxo de glosa/coparticipação aberto com a operadora.' })}
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
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
