import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import type { Appointment } from '../../../../types';
import { partitionPatientAppointments } from '../utils/patient-appointments.utils';

export function usePatientAppointments() {
  const { user } = useAuth();
  const { appointments, professionals, cancelAppointment } = useData();
  const navigate = useNavigate();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleInfo, setShowRescheduleInfo] = useState(false);

  const { upcoming, past, cancelled } = useMemo(
    () => partitionPatientAppointments(appointments, user?.id),
    [appointments, user?.id],
  );

  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;

    cancelAppointment(selectedAppointment.id);
    toast.success('Consulta cancelada com sucesso');
    setShowCancelDialog(false);
    setSelectedAppointment(null);
  };

  const handleReschedule = (appointment: Appointment) => {
    const professional = professionals.find((p) => p.id === appointment.professionalId);

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

  const openCancelDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };

  const handleRescheduleContinue = () => {
    if (!selectedAppointment) return;

    setShowRescheduleInfo(false);
    const query = new URLSearchParams({
      reschedule: selectedAppointment.id,
      date: selectedAppointment.date,
      time: selectedAppointment.time,
    });
    navigate(`/patient/book/${selectedAppointment.professionalId}?${query.toString()}`);
  };

  return {
    tabs: {
      upcoming,
      past,
      cancelled,
      professionals,
      onCancel: openCancelDialog,
      onReschedule: handleReschedule,
    },
    cancelDialog: {
      open: showCancelDialog,
      onOpenChange: setShowCancelDialog,
      appointment: selectedAppointment,
      onConfirm: handleCancelAppointment,
    },
    rescheduleDialog: {
      open: showRescheduleInfo,
      onOpenChange: setShowRescheduleInfo,
      appointment: selectedAppointment,
      professionals,
      onContinue: handleRescheduleContinue,
    },
  };
}
