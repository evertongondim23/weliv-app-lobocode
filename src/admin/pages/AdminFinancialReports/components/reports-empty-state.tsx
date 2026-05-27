import { FileSearch } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import { financeBorderStyle } from '../../../utils/financeUi';
import type { ReportsEmptyStateProps } from '../types/admin-financial-reports-page.types';

export function ReportsEmptyState({ onClearTableFilters }: ReportsEmptyStateProps) {
  return (
    <div
      className="rounded-xl border p-8 text-center"
      style={{ ...financeBorderStyle, background: '#FAFAFA' }}
    >
      <div
        className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3"
        style={financeBorderStyle}
      >
        <FileSearch className="size-5 text-[#FFA500]" />
      </div>
      <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
        Nenhuma linha encontrada
      </p>
      <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
        Ajuste a busca ou a categoria, ou limpe os filtros.
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-4 border-2"
        style={financeBorderStyle}
        onClick={onClearTableFilters}
      >
        Limpar filtros da tabela
      </Button>
    </div>
  );
}
