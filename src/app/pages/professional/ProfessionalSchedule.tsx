import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Clock, User, Phone, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateAvailableSlots, mockPatients } from '../../data/mockData';
import { WelcomeCard } from '../../components/common';

export function ProfessionalSchedule() {
  const { user } = useAuth();
  const { appointments, professionals, updateAppointment } = useData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const professional = professionals.find(p => p.id === user?.id);
  const myAppointments = appointments.filter(apt => apt.professionalId === user?.id);
  
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayAppointments = myAppointments.filter(apt => apt.date === selectedDateStr);

  const availableSlots = professional ? generateAvailableSlots(professional, selectedDate) : [];
  const bookedSlots = dayAppointments.map(apt => apt.time);
  const freeSlots = availableSlots.filter(slot => !bookedSlots.includes(slot));
  const upcomingFreeSlots = freeSlots.slice(0, 8);

  const handleConfirmAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'confirmed' });
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'completed' });
  };

  const handleMarkNoShow = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'no-show' });
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl mb-2" style={{ color: '#4A3728' }}>Agenda</h1>
        <p className="text-sm lg:text-base" style={{ color: '#6B5D53' }}>
          Gerencie seus horários e consultas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Calendar Card */}
        <Card className="lg:col-span-1 border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader>
            <CardTitle style={{ color: '#4A3728' }}>Selecione o Dia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-lg border-2"
              style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: '#6B5D53' }}>Horários disponíveis:</span>
                <Badge 
                  variant="outline"
                  className="text-sm font-bold"
                  style={{ 
                    borderColor: '#FFA500', 
                    color: '#FFA500',
                    background: 'rgba(255, 165, 0, 0.1)'
                  }}
                >
                  {freeSlots.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: '#6B5D53' }}>Consultas agendadas:</span>
                <Badge 
                  variant="outline"
                  className="text-sm font-bold"
                  style={{ 
                    borderColor: '#4A3728', 
                    color: '#4A3728',
                    background: 'rgba(74, 55, 40, 0.1)'
                  }}
                >
                  {dayAppointments.length}
                </Badge>
              </div>
            </div>

            <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFF8E7' }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                Próximos horários livres
              </p>
              {upcomingFreeSlots.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {upcomingFreeSlots.map((slot) => (
                    <span
                      key={slot}
                      className="px-2 py-1 rounded-md text-xs font-medium border"
                      style={{ borderColor: 'rgba(255, 165, 0, 0.28)', color: '#4A3728', background: 'white' }}
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: '#6B5D53' }}>
                  Sem horários livres neste dia.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appointments Card */}
        <Card className="lg:col-span-2 border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader>
            <CardTitle className="capitalize" style={{ color: '#4A3728' }}>
              {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
            <CardDescription>
              {dayAppointments.length > 0 
                ? `${dayAppointments.length} consulta${dayAppointments.length > 1 ? 's' : ''} agendada${dayAppointments.length > 1 ? 's' : ''}`
                : 'Nenhuma consulta agendada'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appointments" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="appointments">
                  Consultas ({dayAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="available">
                  Horários Livres ({freeSlots.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="appointments" className="space-y-4 mt-6">
                {dayAppointments.length === 0 ? (
                  <div className="rounded-2xl border p-5 lg:p-6" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}>
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
                      <div className="rounded-lg border p-3 bg-white" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#6B5D53' }}>Horários livres</p>
                        <p className="text-xl font-bold" style={{ color: '#4A3728' }}>{freeSlots.length}</p>
                      </div>
                      <div className="rounded-lg border p-3 bg-white" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
                        <p className="text-xs" style={{ color: '#6B5D53' }}>Consultas</p>
                        <p className="text-xl font-bold" style={{ color: '#4A3728' }}>0</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dayAppointments.sort((a, b) => a.time.localeCompare(b.time)).map(apt => {
                      const patient = mockPatients.find(p => p.id === apt.patientId);
                      
                      const statusConfig = {
                        scheduled: { 
                          color: '#FFA500', 
                          bg: 'rgba(255, 165, 0, 0.1)',
                          label: 'Agendada' 
                        },
                        confirmed: { 
                          color: '#10b981', 
                          bg: 'rgba(16, 185, 129, 0.1)',
                          label: 'Confirmada' 
                        },
                        completed: { 
                          color: '#6B5D53', 
                          bg: 'rgba(107, 93, 83, 0.1)',
                          label: 'Realizada' 
                        },
                        cancelled: { 
                          color: '#dc2626', 
                          bg: 'rgba(220, 38, 38, 0.1)',
                          label: 'Cancelada' 
                        },
                        'no-show': { 
                          color: '#dc2626', 
                          bg: 'rgba(220, 38, 38, 0.1)',
                          label: 'Falta' 
                        },
                      };

                      const config = statusConfig[apt.status];

                      return (
                        <Card 
                          key={apt.id} 
                          className="border-2"
                          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                        >
                          <CardContent className="p-4 lg:p-6">
                            <div className="flex gap-3 lg:gap-4">
                              <Avatar className="size-10 lg:size-12">
                                <AvatarFallback style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}>
                                  {patient?.name.split(' ').map(n => n[0]).join('') || 'P'}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm lg:text-base truncate" style={{ color: '#4A3728' }}>
                                      {patient?.name || 'Paciente'}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs lg:text-sm" style={{ color: '#6B5D53' }}>
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
                                      background: config.bg
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
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleConfirmAppointment(apt.id)}
                                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                                    >
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
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleCompleteAppointment(apt.id)}
                                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                                    >
                                      <CheckCircle2 className="size-3 mr-1" />
                                      Realizada
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleMarkNoShow(apt.id)}
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

              <TabsContent value="available" className="mt-6">
                {freeSlots.length === 0 ? (
                  <div className="rounded-2xl border p-5 lg:p-6 text-center" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}>
                    <div className="inline-flex p-3 rounded-xl bg-white mb-3">
                      <Clock className="size-5" style={{ color: '#FFA500' }} />
                    </div>
                    <p className="text-base font-semibold" style={{ color: '#4A3728' }}>
                      Todos os horários ocupados
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#6B5D53' }}>
                      Escolha outra data para visualizar disponibilidade.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                    {freeSlots.map(slot => (
                      <Button
                        key={slot}
                        variant="outline"
                        className="h-auto py-3 border-2 font-medium"
                        style={{ 
                          borderColor: 'rgba(255, 165, 0, 0.2)',
                          color: '#6B5D53'
                        }}
                        disabled
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
