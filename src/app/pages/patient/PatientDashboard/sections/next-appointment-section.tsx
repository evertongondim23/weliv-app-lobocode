import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight, Clock } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import {
  NEXT_APPOINTMENT_CARD_STYLE,
  PRIMARY_GRADIENT,
  TEXT_MUTED_COLOR,
  TEXT_PRIMARY_COLOR,
} from '../constants/patient-dashboard.constants';
import type { NextAppointmentSectionProps } from '../types/patient-dashboard.types';

export function NextAppointmentSection({
  appointment,
  professionalName,
  onNavigate,
}: NextAppointmentSectionProps) {
  if (!appointment) return null;

  return (
    <Card
      className="border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      style={NEXT_APPOINTMENT_CARD_STYLE}
      onClick={onNavigate}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg" style={{ background: PRIMARY_GRADIENT }}>
                <Clock className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: TEXT_MUTED_COLOR }}>
                  Próxima Consulta
                </p>
                <p className="text-2xl font-bold" style={{ color: TEXT_PRIMARY_COLOR }}>
                  {appointment.time}
                </p>
              </div>
            </div>

            <div className="ml-12">
              <p className="text-sm" style={{ color: TEXT_MUTED_COLOR }}>
                {format(new Date(appointment.date), "dd 'de' MMMM", { locale: ptBR })}
              </p>
              <p className="text-sm font-medium mt-1" style={{ color: TEXT_PRIMARY_COLOR }}>
                {professionalName}
              </p>
              <Badge
                variant="outline"
                className="mt-2"
                style={{ borderColor: '#FFA500', color: '#FFA500', background: 'rgba(255, 165, 0, 0.1)' }}
              >
                {appointment.status === 'confirmed' ? 'Confirmada' : 'Agendada'}
              </Badge>
            </div>
          </div>

          <Button variant="ghost" size="icon" style={{ color: '#FFA500' }}>
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
