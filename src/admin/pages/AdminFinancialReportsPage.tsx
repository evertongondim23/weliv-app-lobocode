import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Download,
  FileSearch,
  Landmark,
  RefreshCw,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../app/components/ui/badge';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../app/components/ui/select';
import { AdminFinancialSubnav } from '../components/finance/AdminFinancialSubnav';
import { FilterBar } from '../components/filters/FilterBar';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable, type DataTableColumn } from '../components/tables/DataTable';
import { formatBRL } from '../utils/formatCurrency';
import { financeBorderStyle, financeFilterChipStyle } from '../utils/financeUi';
import {
  computeReportKpis,
  distinctReportUnits,
  listFinancialReportRows,
  pctOfTotal,
  reportCategoryLabels,
  reportPeriodOptions,
  type FinancialReportRow,
  type ReportCategory,
} from '../services/financialReports.service';

function formatPct(value: number | null, digits = 1) {
  if (value === null || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

const categoryStyle: Record<ReportCategory, { color: string; bg: string; border: string }> = {
  consultas: { color: '#047857', bg: 'rgba(4, 120, 87, 0.1)', border: 'rgba(4, 120, 87, 0.35)' },
  exames: { color: '#1d4ed8', bg: 'rgba(29, 78, 216, 0.08)', border: 'rgba(29, 78, 216, 0.35)' },
  taxas: { color: '#a16207', bg: 'rgba(161, 98, 7, 0.1)', border: 'rgba(161, 98, 7, 0.35)' },
  estornos: { color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.1)', border: 'rgba(185, 28, 28, 0.35)' },
  repasses: { color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.35)' },
};

function CategoryBadge({ category }: { category: ReportCategory }) {
  const c = categoryStyle[category];
  return (
    <Badge variant="outline" style={{ color: c.color, background: c.bg, borderColor: c.border }}>
      {reportCategoryLabels[category]}
    </Badge>
  );
}

function VarianceCell({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return <span className="text-sm tabular-nums text-[#6B5D53]">—</span>;
  const v = ((current - previous) / Math.abs(previous)) * 100;
  const up = v >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  const color = up ? 'text-emerald-700' : 'text-red-700';
  return (
    <span className={`inline-flex items-center gap-1 text-sm tabular-nums font-medium ${color}`}>
      <Icon className="size-3.5 shrink-0" />
      {formatPct(v)}
    </span>
  );
}

export function AdminFinancialReportsPage() {
  const allRows = useMemo(() => listFinancialReportRows(), []);
  const units = useMemo(() => distinctReportUnits(allRows), [allRows]);

  const [periodMonth, setPeriodMonth] = useState(reportPeriodOptions[0]?.value ?? '2026-03');
  const [unitFilter, setUnitFilter] = useState<'all' | string>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ReportCategory>('all');
  const [selected, setSelected] = useState<FinancialReportRow | null>(null);

  const periodLabel = reportPeriodOptions.find((p) => p.value === periodMonth)?.label ?? periodMonth;

  const sliceRows = useMemo(() => {
    return allRows.filter((r) => {
      if (r.periodMonth !== periodMonth) return false;
      if (unitFilter !== 'all' && r.unit !== unitFilter) return false;
      return true;
    });
  }, [allRows, periodMonth, unitFilter]);

  const kpis = useMemo(() => computeReportKpis(sliceRows), [sliceRows]);

  const filteredTableRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sliceRows.filter((row) => {
      const hay = `${row.id} ${row.label} ${row.unit} ${reportCategoryLabels[row.category]}`.toLowerCase();
      const okSearch = q.length === 0 || hay.includes(q);
      const okCat = categoryFilter === 'all' || row.category === categoryFilter;
      return okSearch && okCat;
    });
  }, [sliceRows, search, categoryFilter]);

  const sortedRows = useMemo(() => {
    return [...filteredTableRows].sort((a, b) => {
      if (b.amount !== a.amount) return b.amount - a.amount;
      return a.label.localeCompare(b.label);
    });
  }, [filteredTableRows]);

  useEffect(() => {
    if (!selected) return;
    if (sortedRows.some((r) => r.id === selected.id)) return;
    setSelected(sortedRows[0] ?? null);
  }, [sortedRows, selected]);

  const hasTableFilters = search.trim().length > 0 || categoryFilter !== 'all';
  const hasContextFilters = unitFilter !== 'all';

  const clearTableFilters = () => {
    setSearch('');
    setCategoryFilter('all');
  };

  const clearAllFilters = () => {
    clearTableFilters();
    setUnitFilter('all');
  };

  const columns: DataTableColumn<FinancialReportRow>[] = [
    { key: 'id', header: 'ID', render: (row) => <span className="font-semibold tabular-nums">{row.id}</span> },
    {
      key: 'label',
      header: 'Linha / dimensão',
      className: 'min-w-[160px]',
      render: (row) => <span className="text-sm font-medium" style={{ color: '#4A3728' }}>{row.label}</span>,
    },
    {
      key: 'unit',
      header: 'Unidade',
      className: 'max-w-[140px]',
      render: (row) => (
        <span className="truncate block text-sm" title={row.unit}>
          {row.unit}
        </span>
      ),
    },
    { key: 'category', header: 'Categoria', render: (row) => <CategoryBadge category={row.category} /> },
    {
      key: 'amount',
      header: 'Valor ( período )',
      render: (row) => (
        <span className={`tabular-nums font-semibold ${row.amount < 0 ? 'text-red-700' : ''}`} style={row.amount >= 0 ? { color: '#4A3728' } : undefined}>
          {formatBRL(row.amount)}
        </span>
      ),
    },
    {
      key: 'share',
      header: '% do total',
      render: (row) => (
        <span className="text-sm tabular-nums text-[#6B5D53]">
          {kpis.netRevenue === 0 ? '—' : `${pctOfTotal(row.amount, kpis.netRevenue).toFixed(1)}%`}
        </span>
      ),
    },
    {
      key: 'var',
      header: 'vs mês ant.',
      render: (row) => <VarianceCell current={row.amount} previous={row.prevAmount} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios financeiros"
        description="Relatórios executivos de performance financeira e previsibilidade. Ajuste período e unidade para recortar os KPIs; refine a tabela por busca e categoria."
      />

      <AdminFinancialSubnav />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm" style={{ color: '#6B5D53' }}>
          <span className="font-medium" style={{ color: '#4A3728' }}>
            Recorte ativo:
          </span>
          <Badge variant="outline" className="font-normal" style={{ borderColor: 'rgba(255, 165, 0, 0.35)', color: '#4A3728' }}>
            {periodLabel}
          </Badge>
          {unitFilter !== 'all' ? (
            <Badge variant="outline" className="font-normal" style={{ borderColor: 'rgba(255, 165, 0, 0.35)', color: '#4A3728' }}>
              {unitFilter}
            </Badge>
          ) : (
            <span className="text-xs">· Todas as unidades</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-2"
            style={financeBorderStyle}
            onClick={() => toast.success('Exportação agendada (demo). Você receberá o arquivo por e-mail.')}
          >
            <Download className="size-4 mr-1.5" />
            Exportar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-2"
            style={financeBorderStyle}
            onClick={() => toast.message('Dados atualizados', { description: 'Snapshot financeiro recarregado (mock).' })}
          >
            <RefreshCw className="size-4 mr-1.5" />
            Atualizar
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Wallet className="size-3.5" />
              Receita líquida
            </p>
            <p className="text-xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
              {formatBRL(kpis.netRevenue)}
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Soma das linhas do recorte ({sliceRows.length} lançamento(s))
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <TrendingUp className="size-3.5" />
              vs mês anterior
            </p>
            <p
              className={`text-xl font-bold tabular-nums ${kpis.variancePct != null && kpis.variancePct >= 0 ? 'text-emerald-800' : 'text-red-700'}`}
            >
              {formatPct(kpis.variancePct)}
            </p>
            <p className="text-xs tabular-nums" style={{ color: '#6B5D53' }}>
              Mês ant.: {formatBRL(kpis.prevNetRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <TrendingDown className="size-3.5 text-amber-600" />
              Inadimplência (ref.)
            </p>
            <p className="text-xl font-bold tabular-nums text-amber-800">{kpis.defaultRatePct.toFixed(1)}%</p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Indicador de referência no período (mock)
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Landmark className="size-3.5 text-emerald-700" />
              Previsão caixa 30d
            </p>
            <p className="text-xl font-bold tabular-nums text-emerald-800">{formatBRL(kpis.cashForecast30d)}</p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Projeção simplificada para alinhamento executivo
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-2" style={financeBorderStyle}>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                Período de competência
              </p>
              <Select value={periodMonth} onValueChange={setPeriodMonth}>
                <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {reportPeriodOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                Unidade
              </p>
              <Select value={unitFilter} onValueChange={(v) => setUnitFilter(v as 'all' | string)}>
                <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                  <SelectValue placeholder="Unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as unidades</SelectItem>
                  {units.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <FilterBar
            searchPlaceholder="Buscar por ID, linha, unidade ou categoria..."
            searchValue={search}
            onSearchChange={setSearch}
            filterValue={categoryFilter}
            onFilterChange={(v) => setCategoryFilter(v as 'all' | ReportCategory)}
            filterLabel="Categoria"
            options={[
              { label: 'Todas as categorias', value: 'all' },
              { label: reportCategoryLabels.consultas, value: 'consultas' },
              { label: reportCategoryLabels.exames, value: 'exames' },
              { label: reportCategoryLabels.taxas, value: 'taxas' },
              { label: reportCategoryLabels.estornos, value: 'estornos' },
              { label: reportCategoryLabels.repasses, value: 'repasses' },
            ]}
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardDescription>
              {sortedRows.length} linha(s) na grade · {filteredTableRows.length === sliceRows.length ? 'sem refinamento na tabela' : 'filtros de busca/categoria ativos'}
            </CardDescription>
            {(hasTableFilters || hasContextFilters) ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (hasTableFilters && !hasContextFilters) clearTableFilters();
                  else clearAllFilters();
                }}
                className="h-8 px-2 text-[#6B5D53]"
              >
                <RotateCcw className="size-3.5 mr-1" />
                {hasContextFilters || !hasTableFilters ? 'Limpar recorte e tabela' : 'Limpar filtros da tabela'}
              </Button>
            ) : null}
          </div>

          {hasTableFilters ? (
            <div className="flex flex-wrap items-center gap-2">
              {search.trim().length > 0 ? (
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
              {categoryFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={financeFilterChipStyle}
                >
                  Categoria: {reportCategoryLabels[categoryFilter]}
                  <span style={{ color: '#6B5D53' }}>×</span>
                </button>
              ) : null}
            </div>
          ) : null}

          {sliceRows.length === 0 ? (
            <div className="rounded-xl border p-8 text-center" style={{ ...financeBorderStyle, background: '#FAFAFA' }}>
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3" style={financeBorderStyle}>
                <Building2 className="size-5 text-[#FFA500]" />
              </div>
              <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
                Sem lançamentos neste período
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
                Escolha outro mês ou confira os dados consolidados no back-end.
              </p>
            </div>
          ) : sortedRows.length > 0 ? (
            <div className={`grid gap-4 ${selected ? 'xl:grid-cols-[1fr_340px]' : 'grid-cols-1'}`}>
              <DataTable
                rows={sortedRows}
                columns={columns}
                rowKey={(row) => row.id}
                onRowClick={setSelected}
                selectedRowKey={selected?.id ?? null}
                getRowClassName={(row) => (row.category === 'estornos' ? 'border-l-4 border-l-red-500' : undefined)}
              />

              {selected ? (
                <Card className="border-2 h-fit xl:sticky xl:top-24" style={financeBorderStyle}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-base" style={{ color: '#4A3728' }}>
                          {selected.label}
                        </CardTitle>
                        <CardDescription className="text-xs">{selected.id} · {selected.unit}</CardDescription>
                      </div>
                      <Button type="button" size="icon" variant="ghost" className="size-8" onClick={() => setSelected(null)}>
                        <X className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <CategoryBadge category={selected.category} />
                    </div>
                    <div className="space-y-2 rounded-lg border p-3" style={financeBorderStyle}>
                      <p>
                        <strong>Valor no período:</strong>{' '}
                        <span className="tabular-nums font-semibold">{formatBRL(selected.amount)}</span>
                      </p>
                      <p>
                        <strong>Mês anterior:</strong> <span className="tabular-nums">{formatBRL(selected.prevAmount)}</span>
                      </p>
                      <p>
                        <strong>Variação:</strong> <VarianceCell current={selected.amount} previous={selected.prevAmount} />
                      </p>
                      <p className="text-xs" style={{ color: '#6B5D53' }}>
                        Participação na receita líquida do recorte:{' '}
                        <strong>{kpis.netRevenue === 0 ? '—' : `${pctOfTotal(selected.amount, kpis.netRevenue).toFixed(1)}%`}</strong>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={financeBorderStyle}
                      onClick={() => toast.success(`Linha ${selected.id} incluída no próximo export (demo).`)}
                    >
                      <Download className="size-4 mr-1.5" />
                      Incluir no export
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border p-8 text-center" style={{ ...financeBorderStyle, background: '#FAFAFA' }}>
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3" style={financeBorderStyle}>
                <FileSearch className="size-5 text-[#FFA500]" />
              </div>
              <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
                Nenhuma linha encontrada
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
                Ajuste a busca ou a categoria, ou limpe os filtros.
              </p>
              <Button type="button" variant="outline" className="mt-4 border-2" style={financeBorderStyle} onClick={clearTableFilters}>
                Limpar filtros da tabela
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
