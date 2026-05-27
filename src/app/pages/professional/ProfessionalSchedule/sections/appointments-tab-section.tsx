import { CheckCircle2, Clock, Mail, Phone, XCircle } from 'lucide-react';
import { mockPatients } from '../../../../data/mockData';
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { TabsContent } from '../../../../components/ui/tabs';
import {
  APPOINTMENT_STATUS_CONFIG,
  AVATAR_FALLBACK_STYLE,
  CARD_BORDER_STYLE,
  CONFIRM_BUTTON_STYLE,
} from '../constants/professional-schedule.constants';
import type { AppointmentsTabSectionProps } from '../types/professional-schedule.types';

export function AppointmentsTabSection({
  dayAppointments,
  freeSlotsCount,
  onConfirm,
  onComplete,
  onMarkNoShow,
}: AppointmentsTabSectionProps) {
  return (
    <TabsContent value="appointments" className="space-y-4 mt-6">
      {dayAppointments.length === 0 ? (
        <div
          className="rounded-2xl border p-5 lg:p-6"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex p-2.5 rounded-xl bg-white">
              <Clock className="size-5" style={{ color: '#FFA500' }} />
            </div>
            <div>
              <p className="text-base font-semibold" style={{ color: '#4A3728' }}>
                Nenhuma consulta agendada
              </p>
              <p className="text-sm" style={{ color: '#6B5D53' }}>
                Dia livre para novos atendimentos.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border p-3 bg-white" style={CARD_BORDER_STYLE}>
              <p className="text-xs" style={{ color: '#6B5D53' }}>
                Horários livres
              </p>
              <p className="text-xl font-bold" style={{ color: '#4A3728' }}>
                {freeSlotsCount}
              </p>
            </div>
            <div className="rounded-lg border p-3 bg-white" style={CARD_BORDER_STYLE}>
              <p className="text-xs" style={{ color: '#6B5D53' }}>
                Consultas
              </p>
              <p className="text-xl font-bold" style={{ color: '#4A3728' }}>
                0
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {dayAppointments
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((apt) => {
              const patient = mockPatients.find((p) => p.id === apt.patientId);
              const config = APPOINTMENT_STATUS_CONFIG[apt.status];

              return (
                <Card key={apt.id} className="border-2" style={CARD_BORDER_STYLE}>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex gap-3 lg:gap-4">
                      <Avatar className="size-10 lg:size-12">
                        <AvatarFallback style={AVATAR_FALLBACK_STYLE}>
                          {patient?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('') || 'P'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4
                              className="font-semibold text-sm lg:text-base truncate"
                              style={{ color: '#4A3728' }}
                            >
                              {patient?.name || 'Paciente'}
                            </h4>
                            <div
                              className="flex items-center gap-2 text-xs lg:text-sm"
                              style={{ color: '#6B5D53' }}
                            >
                              <Clock className="size-3" />
                              <span>{apt.time}</span>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs whitespace-nowrap"
                            style={{
                              borderColor: config.color,
                              color: config.color,
                              background: config.bg,
                            }}
                          >
                            {config.label}
                          </Badge>
                        </div>

                        {patient && (
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center gap-2 text-xs" style={{ color: '#6B5D53' }}>
                              <Phone className="size-3" />
                              <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: '#6B5D53' }}>
                              <Mail className="size-3" />
                              <span className="truncate">{patient.email}</span>
                            </div>
                          </div>
                        )}

                        {apt.status === 'scheduled' && (
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => onConfirm(apt.id)} style={CONFIRM_BUTTON_STYLE}>
                              <CheckCircle2 className="size-3 mr-1" />
                              Confirmar
                            </Button>
                            <Button size="sm" variant="outline">
                              Detalhes
                            </Button>
                          </div>
                        )}

                        {apt.status === 'confirmed' && (
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => onComplete(apt.id)} style={CONFIRM_BUTTON_STYLE}>
                              <CheckCircle2 className="size-3 mr-1" />
                              Realizada
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onMarkNoShow(apt.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="size-3 mr-1" />
                              Falta
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </TabsContent>
  );
}
