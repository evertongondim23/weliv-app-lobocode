import { FileSearch } from 'lucide-react';
import { appointmentsCardBorderStyle } from '../constants/admin-appointments-page.constants';

export function AppointmentsEmptyState() {
  return (
    <div
      className="rounded-xl border p-10 text-center"
      style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FAFAFA' }}
    >
      <div
        className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3"
        style={appointmentsCardBorderStyle}
      >
        <FileSearch className="size-5 text-[#FFA500]" />
      </div>
      <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
        Nenhum atendimento encontrado
      </p>
      <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
        Ajuste busca ou filtros de status / SLA.
      </p>
    </div>
  );
}
