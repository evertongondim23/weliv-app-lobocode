import type { Appointment, Professional } from '../../../../types';

export type PatientAppointmentCardProps = {
  appointment: Appointment;
  professional: Professional;
  onCancel: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
};

export type AppointmentStatusBadgeProps = {
  status: Appointment['status'];
};

export type AppointmentsTabPanelProps = {
  appointments: Appointment[];
  professionals: Professional[];
  emptyTitle: string;
  emptyDescription: string;
  onCancel: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
};

export type AppointmentsTabsSectionProps = {
  upcoming: Appointment[];
  past: Appointment[];
  cancelled: Appointment[];
  professionals: Professional[];
  onCancel: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
};

export type CancelAppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onConfirm: () => void;
};

export type RescheduleAppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  professionals: Professional[];
  onContinue: () => void;
};
