import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { getPatientSlotAvailability } from '../../../../data/mockData';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import {
  findRescheduleAppointment,
  getAvailableSlotsFromRows,
  getBookedTimesForDay,
  getDepositInfo,
  getStartOfToday,
  parseBookingSearchParams,
} from '../utils/book-appointment.utils';

export function useBookAppointment() {
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

  const professional = professionals.find((p) => p.id === professionalId);

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showWaitingListDialog, setShowWaitingListDialog] = useState(false);

  const today = useMemo(() => getStartOfToday(), []);

  const { rescheduleId, prefillDate, prefillTime } = useMemo(
    () => parseBookingSearchParams(location.search),
    [location.search],
  );

  const originalAppointment = useMemo(
    () => findRescheduleAppointment(appointments, rescheduleId, user?.id),
    [appointments, rescheduleId, user?.id],
  );

  const isRescheduling = Boolean(originalAppointment);

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  const bookedTimesForDay = useMemo(() => {
    if (!professional || !selectedDate) return [];
    return getBookedTimesForDay(appointments, professional.id, selectedDateStr);
  }, [appointments, professional, selectedDate, selectedDateStr]);

  const slotRows = useMemo(() => {
    if (!professional || !selectedDate) return [];
    return getPatientSlotAvailability(professional, selectedDate, bookedTimesForDay);
  }, [professional, selectedDate, bookedTimesForDay]);

  const availableSlots = useMemo(() => getAvailableSlotsFromRows(slotRows), [slotRows]);

  const depositInfo = useMemo(
    () => (professional ? getDepositInfo(professional) : { depositAmount: 0, requiresDeposit: false }),
    [professional],
  );

  useEffect(() => {
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
  }, [prefillDate, prefillTime]);

  useEffect(() => {
    if (!selectedDate || !selectedTime) return;

    const row = slotRows.find((r) => r.slot === selectedTime);
    if (!row || row.status !== 'available') {
      setSelectedTime(undefined);
      toast.info('Esse horário não está mais disponível. Escolha outro.');
    }
  }, [selectedDate, selectedTime, slotRows]);

  const onSelectDate = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  }, []);

  const completeBooking = useCallback(() => {
    if (!selectedDate || !selectedTime || !user || !professional) return;

    const { depositAmount, requiresDeposit } = depositInfo;

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
      depositAmount,
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
  }, [
    selectedDate,
    selectedTime,
    user,
    professional,
    depositInfo,
    isRescheduling,
    originalAppointment,
    updateAppointment,
    addNotification,
    createAppointment,
    processPayment,
    navigate,
  ]);

  const handleConfirmBooking = useCallback(() => {
    if (!selectedDate || !selectedTime) {
      toast.error('Selecione data e horário para continuar');
      return;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (depositInfo.requiresDeposit && !isRescheduling) {
      setShowPaymentDialog(true);
    } else {
      completeBooking();
    }
  }, [selectedDate, selectedTime, user, depositInfo.requiresDeposit, isRescheduling, completeBooking]);

  const handleAddToWaitingList = useCallback(() => {
    if (!selectedDate || !selectedTime || !user || !professional) return;

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
  }, [selectedDate, selectedTime, user, professional, addToWaitingList]);

  return {
    professional,
    notFound: !professional,
    navigateToSearch: () => navigate('/patient/search'),
    isRescheduling,
    depositInfo,
    today,
    selectedDate,
    selectedTime,
    calendar: {
      selectedDate,
      today,
      onSelectDate,
    },
    slots: {
      selectedDate,
      selectedTime,
      slotRows,
      availableSlots,
      onSelectTime: setSelectedTime,
      onOpenWaitingList: () => setShowWaitingListDialog(true),
    },
    summary: {
      selectedDate,
      selectedTime,
      depositInfo,
      isRescheduling,
      onConfirm: handleConfirmBooking,
    },
    paymentDialog: {
      open: showPaymentDialog,
      onOpenChange: setShowPaymentDialog,
      onConfirm: completeBooking,
    },
    waitingListDialog: {
      open: showWaitingListDialog,
      onOpenChange: setShowWaitingListDialog,
      selectedDate,
      selectedTime,
      onConfirm: handleAddToWaitingList,
    },
  };
}
