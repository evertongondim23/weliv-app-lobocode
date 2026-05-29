import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Edit, MapPin, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import {
  AVATAR_BORDER_COLOR,
  AVATAR_FALLBACK_STYLE,
  CANCEL_BUTTON_STYLE,
  CARD_BORDER_STYLE,
  CARD_TOP_GRADIENT_STYLE,
  RESCHEDULE_BUTTON_STYLE,
  TITLE_COLOR,
} from '../constants/patient-appointments.constants';
import type { PatientAppointmentCardProps } from '../types/patient-appointments.types';
import { AppointmentStatusBadge } from './appointment-status-badge';

export function PatientAppointmentCard({
  appointment,
  professional,
  onCancel,
  onReschedule,
}: PatientAppointmentCardProps) {
  return (
    <Card
      className="border-2 overflow-hidden hover:shadow-md transition-all"
      style={CARD_BORDER_STYLE}
    >
      <div className="h-1 w-full" style={CARD_TOP_GRADIENT_STYLE} />
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="size-16 border-2" style={{ borderColor: AVATAR_BORDER_COLOR }}>
            <AvatarImage src={professional.avatar} alt={professional.name} />
            <AvatarFallback style={AVATAR_FALLBACK_STYLE}>
              {professional.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg" style={{ color: TITLE_COLOR }}>
                  {professional.name}
                </h3>
                <p className="text-sm text-muted-foreground">{professional.specialty}</p>
              </div>
              <AppointmentStatusBadge status={appointment.status} />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>
                  {format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>{appointment.time}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>{professional.address}</span>
              </div>
            </div>

            {appointment.remarcationCount > 0 && (
              <p className="text-xs text-muted-foreground mb-3">
                Remarcações: {appointment.remarcationCount}
              </p>
            )}

            {['scheduled', 'confirmed'].includes(appointment.status) && (
              <div className="flex gap-2">
                {professional.remarcationEnabled &&
                  appointment.remarcationCount < professional.remarcationLimit && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 hover:bg-[#FFF8E7]"
                      style={RESCHEDULE_BUTTON_STYLE}
                      onClick={() => onReschedule(appointment)}
                    >
                      <Edit className="size-4 mr-2" />
                      Remarcar
                    </Button>
                  )}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 hover:bg-red-50"
                  style={CANCEL_BUTTON_STYLE}
                  onClick={() => onCancel(appointment)}
                >
                  <X className="size-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
