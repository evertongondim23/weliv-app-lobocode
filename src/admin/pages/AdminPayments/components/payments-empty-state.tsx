import { FileSearch } from 'lucide-react';
import { financeBorderStyle } from '../../../utils/financeUi';

export function PaymentsEmptyState() {
  return (
    <div
      className="rounded-xl border p-10 text-center"
      style={{ ...financeBorderStyle, background: '#FAFAFA' }}
    >
      <div
        className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3"
        style={financeBorderStyle}
      >
        <FileSearch className="size-5 text-[#FFA500]" />
      </div>
      <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
        Nenhum pagamento encontrado
      </p>
      <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
        Ajuste busca ou filtros de status, gateway e meio.
      </p>
    </div>
  );
}
