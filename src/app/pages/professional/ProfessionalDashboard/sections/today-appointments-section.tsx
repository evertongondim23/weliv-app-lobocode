import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight, Calendar, Clock, Plus } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { CARD_BORDER_STYLE, PRIMARY_GRADIENT } from '../constants/professional-dashboard.constants';
import type { TodayAppointmentsSectionProps } from '../types/professional-dashboard.types';

export function TodayAppointmentsSection({ appointments, onNavigateSchedule }: TodayAppointmentsSectionProps) {
  return (
    <Card className="border-2" style={CARD_BORDER_STYLE}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg" style={{ color: '#4A3728' }}>
              <div className="p-2 rounded-lg" style={{ background: PRIMARY_GRADIENT }}>
                <Calendar className="size-4 lg:size-5 text-white" />
              </div>
              Consultas de Hoje
            </CardTitle>
            <CardDescription className="mt-2 text-xs lg:text-sm">
              {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
            </CardDescription>
          </div>
          {appointments.length > 0 && (
            <Badge
              style={{
                background: PRIMARY_GRADIENT,
                color: 'white',
              }}
            >
              {appointments.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <div
              className="inline-flex p-3 lg:p-4 rounded-full mb-3 lg:mb-4"
              style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
            >
              <Calendar className="size-8 lg:size-12" style={{ color: '#FFA500' }} />
            </div>
            <p className="text-base lg:text-lg mb-2" style={{ color: '#4A3728' }}>
              Nenhuma consulta para hoje
            </p>
            <p className="text-xs lg:text-sm mb-4" style={{ color: '#6B5D53' }}>
              Aproveite para organizar sua agenda
            </p>
            <Button
              onClick={onNavigateSchedule}
              style={{ background: PRIMARY_GRADIENT }}
              size="sm"
              className="lg:text-base"
            >
              <Plus className="size-4 mr-2" />
              Ver Agenda
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2 lg:space-y-3 mb-4">
              {appointments.slice(0, 4).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-2 lg:p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer group"
                  style={CARD_BORDER_STYLE}
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-1.5 lg:p-2 rounded-lg" style={{ background: 'rgba(255, 165, 0, 0.1)' }}>
                      <Clock className="size-3 lg:size-4" style={{ color: '#FFA500' }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm lg:text-base" style={{ color: '#4A3728' }}>
                        {apt.time}
                      </p>
                      <p className="text-xs lg:text-sm" style={{ color: '#6B5D53' }}>
                        Paciente #{apt.patientId.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] lg:text-xs"
                    style={{
                      borderColor: apt.status === 'confirmed' ? '#10b981' : '#FFA500',
                      color: apt.status === 'confirmed' ? '#10b981' : '#FFA500',
                    }}
                  >
                    {apt.status === 'confirmed' ? 'Confirmada' : 'Agendada'}
                  </Badge>
                </div>
              ))}
            </div>
            {appointments.length > 4 && (
              <Button
                variant="outline"
                onClick={onNavigateSchedule}
                className="w-full border-2 text-xs lg:text-sm"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)', color: '#FFA500' }}
                size="sm"
              >
                Ver todas ({appointments.length})
                <ArrowRight className="size-3 lg:size-4 ml-2" />
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
