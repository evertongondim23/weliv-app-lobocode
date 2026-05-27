import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { CARD_BORDER_STYLE, TEXT_MUTED_COLOR, TEXT_PRIMARY_COLOR } from '../constants/patient-dashboard.constants';
import type { AppointmentPreviewCardProps } from '../types/patient-dashboard.types';

export function AppointmentPreviewCard({
  appointment,
  professional,
  onNavigate,
}: AppointmentPreviewCardProps) {
  return (
    <div
      className="flex items-center justify-between p-2 lg:p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer group"
      style={CARD_BORDER_STYLE}
      onClick={onNavigate}
    >
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="p-1.5 lg:p-2 rounded-lg" style={{ background: 'rgba(255, 165, 0, 0.1)' }}>
          <Clock className="size-3 lg:size-4" style={{ color: '#FFA500' }} />
        </div>
        <div>
          <p className="font-medium text-sm lg:text-base" style={{ color: TEXT_PRIMARY_COLOR }}>
            {appointment.time} • {format(new Date(appointment.date), "dd 'de' MMM", { locale: ptBR })}
          </p>
          <p className="text-xs lg:text-sm" style={{ color: TEXT_MUTED_COLOR }}>
            {professional?.name || 'Profissional'}
            {professional?.specialty ? ` • ${professional.specialty}` : ''}
          </p>
        </div>
      </div>
      <Badge
        variant="outline"
        className="text-[10px] lg:text-xs"
        style={{
          borderColor: appointment.status === 'confirmed' ? '#10b981' : '#FFA500',
          color: appointment.status === 'confirmed' ? '#10b981' : '#FFA500',
        }}
      >
        {appointment.status === 'confirmed' ? 'Confirmada' : 'Agendada'}
      </Badge>
    </div>
  );
}
