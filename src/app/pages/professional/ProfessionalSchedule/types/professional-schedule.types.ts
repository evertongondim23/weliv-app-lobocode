import type { Appointment } from '../../../../types';

export interface AppointmentStatusDisplay {
  color: string;
  bg: string;
  label: string;
}

export interface CalendarSectionProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  freeSlotsCount: number;
  dayAppointmentsCount: number;
  upcomingFreeSlots: string[];
}

export interface ScheduleDetailSectionProps {
  selectedDate: Date;
  dayAppointments: Appointment[];
  freeSlots: string[];
  onConfirm: (appointmentId: string) => void;
  onComplete: (appointmentId: string) => void;
  onMarkNoShow: (appointmentId: string) => void;
}

export interface AppointmentsTabSectionProps {
  dayAppointments: Appointment[];
  freeSlotsCount: number;
  onConfirm: (appointmentId: string) => void;
  onComplete: (appointmentId: string) => void;
  onMarkNoShow: (appointmentId: string) => void;
}

export interface AvailableSlotsTabSectionProps {
  freeSlots: string[];
}
