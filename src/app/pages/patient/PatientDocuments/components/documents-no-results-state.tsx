import { RotateCcw, Search } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import {
  HEADER_BORDER_STYLE,
  OUTLINE_BUTTON_STYLE,
  TITLE_COLOR,
  MUTED_COLOR,
} from '../constants/patient-documents.constants';
import type { DocumentsNoResultsStateProps } from '../types/patient-documents.types';

export function DocumentsNoResultsState({
  totalCount,
  onClearFilters,
}: DocumentsNoResultsStateProps) {
  return (
    <div
      className="rounded-2xl border bg-white p-8 text-center shadow-sm"
      style={HEADER_BORDER_STYLE}
    >
      <div
        className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border"
        style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFF8E7' }}
      >
        <Search className="size-7 text-[#FFA500]" />
      </div>
      <p className="text-lg font-semibold" style={{ color: TITLE_COLOR }}>
        Nenhum documento encontrado
      </p>
      <p className="mt-2 text-sm max-w-md mx-auto" style={{ color: MUTED_COLOR }}>
        Ajuste a busca ou o período — você tem {totalCount}{' '}
        {totalCount === 1 ? 'documento salvo' : 'documentos salvos'} no total.
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-6 border-2"
        style={OUTLINE_BUTTON_STYLE}
        onClick={onClearFilters}
      >
        <RotateCcw className="size-4 mr-2" />
        Limpar busca e período
      </Button>
    </div>
  );
}
