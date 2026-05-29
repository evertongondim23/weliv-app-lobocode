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
import type { RecoveryStage } from '../../../services/defaultRisk.service';
import { DataTable } from '../../../components/tables/DataTable';
import { financeBorderStyle, financeFilterChipStyle } from '../../../utils/financeUi';
import { ListEmptyState } from '../components/list-empty-state';
import { RecoveryDetailPanel } from '../components/recovery-detail-panel';
import { riskConfig, stageLabels } from '../constants/admin-charges-page.constants';
import type { RecoveryTabSectionProps } from '../types/admin-charges-page.types';
import { recoveryRowAccent } from '../utils/admin-charges-page.utils';

export function RecoveryTabSection({
  search,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  planFilter,
  onPlanFilterChange,
  stageFilter,
  onStageFilterChange,
  hasActiveFilters,
  onClearFilters,
  filteredCases,
  columns,
  selectedCase,
  onSelectCase,
  onCloseCase,
}: RecoveryTabSectionProps) {
  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="relative flex-1 min-w-0">
          <FileSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5D53]" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Paciente, ID caso, plano ou unidade..."
            className="pl-9 border-2 bg-white"
            style={financeBorderStyle}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:min-w-[520px]">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
              Risco
            </p>
            <Select value={riskFilter} onValueChange={(v) => onRiskFilterChange(v as typeof riskFilter)}>
              <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                <SelectValue placeholder="Risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {(['critico', 'alto', 'moderado', 'baixo'] as const).map((r) => (
                  <SelectItem key={r} value={r}>
                    {riskConfig[r].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
              Plano
            </p>
            <Select value={planFilter} onValueChange={(v) => onPlanFilterChange(v as typeof planFilter)}>
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
              Etapa
            </p>
            <Select value={stageFilter} onValueChange={(v) => onStageFilterChange(v as typeof stageFilter)}>
              <SelectTrigger className="border-2 bg-white w-full" style={financeBorderStyle}>
                <SelectValue placeholder="Etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {(Object.entries(stageLabels) as [RecoveryStage, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <CardDescription>{filteredCases.length} caso(s) · críticos primeiro</CardDescription>
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
          {riskFilter !== 'all' ? (
            <button
              type="button"
              onClick={() => onRiskFilterChange('all')}
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
              style={financeFilterChipStyle}
            >
              Risco: {riskConfig[riskFilter].label} <span>×</span>
            </button>
          ) : null}
          {planFilter !== 'all' ? (
            <button
              type="button"
              onClick={() => onPlanFilterChange('all')}
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
              style={financeFilterChipStyle}
            >
              Plano: {planFilter === 'particular' ? 'Particular' : 'Convênio'} <span>×</span>
            </button>
          ) : null}
          {stageFilter !== 'all' ? (
            <button
              type="button"
              onClick={() => onStageFilterChange('all')}
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
              style={financeFilterChipStyle}
            >
              Etapa: {stageLabels[stageFilter]} <span>×</span>
            </button>
          ) : null}
        </div>
      ) : null}

      {filteredCases.length === 0 ? (
        <ListEmptyState
          message="Nenhum caso encontrado"
          hint="Ajuste risco, plano ou etapa de recuperação."
          onClear={hasActiveFilters ? onClearFilters : undefined}
        />
      ) : (
        <div className={`grid gap-4 ${selectedCase ? 'xl:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
          <DataTable
            rows={filteredCases}
            columns={columns}
            rowKey={(row) => row.id}
            onRowClick={onSelectCase}
            selectedRowKey={selectedCase?.id ?? null}
            getRowClassName={recoveryRowAccent}
          />
          {selectedCase ? <RecoveryDetailPanel case_={selectedCase} onClose={onCloseCase} /> : null}
        </div>
      )}
    </>
  );
}
