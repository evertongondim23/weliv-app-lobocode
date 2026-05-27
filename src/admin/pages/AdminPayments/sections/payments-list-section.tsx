import { FileSearch } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import { Card, CardContent, CardDescription } from '../../../../app/components/ui/card';
import { Input } from '../../../../app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { financeMethodLabel } from '../../../components/finance/PaymentMethodCell';
import { DataTable } from '../../../components/tables/DataTable';
import { financeBorderStyle, financeFilterChipStyle } from '../../../utils/financeUi';
import { PaymentDetailPanel } from '../components/payment-detail-panel';
import { PaymentsEmptyState } from '../components/payments-empty-state';
import {
  GATEWAY_FILTER_OPTIONS,
  METHOD_FILTER_OPTIONS,
  statusConfig,
} from '../constants/admin-payments-page.constants';
import type { PaymentsListSectionProps } from '../types/admin-payments-page.types';
import { paymentRowAccent } from '../utils/admin-payments-page.utils';

export function PaymentsListSection({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  gatewayFilter,
  onGatewayFilterChange,
  methodFilter,
  onMethodFilterChange,
  hasFilters,
  onClearFilters,
  sortedRows,
  columns,
  selected,
  onSelect,
  onClosePanel,
}: PaymentsListSectionProps) {
  return (
    <Card className="border-2" style={financeBorderStyle}>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <FileSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5D53]" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
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
              <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as typeof statusFilter)}>
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
              <Select value={gatewayFilter} onValueChange={(v) => onGatewayFilterChange(v as typeof gatewayFilter)}>
                <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                  <SelectValue placeholder="Gateway" />
                </SelectTrigger>
                <SelectContent>
                  {GATEWAY_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                Meio
              </p>
              <Select value={methodFilter} onValueChange={(v) => onMethodFilterChange(v as typeof methodFilter)}>
                <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                  <SelectValue placeholder="Meio" />
                </SelectTrigger>
                <SelectContent>
                  {METHOD_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
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
            <Button type="button" variant="ghost" className="h-8 text-[#6B5D53]" onClick={onClearFilters}>
              Limpar filtros
            </Button>
          ) : null}
        </div>

        {hasFilters ? (
          <div className="flex flex-wrap gap-2">
            {search.trim() ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
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
                onClick={() => onStatusFilterChange('all')}
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
                onClick={() => onGatewayFilterChange('all')}
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
                onClick={() => onMethodFilterChange('all')}
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
          <PaymentsEmptyState />
        ) : (
          <div className={`grid gap-4 ${selected ? 'xl:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
            <DataTable
              rows={sortedRows}
              columns={columns}
              rowKey={(row) => row.id}
              onRowClick={onSelect}
              selectedRowKey={selected?.id ?? null}
              getRowClassName={paymentRowAccent}
            />
            {selected ? <PaymentDetailPanel selected={selected} onClose={onClosePanel} /> : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
