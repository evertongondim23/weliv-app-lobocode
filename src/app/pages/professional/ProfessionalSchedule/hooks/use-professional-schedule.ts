import { format } from 'date-fns';
import { useState } from 'react';
import { generateAvailableSlots } from '../../../../data/mockData';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import { UPCOMING_FREE_SLOTS_PREVIEW } from '../constants/professional-schedule.constants';

export function useProfessionalSchedule() {
  const { user } = useAuth();
  const { appointments, professionals, updateAppointment } = useData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const professional = professionals.find((p) => p.id === user?.id);
  const myAppointments = appointments.filter((apt) => apt.professionalId === user?.id);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayAppointments = myAppointments.filter((apt) => apt.date === selectedDateStr);

  const availableSlots = professional ? generateAvailableSlots(professional, selectedDate) : [];
  const bookedSlots = dayAppointments.map((apt) => apt.time);
  const freeSlots = availableSlots.filter((slot) => !bookedSlots.includes(slot));
  const upcomingFreeSlots = freeSlots.slice(0, UPCOMING_FREE_SLOTS_PREVIEW);

  const handleConfirmAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'confirmed' });
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'completed' });
  };

  const handleMarkNoShow = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'no-show' });
  };

  return {
    userId: user?.id,
    selectedDate: {
      date: selectedDate,
      onSelectDate: setSelectedDate,
    },
    calendar: {
      freeSlotsCount: freeSlots.length,
      dayAppointmentsCount: dayAppointments.length,
      upcomingFreeSlots,
    },
    detail: {
      selectedDate,
      dayAppointments,
      freeSlots,
      onConfirm: handleConfirmAppointment,
      onComplete: handleCompleteAppointment,
      onMarkNoShow: handleMarkNoShow,
    },
  };
}
