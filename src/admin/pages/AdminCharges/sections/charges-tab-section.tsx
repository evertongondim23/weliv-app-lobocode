import { FileSearch } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import { CardDescription } from '../../../../app/components/ui/card';
import { Input } from '../../../../app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { DataTable } from '../../../components/tables/DataTable';
import { financeBorderStyle, financeFilterChipStyle } from '../../../utils/financeUi';
import { ChargeDetailPanel } from '../components/charge-detail-panel';
import { ListEmptyState } from '../components/list-empty-state';
import {
  chargeStatusConfig,
  getPaymentMethodChipLabel,
} from '../constants/admin-charges-page.constants';
import type { ChargesTabSectionProps } from '../types/admin-charges-page.types';
import { chargeRowAccent } from '../utils/admin-charges-page.utils';

export function ChargesTabSection({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  methodFilter,
  onMethodFilterChange,
  hasActiveFilters,
  onClearFilters,
  filteredCharges,
  columns,
  selectedCharge,
  onSelectCharge,
  onCloseCharge,
}: ChargesTabSectionProps) {
  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="relative flex-1 min-w-0">
          <FileSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5D53]" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Paciente, ID, unidade ou e-mail..."
            className="pl-9 border-2 bg-white"
            style={financeBorderStyle}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[360px]">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
              Status
            </p>
            <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as typeof statusFilter)}>
              <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="atrasado">{chargeStatusConfig.atrasado.label}</SelectItem>
                <SelectItem value="pendente">{chargeStatusConfig.pendente.label}</SelectItem>
                <SelectItem value="pago">{chargeStatusConfig.pago.label}</SelectItem>
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
        {hasActiveFilters ? (
          <Button type="button" variant="ghost" className="h-8 text-[#6B5D53]" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        ) : null}
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap gap-2">
          {search.trim() ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
              style={financeFilterChipStyle}
            >
              Busca: {search.trim()} <span>×</span>
            </button>
          ) : null}
          {statusFilter !== 'all' ? (
            <button
              type="button"
              onClick={() => onStatusFilterChange('all')}
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
              style={financeFilterChipStyle}
            >
              Status: {chargeStatusConfig[statusFilter].label} <span>×</span>
            </button>
          ) : null}
          {methodFilter !== 'all' ? (
            <button
              type="button"
              onClick={() => onMethodFilterChange('all')}
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
              style={financeFilterChipStyle}
            >
              Meio: {getPaymentMethodChipLabel(methodFilter)} <span>×</span>
            </button>
          ) : null}
        </div>
      ) : null}

      {filteredCharges.length === 0 ? (
        <ListEmptyState
          message="Nenhuma cobrança encontrada"
          hint="Ajuste busca, status ou meio de pagamento."
          onClear={hasActiveFilters ? onClearFilters : undefined}
        />
      ) : (
        <div className={`grid gap-4 ${selectedCharge ? 'xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
          <DataTable
            rows={filteredCharges}
            columns={columns}
            rowKey={(row) => row.id}
            onRowClick={onSelectCharge}
            selectedRowKey={selectedCharge?.id ?? null}
            getRowClassName={chargeRowAccent}
          />
          {selectedCharge ? <ChargeDetailPanel charge={selectedCharge} onClose={onCloseCharge} /> : null}
        </div>
      )}
    </>
  );
}
