import type { Professional, PatientSlotStatus } from '../../../../types';

export type PatientSlotRow = {
  slot: string;
  status: PatientSlotStatus;
};

export type DepositInfo = {
  depositAmount: number;
  requiresDeposit: boolean;
};

export type BookAppointmentNotFoundProps = {
  onBack: () => void;
};

export type ProfessionalProfileSectionProps = {
  professional: Professional;
  depositInfo: DepositInfo;
};

export type AppointmentCalendarSectionProps = {
  selectedDate: Date | undefined;
  today: Date;
  onSelectDate: (date: Date | undefined) => void;
};

export type AvailableSlotsSectionProps = {
  professional: Professional;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  slotRows: PatientSlotRow[];
  availableSlots: string[];
  onSelectTime: (slot: string) => void;
  onOpenWaitingList: () => void;
};

export type AppointmentSummarySectionProps = {
  professional: Professional;
  selectedDate: Date;
  selectedTime: string;
  depositInfo: DepositInfo;
  isRescheduling: boolean;
  onConfirm: () => void;
};

export type PaymentDepositDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional;
  onConfirm: () => void;
};

export type WaitingListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onConfirm: () => void;
};
