import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Calendar, MapPin, Clock, X, Edit, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Appointment } from '../../types';
import { WelcomeCard } from '../../components/common';
import { EmptyState } from '../../components/EmptyState';
import { useNavigate } from 'react-router';

export function PatientAppointments() {
  const { user } = useAuth();
  const { appointments, professionals, cancelAppointment } = useData();
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleInfo, setShowRescheduleInfo] = useState(false);

  const myAppointments = appointments.filter(apt => apt.patientId === user?.id);
  
  const upcoming = myAppointments.filter(apt => 
    ['scheduled', 'confirmed'].includes(apt.status) && 
    new Date(`${apt.date}T${apt.time}`) >= new Date()
  );
  
  const past = myAppointments.filter(apt => 
    apt.status === 'completed' || 
    new Date(`${apt.date}T${apt.time}`) < new Date()
  );
  
  const cancelled = myAppointments.filter(apt => 
    apt.status === 'cancelled' || apt.status === 'no-show'
  );

  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    
    cancelAppointment(selectedAppointment.id);
    toast.success('Consulta cancelada com sucesso');
    setShowCancelDialog(false);
    setSelectedAppointment(null);
  };

  const handleReschedule = (appointment: Appointment) => {
    const professional = professionals.find(p => p.id === appointment.professionalId);
    
    if (!professional?.remarcationEnabled) {
      toast.error('Este profissional não permite remarcações');
      return;
    }

    if (appointment.remarcationCount >= professional.remarcationLimit) {
      toast.error(`Limite de ${professional.remarcationLimit} remarcações atingido`);
      return;
    }

    setSelectedAppointment(appointment);
    setShowRescheduleInfo(true);
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const professional = professionals.find(p => p.id === appointment.professionalId);
    if (!professional) return null;

    const statusColors = {
      scheduled: 'secondary',
      confirmed: 'default',
      completed: 'outline',
      cancelled: 'destructive',
      'no-show': 'destructive',
    };

    const statusLabels = {
      scheduled: 'Agendada',
      confirmed: 'Confirmada',
      completed: 'Realizada',
      cancelled: 'Cancelada',
      'no-show': 'Falta',
    };

    return (
      <Card className="border-2 overflow-hidden hover:shadow-md transition-all" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
        <div className="h-1 w-full" style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }} />
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="size-16 border-2" style={{ borderColor: '#FFA500' }}>
              <AvatarImage src={professional.avatar} alt={professional.name} />
              <AvatarFallback style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}>
                {professional.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: '#4A3728' }}>{professional.name}</h3>
                  <p className="text-sm text-muted-foreground">{professional.specialty}</p>
                </div>
                <Badge
                  variant={statusColors[appointment.status] as any}
                  style={appointment.status === 'confirmed'
                    ? { background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white', border: 'none' }
                    : {}}
                >
                  {statusLabels[appointment.status]}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  <span>{format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
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
                      style={{ borderColor: 'rgba(255, 165, 0, 0.2)', color: '#4A3728' }}
                      onClick={() => handleReschedule(appointment)}
                    >
                      <Edit className="size-4 mr-2" />
                      Remarcar
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-2 hover:bg-red-50"
                    style={{ borderColor: 'rgba(239, 68, 68, 0.25)', color: '#b91c1c' }}
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setShowCancelDialog(true);
                    }}
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
  };

  const EmptyTab = ({ title, description }: { title: string; description: string }) => (
    <EmptyState icon={Calendar} title={title} description={description} />
  );

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={Calendar}
        title="Minhas Consultas"
        subtitle="Gerencie seus agendamentos e histórico"
      />

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList
          className="grid w-full grid-cols-3 h-auto p-1 border-2 bg-white"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
        >
          <TabsTrigger
            value="upcoming"
            className="rounded-lg text-[#6B5D53] data-[state=active]:text-white data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)] data-[state=active]:shadow-sm"
          >
            Próximas ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="rounded-lg text-[#6B5D53] data-[state=active]:text-white data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)] data-[state=active]:shadow-sm"
          >
            Realizadas ({past.length})
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="rounded-lg text-[#6B5D53] data-[state=active]:text-white data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)] data-[state=active]:shadow-sm"
          >
            Canceladas ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcoming.length === 0 ? (
            <EmptyTab
              title="Nenhuma consulta agendada"
              description="Quando você agendar uma consulta, ela aparecerá aqui"
            />
          ) : (
            upcoming.map(apt => <AppointmentCard key={apt.id} appointment={apt} />)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {past.length === 0 ? (
            <EmptyTab
              title="Nenhuma consulta realizada ainda"
              description="Seu histórico de consultas será exibido aqui"
            />
          ) : (
            past.map(apt => <AppointmentCard key={apt.id} appointment={apt} />)
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4 mt-6">
          {cancelled.length === 0 ? (
            <EmptyTab
              title="Nenhuma consulta cancelada"
              description="Consultas canceladas aparecerão nesta aba"
            />
          ) : (
            cancelled.map(apt => <AppointmentCard key={apt.id} appointment={apt} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: '#4A3728' }}>Cancelar Consulta</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment?.depositPaid && (
            <div className="py-4">
              <Badge variant="outline" className="mb-2 border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', color: '#FFA500' }}>
                Atenção
              </Badge>
              <p className="text-sm text-muted-foreground">
                O depósito pago (R$ {selectedAppointment.depositAmount.toFixed(2)}) poderá não ser reembolsado conforme política do profissional.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              className="border-2"
              style={{ borderColor: 'rgba(255, 165, 0, 0.2)', color: '#4A3728' }}
            >
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Info Dialog */}
      <Dialog open={showRescheduleInfo} onOpenChange={setShowRescheduleInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: '#4A3728' }}>Remarcar Consulta</DialogTitle>
            <DialogDescription>
              Selecione uma nova data e horário para sua consulta.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedAppointment && (
              <>
                <div className="p-4 rounded-lg border-2" style={{ background: '#FFF8E7', borderColor: 'rgba(255, 165, 0, 0.2)' }}>
                  <p className="text-sm">
                    <strong>Remarcações restantes:</strong>{' '}
                    {professionals.find(p => p.id === selectedAppointment.professionalId)?.remarcationLimit! - 
                     selectedAppointment.remarcationCount}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Como remarcar:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Cancele esta consulta atual</li>
                    <li>Busque o profissional novamente</li>
                    <li>Selecione uma nova data e horário</li>
                  </ol>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                if (!selectedAppointment) return;
                setShowRescheduleInfo(false);
                const query = new URLSearchParams({
                  reschedule: selectedAppointment.id,
                  date: selectedAppointment.date,
                  time: selectedAppointment.time,
                });
                navigate(`/patient/book/${selectedAppointment.professionalId}?${query.toString()}`);
              }}
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
            >
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}