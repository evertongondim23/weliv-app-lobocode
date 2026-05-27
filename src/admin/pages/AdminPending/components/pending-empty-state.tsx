import { FileSearch } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import { pendingCardBorderStyle } from '../constants/admin-pending-page.constants';
import type { PendingEmptyStateProps } from '../types/admin-pending-page.types';

export function PendingEmptyState({ hasActiveFilters, onClearFilters }: PendingEmptyStateProps) {
  return (
    <div
      className="rounded-xl border p-8 text-center"
      style={{ ...pendingCardBorderStyle, background: '#FAFAFA' }}
    >
      <div
        className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3"
        style={pendingCardBorderStyle}
      >
        <FileSearch className="size-5 text-[#FFA500]" />
      </div>
      <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
        Nenhuma pendência encontrada
      </p>
      <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
        Ajuste os filtros ou limpe a busca para ver novamente a lista.
      </p>
      {hasActiveFilters ? (
        <Button type="button" className="mt-4" variant="outline" onClick={onClearFilters}>
          Limpar filtros
        </Button>
      ) : null}
    </div>
  );
}
