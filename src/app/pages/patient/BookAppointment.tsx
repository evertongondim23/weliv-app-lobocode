import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { MapPin, DollarSign, Clock, CheckCircle2, AlertCircle, CreditCard, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateAvailableSlots } from '../../data/mockData';
import { toast } from 'sonner';

export function BookAppointment() {
  const { professionalId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    professionals,
    appointments,
    createAppointment,
    updateAppointment,
    addNotification,
    addToWaitingList,
    processPayment,
  } = useData();
  
  const professional = professionals.find(p => p.id === professionalId);
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showWaitingListDialog, setShowWaitingListDialog] = useState(false);
  const today = new Date(new Date().setHours(0, 0, 0, 0));

  if (!professional) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profissional não encontrado</p>
        <Button onClick={() => navigate('/patient/search')} className="mt-4">
          Voltar para busca
        </Button>
      </div>
    );
  }

  const searchParams = new URLSearchParams(location.search);
  const rescheduleAppointmentId = searchParams.get('reschedule');
  const originalAppointment = appointments.find(
    (apt) => apt.id === rescheduleAppointmentId && apt.patientId === user?.id,
  );
  const isRescheduling = Boolean(originalAppointment);

  const availableSlots = selectedDate ? generateAvailableSlots(professional, selectedDate) : [];
  
  const depositAmount = professional.consultationPrice * (professional.depositPercentage / 100);
  const requiresDeposit = professional.depositPercentage > 0;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prefillDate = params.get('date');
    const prefillTime = params.get('time');

    if (!prefillDate && !prefillTime) return;

    if (prefillDate) {
      const parsedDate = new Date(`${prefillDate}T00:00:00`);
      if (!Number.isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
      }
    }

    if (prefillTime) {
      setSelectedTime(prefillTime);
    }
  }, [location.search]);

  useEffect(() => {
    if (!selectedDate || !selectedTime) return;

    if (!availableSlots.includes(selectedTime)) {
      setSelectedTime(undefined);
      toast.info('O horário anterior não está disponível para essa data. Escolha outro horário.');
    }
  }, [selectedDate, selectedTime, availableSlots]);

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Selecione data e horário para continuar');
      return;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (requiresDeposit && !isRescheduling) {
      setShowPaymentDialog(true);
    } else {
      completeBooking();
    }
  };

  const completeBooking = () => {
    if (!selectedDate || !selectedTime || !user) return;

    if (isRescheduling && originalAppointment) {
      updateAppointment(originalAppointment.id, {
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'confirmed',
        remarcationCount: originalAppointment.remarcationCount + 1,
      });

      addNotification({
        userId: user.id,
        title: 'Agenda remarcada',
        message: `Sua consulta foi remarcada para ${format(selectedDate, 'dd/MM/yyyy')} às ${selectedTime}`,
        type: 'appointment',
        actionUrl: '/patient/appointments',
      });

      addNotification({
        userId: professional.id,
        title: 'Consulta remarcada',
        message: `Um paciente remarcou consulta para ${format(selectedDate, 'dd/MM/yyyy')} às ${selectedTime}`,
        type: 'appointment',
        actionUrl: '/professional/schedule',
      });

      toast.success('Consulta remarcada com sucesso!', {
        description: 'A agenda foi atualizada no painel do profissional',
      });

      setShowPaymentDialog(false);
      navigate('/patient/appointments');
      return;
    }

    const appointment = createAppointment({
      patientId: user.id,
      professionalId: professional.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      type: 'presencial',
      status: 'confirmed',
      remarcationCount: 0,
      depositPaid: requiresDeposit,
      depositAmount: depositAmount,
    });

    if (requiresDeposit) {
      processPayment({
        appointmentId: appointment.id,
        patientId: user.id,
        professionalId: professional.id,
        amount: depositAmount,
        method: 'pix',
        status: 'paid',
        paidAt: new Date().toISOString(),
      });
    }

    toast.success('Agenda confirmada com sucesso!', {
      description: 'O agendamento foi enviado para o painel do profissional',
    });

    setShowPaymentDialog(false);
    navigate('/patient/appointments');
  };

  const handleAddToWaitingList = () => {
    if (!selectedDate || !selectedTime || !user) return;

    addToWaitingList({
      patientId: user.id,
      professionalId: professional.id,
      desiredDate: format(selectedDate, 'yyyy-MM-dd'),
      desiredTime: selectedTime,
    });

    toast.success('Você foi adicionado à fila de espera!', {
      description: 'Você será notificado quando houver disponibilidade',
    });

    setShowWaitingListDialog(false);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <Button
        variant="outline"
        onClick={() => navigate('/patient/search')}
        className="w-fit border-2 hover:bg-[#FFF8E7]"
        style={{ borderColor: 'rgba(255, 165, 0, 0.2)', color: '#4A3728' }}
      >
        <ArrowLeft className="size-4 mr-2" />
        Voltar
      </Button>

      <Card className="border-2 shadow-md overflow-hidden" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }} />
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6 items-center">
            <Avatar className="size-20 border-2" style={{ borderColor: '#FFA500' }}>
              <AvatarImage src={professional.avatar} alt={professional.name} />
              <AvatarFallback style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}>
                {professional.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#4A3728' }}>{professional.name}</h1>
              <p className="text-muted-foreground mb-2">{professional.registrationNumber}</p>
              <Badge style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white', border: 'none' }}>
                {professional.specialty}
              </Badge>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground rounded-lg px-3 py-2 border" style={{ borderColor: 'rgba(74, 55, 40, 0.12)' }}>
              <MapPin className="size-4" />
              <span className="text-sm">{professional.address}</span>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 border" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFF8E7' }}>
              <DollarSign className="size-4 text-green-600" />
              <span className="font-semibold" style={{ color: '#4A3728' }}>R$ {professional.consultationPrice.toFixed(2)}</span>
            </div>

            {requiresDeposit && (
              <Alert className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFF8E7' }}>
                <CreditCard className="size-4" />
                <AlertDescription>
                  Este profissional requer {professional.depositPercentage}% de depósito no ato da marcação (R$ {depositAmount.toFixed(2)})
                </AlertDescription>
              </Alert>
            )}
          </div>

          {professional.remarcationEnabled && (
            <Alert className="mb-1 border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
              <AlertCircle className="size-4" />
              <AlertDescription>
                Remarcações permitidas: até {professional.remarcationLimit}x por consulta
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 shadow-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader className="border-b" style={{ borderColor: 'rgba(74, 55, 40, 0.08)', background: 'linear-gradient(135deg, #FFF8E7, #FFFFFF)' }}>
            <CardTitle style={{ color: '#4A3728' }}>Selecione a Data</CardTitle>
            <CardDescription>Escolha um dia disponível</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime(undefined);
              }}
              disabled={{ before: today }}
              locale={ptBR}
              className="rounded-md border p-2"
              style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
            />
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader className="border-b" style={{ borderColor: 'rgba(74, 55, 40, 0.08)', background: 'linear-gradient(135deg, #FFF8E7, #FFFFFF)' }}>
            <CardTitle style={{ color: '#4A3728' }}>Horários Disponíveis</CardTitle>
            <CardDescription>
              {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-10 text-muted-foreground">
                <div className="inline-flex p-3 rounded-full mb-3" style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}>
                  <Clock className="size-8 text-[#FFA500]" />
                </div>
                <p>Selecione uma data para ver os horários disponíveis</p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Nenhum horário disponível nesta data</p>
                {professional.waitingListEnabled && (
                  <Button
                    variant="outline"
                    className="border-2 hover:bg-[#FFF8E7]"
                    style={{ borderColor: 'rgba(255, 165, 0, 0.2)', color: '#4A3728' }}
                    onClick={() => setShowWaitingListDialog(true)}
                  >
                    Entrar na fila de espera
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {availableSlots.map(slot => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? 'default' : 'outline'}
                    className="w-full border-2"
                    style={
                      selectedTime === slot
                        ? { background: 'linear-gradient(135deg, #FFA500, #FF8C00)', borderColor: 'transparent' }
                        : { borderColor: 'rgba(255, 165, 0, 0.2)', color: '#4A3728' }
                    }
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedDate && selectedTime && (
        <Card className="border-2 shadow-md" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: 'linear-gradient(135deg, #FFF8E7, #FFFFFF)' }}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="size-6 text-[#FFA500] mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2" style={{ color: '#4A3728' }}>Resumo da Consulta</h3>
                <div className="space-y-1 text-sm mb-4">
                  <p><strong>Profissional:</strong> {professional.name}</p>
                  <p><strong>Data:</strong> {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                  <p><strong>Horário:</strong> {selectedTime}</p>
                  <p><strong>Tipo:</strong> Consulta Presencial</p>
                  <p><strong>Valor:</strong> R$ {professional.consultationPrice.toFixed(2)}</p>
                  {requiresDeposit && (
                    <p><strong>Depósito necessário:</strong> R$ {depositAmount.toFixed(2)}</p>
                  )}
                </div>
                <Button
                  onClick={handleConfirmBooking}
                  className="w-full"
                  style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
                >
                  {isRescheduling ? 'Confirmar Remarcação' : 'Confirmar Agendamento'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pagamento do Depósito</DialogTitle>
            <DialogDescription>
              Complete o pagamento do depósito para confirmar sua consulta.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFF8E7' }}>
              <CreditCard className="size-4" />
              <AlertDescription>
                Você será cobrado {professional.depositPercentage}% do valor total agora. O restante será pago na consulta.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm font-medium">Métodos de pagamento disponíveis:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto py-3 border-2 hover:bg-[#FFF8E7]" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
                  <div className="text-center">
                    <CreditCard className="size-5 mx-auto mb-1" />
                    <span className="text-xs">PIX</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-3 border-2 hover:bg-[#FFF8E7]" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
                  <div className="text-center">
                    <CreditCard className="size-5 mx-auto mb-1" />
                    <span className="text-xs">Cartão</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
              Cancelar
            </Button>
            <Button onClick={completeBooking} style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
              Pagar e Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waiting List Dialog */}
      <Dialog open={showWaitingListDialog} onOpenChange={setShowWaitingListDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fila de Espera</DialogTitle>
            <DialogDescription>
              Entre na fila de espera para ser notificado quando houver disponibilidade.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFF8E7' }}>
              <AlertCircle className="size-4" />
              <AlertDescription>
                Data desejada: {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} às {selectedTime}
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWaitingListDialog(false)} className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
              Cancelar
            </Button>
            <Button onClick={handleAddToWaitingList} style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
              Confirmar Interesse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}