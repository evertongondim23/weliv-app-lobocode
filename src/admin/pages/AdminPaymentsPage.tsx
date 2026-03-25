import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRightLeft, Building2, Copy, FileSearch, Landmark, Link2, Receipt, Scale, Wallet, X } from 'lucide-react';
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
import { financeMethodLabel, PaymentMethodCell } from '../components/finance/PaymentMethodCell';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable, type DataTableColumn } from '../components/tables/DataTable';
import { formatBRL } from '../utils/formatCurrency';
import { financeBorderStyle, financeFilterChipStyle, financePrimaryActionStyle } from '../utils/financeUi';
import {
  getPaymentReconciliationSummary,
  listAdminPayments,
  type AdminPaymentRow,
  type PaymentConciliationStatus,
  type PaymentGateway,
  type PaymentMethod,
} from '../services/paymentReconciliationService';

const statusConfig: Record<
  PaymentConciliationStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  pending_gateway: {
    label: 'Aguardando conciliação',
    color: '#a16207',
    bg: 'rgba(161, 98, 7, 0.1)',
    border: 'rgba(161, 98, 7, 0.35)',
  },
  reconciled: {
    label: 'Conciliado',
    color: '#047857',
    bg: 'rgba(4, 120, 87, 0.1)',
    border: 'rgba(4, 120, 87, 0.35)',
  },
  dispute: {
    label: 'Em disputa',
    color: '#c2410c',
    bg: 'rgba(194, 65, 12, 0.12)',
    border: 'rgba(194, 65, 12, 0.4)',
  },
  refunded: {
    label: 'Estornado',
    color: '#64748b',
    bg: 'rgba(71, 85, 105, 0.12)',
    border: 'rgba(71, 85, 105, 0.35)',
  },
};

function PaymentStatusBadge({ status }: { status: PaymentConciliationStatus }) {
  const c = statusConfig[status];
  return (
    <Badge variant="outline" style={{ color: c.color, background: c.bg, borderColor: c.border }}>
      {c.label}
    </Badge>
  );
}

const sortRank: Record<PaymentConciliationStatus, number> = {
  pending_gateway: 0,
  dispute: 1,
  refunded: 2,
  reconciled: 3,
};

function rowAccent(row: AdminPaymentRow): string | undefined {
  if (row.status === 'dispute') return 'border-l-4 border-l-orange-600';
  if (row.status === 'refunded') return 'border-l-4 border-l-slate-500';
  if (row.status === 'pending_gateway') return 'border-l-4 border-l-amber-500';
  return 'border-l-4 border-l-emerald-600/70';
}

export function AdminPaymentsPage() {
  const allRows = useMemo(() => listAdminPayments(), []);
  const summary = useMemo(() => getPaymentReconciliationSummary(allRows), [allRows]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentConciliationStatus>('all');
  const [gatewayFilter, setGatewayFilter] = useState<'all' | PaymentGateway>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');
  const [selected, setSelected] = useState<AdminPaymentRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRows.filter((row) => {
      const hay = `${row.id} ${row.chargeRef} ${row.patientName} ${row.unit} ${row.nsu ?? ''} ${row.gateway}`.toLowerCase();
      const okSearch = q.length === 0 || hay.includes(q);
      const okStatus = statusFilter === 'all' || row.status === statusFilter;
      const okGateway = gatewayFilter === 'all' || row.gateway === gatewayFilter;
      const okMethod = methodFilter === 'all' || row.method === methodFilter;
      return okSearch && okStatus && okGateway && okMethod;
    });
  }, [allRows, search, statusFilter, gatewayFilter, methodFilter]);

  const sortedRows = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dr = sortRank[a.status] - sortRank[b.status];
      if (dr !== 0) return dr;
      return b.capturedAtIso.localeCompare(a.capturedAtIso);
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
    search.trim().length > 0 || statusFilter !== 'all' || gatewayFilter !== 'all' || methodFilter !== 'all';
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setGatewayFilter('all');
    setMethodFilter('all');
  };

  const columns: DataTableColumn<AdminPaymentRow>[] = [
    { key: 'id', header: 'Pagamento', render: (row) => <span className="font-semibold tabular-nums">{row.id}</span> },
    {
      key: 'ref',
      header: 'Cobrança',
      render: (row) => <span className="font-medium text-sm tabular-nums">{row.chargeRef}</span>,
    },
    { key: 'patient', header: 'Paciente', className: 'min-w-[130px]', render: (row) => row.patientName },
    {
      key: 'gross',
      header: 'Bruto',
      render: (row) => <span className="tabular-nums font-medium">{formatBRL(row.grossAmount)}</span>,
    },
    {
      key: 'net',
      header: 'Líquido',
      render: (row) => <span className="tabular-nums text-sm" style={{ color: '#047857' }}>{formatBRL(row.netAmount)}</span>,
    },
    { key: 'gw', header: 'Gateway', render: (row) => <span className="text-sm font-medium" style={{ color: '#4A3728' }}>{row.gateway}</span> },
    { key: 'cap', header: 'Captura', render: (row) => <span className="text-xs tabular-nums whitespace-nowrap" style={{ color: '#6B5D53' }}>{row.capturedAt}</span> },
    { key: 'st', header: 'Conciliação', render: (row) => <PaymentStatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagamentos"
        description="Concilie capturas com o extrato do gateway, acompanhe taxas (MDR) e previsão de repasse. A lista prioriza pendências e disputas; o painel lateral mostra o de/para bruto → taxa → líquido."
      />

      <AdminFinancialSubnav />

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <ArrowRightLeft className="size-3.5" />
              Pendente de conciliação
            </p>
            <p className="text-xl font-bold tabular-nums" style={{ color: '#a16207' }}>
              {formatBRL(summary.pendingGross)}
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              {summary.pendingCount} captura(s) · líquido previsto {formatBRL(summary.pendingNet)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Wallet className="size-3.5 text-emerald-700" />
              Já conciliados
            </p>
            <p className="text-xl font-bold tabular-nums text-emerald-800">
              {formatBRL(summary.reconciledNet)}
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              {summary.reconciledCount} registro(s) · total líquido repassado
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Receipt className="size-3.5" />
              Taxas (MDR) no período
            </p>
            <p className="text-xl font-bold tabular-nums" style={{ color: '#4A3728' }}>
              {formatBRL(summary.totalFees)}
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Soma das taxas das linhas da demo
            </p>
          </CardContent>
        </Card>
        <Card className="border-2" style={financeBorderStyle}>
          <CardContent className="pt-5 pb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: '#6B5D53' }}>
              <Scale className="size-3.5 text-orange-700" />
              Disputa / estorno
            </p>
            <p className="text-2xl font-bold tabular-nums text-orange-900">
              {summary.attentionCount}
            </p>
            <p className="text-xs" style={{ color: '#6B5D53' }}>
              Requer acompanhamento com adquirente
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
                placeholder="ID pagamento, cobrança, paciente, NSU ou gateway..."
                className="pl-9 border-2 bg-white"
                style={financeBorderStyle}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                  Status de conciliação
                </p>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                  <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending_gateway">{statusConfig.pending_gateway.label}</SelectItem>
                    <SelectItem value="reconciled">{statusConfig.reconciled.label}</SelectItem>
                    <SelectItem value="dispute">{statusConfig.dispute.label}</SelectItem>
                    <SelectItem value="refunded">{statusConfig.refunded.label}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                  Gateway
                </p>
                <Select value={gatewayFilter} onValueChange={(v) => setGatewayFilter(v as typeof gatewayFilter)}>
                  <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                    <SelectValue placeholder="Gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Stone">Stone</SelectItem>
                    <SelectItem value="PagSeguro">PagSeguro</SelectItem>
                    <SelectItem value="Cielo">Cielo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                  Meio
                </p>
                <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as typeof methodFilter)}>
                  <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                    <SelectValue placeholder="Meio" />
                  </SelectTrigger>
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
            <CardDescription>
              {sortedRows.length} movimentação(ões) · ordenação: pendências e disputas primeiro
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
              {statusFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={financeFilterChipStyle}
                >
                  {statusConfig[statusFilter].label}
                  <span style={{ color: '#6B5D53' }}>×</span>
                </button>
              ) : null}
              {gatewayFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setGatewayFilter('all')}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={financeFilterChipStyle}
                >
                  Gateway: {gatewayFilter}
                  <span style={{ color: '#6B5D53' }}>×</span>
                </button>
              ) : null}
              {methodFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setMethodFilter('all')}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={financeFilterChipStyle}
                >
                  Meio: {financeMethodLabel(methodFilter)}
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
                Nenhum pagamento encontrado
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
                Ajuste busca ou filtros de status, gateway e meio.
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
                          <PaymentStatusBadge status={selected.status} />
                        </div>
                        <CardDescription>
                          {selected.patientName} · Cobrança {selected.chargeRef}
                        </CardDescription>
                      </div>
                      <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" onClick={() => setSelected(null)}>
                        <X className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div
                      className="rounded-xl border-2 overflow-hidden"
                      style={{ borderColor: 'rgba(255, 165, 0, 0.35)' }}
                    >
                      <div className="grid grid-cols-3 divide-x text-center" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
                        <div className="p-3 bg-[#FFFBF0]">
                          <p className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: '#6B5D53' }}>
                            Bruto
                          </p>
                          <p className="text-sm font-bold tabular-nums mt-0.5" style={{ color: '#4A3728' }}>
                            {formatBRL(selected.grossAmount)}
                          </p>
                        </div>
                        <div className="p-3 bg-white">
                          <p className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: '#6B5D53' }}>
                            Taxa
                          </p>
                          <p className="text-sm font-semibold tabular-nums mt-0.5 text-red-700">
                            − {formatBRL(selected.feeAmount)}
                          </p>
                        </div>
                        <div className="p-3 bg-emerald-50/80">
                          <p className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: '#047857' }}>
                            Líquido
                          </p>
                          <p className="text-sm font-bold tabular-nums mt-0.5 text-emerald-900">
                            {formatBRL(selected.netAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-2 text-xs flex items-center gap-2 border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.12)', color: '#6B5D53' }}>
                        <Landmark className="size-3.5 shrink-0" />
                        Repasse previsto: <span className="font-medium text-[#4A3728]">{selected.settlementEta}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <PaymentMethodCell method={selected.method} />
                        <span className="text-xs px-2 py-0.5 rounded-md border" style={{ borderColor: 'rgba(255, 165, 0, 0.25)', color: '#4A3728' }}>
                          {selected.gateway}
                        </span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
                        <Building2 className="size-4 shrink-0" />
                        {selected.unit}
                      </div>
                      {selected.nsu ? (
                        <div className="flex items-center justify-between gap-2 rounded-lg border px-2 py-1.5" style={financeBorderStyle}>
                          <span className="text-xs truncate" style={{ color: '#6B5D53' }}>
                            NSU <span className="font-mono font-medium text-[#4A3728]">{selected.nsu}</span>
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 shrink-0"
                            onClick={() => {
                              navigator.clipboard.writeText(selected.nsu ?? '');
                              toast.success('NSU copiado.');
                            }}
                          >
                            <Copy className="size-3.5" />
                          </Button>
                        </div>
                      ) : null}
                      {selected.reconciledAt ? (
                        <p className="text-xs text-emerald-800">
                          Conciliado em <span className="font-medium">{selected.reconciledAt}</span>
                        </p>
                      ) : null}
                      {selected.notes ? (
                        <p className="text-xs rounded-lg border p-2" style={{ borderColor: 'rgba(255, 165, 0, 0.15)', color: '#6B5D53' }}>
                          {selected.notes}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                        Ações rápidas (demo)
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-2 justify-start gap-2"
                        style={financeBorderStyle}
                        onClick={() => toast.message('Demo', { description: 'Busca do NSU no extrato do gateway.' })}
                      >
                        <Link2 className="size-4" />
                        Abrir no extrato (gateway)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-2 justify-start"
                        style={financeBorderStyle}
                        disabled={selected.status === 'reconciled'}
                        onClick={() => toast.success('Demo: conciliação manual registrada.')}
                      >
                        Marcar como conciliado
                      </Button>
                      <Button
                        type="button"
                        className="text-white border-0 justify-start"
                        style={financePrimaryActionStyle}
                        disabled={selected.status !== 'pending_gateway'}
                        onClick={() => toast.message('Demo', { description: 'Webhook de confirmação reprocessado.' })}
                      >
                        Reprocessar confirmação
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
