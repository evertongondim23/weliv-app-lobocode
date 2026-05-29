import { RotateCcw, Search } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import {
  FIELD_BORDER_STYLE,
  HEADER_BORDER_STYLE,
  MUTED_COLOR,
  PERIOD_OPTIONS,
  TITLE_COLOR,
} from '../constants/patient-documents.constants';
import type { DocumentsFiltersSectionProps, PeriodPreset } from '../types/patient-documents.types';

export function DocumentsFiltersSection({
  searchQuery,
  periodPreset,
  hasActiveFilters,
  filteredCount,
  onSearchChange,
  onPeriodChange,
  onClearFilters,
}: DocumentsFiltersSectionProps) {
  return (
    <div
      className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm space-y-3"
      style={HEADER_BORDER_STYLE}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="doc-search">Buscar documentos</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B5D53]" />
            <Input
              id="doc-search"
              type="search"
              placeholder="Nome do arquivo, tipo ou ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-2 pl-9"
              style={FIELD_BORDER_STYLE}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="w-full lg:w-[220px] space-y-2">
          <Label htmlFor="doc-period">Período</Label>
          <Select value={periodPreset} onValueChange={(v) => onPeriodChange(v as PeriodPreset)}>
            <SelectTrigger id="doc-period" className="border-2 w-full" style={FIELD_BORDER_STYLE}>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            className="w-full lg:w-auto shrink-0 text-[#6B5D53]"
            onClick={onClearFilters}
          >
            <RotateCcw className="size-4 mr-2" />
            Limpar filtros
          </Button>
        ) : null}
      </div>
      <p className="text-xs md:text-sm" style={{ color: MUTED_COLOR }}>
        <span className="font-medium tabular-nums" style={{ color: TITLE_COLOR }}>
          {filteredCount}
        </span>{' '}
        {filteredCount === 1 ? 'documento corresponde' : 'documentos correspondem'}
        {hasActiveFilters ? ' aos filtros.' : '.'}
      </p>
    </div>
  );
}
