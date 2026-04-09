export type UserRole = 'patient' | 'professional' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: UserRole;
  avatar?: string;
}

export interface Patient extends User {
  role: 'patient';
  appointments: string[];
  documents: string[];
}

export interface Professional extends User {
  role: 'professional';
  /** Título ou destaque exibido no perfil (ex.: Dra., PhD, CRM). */
  professionalTitle?: string;
  /** Apresentação para pacientes (busca / perfil). */
  biography?: string;
  cnpj?: string;
  address: string;
  registrationNumber: string;
  specialty: string;
  consultationPrice: number;
  acceptsInsurance: boolean;
  insurances: string[];
  availableSchedule: WeekSchedule;
  blockedTimes: BlockedTime[];
  remarcationEnabled: boolean;
  remarcationLimit: number;
  waitingListEnabled: boolean;
  depositPercentage: 0 | 10 | 30 | 100;
}

export interface WeekSchedule {
  [key: string]: DaySchedule;
}

export interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
  lunchStart?: string;
  lunchEnd?: string;
}

export interface BlockedTime {
  id: string;
  date: string;
  start: string;
  end: string;
  reason: string;
}

/** Lembrete operacional na agenda do profissional (persistido localmente). */
export interface ScheduleReminder {
  id: string;
  professionalId: string;
  title: string;
  remindAt: string;
  note?: string;
  createdAt: string;
}

export type PatientSlotStatus = 'available' | 'blocked' | 'booked';

export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  date: string;
  time: string;
  type: 'presencial';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  remarcationCount: number;
  depositPaid: boolean;
  depositAmount: number;
  createdAt: string;
  notes?: string;
}

export interface WaitingListEntry {
  id: string;
  patientId: string;
  professionalId: string;
  desiredDate: string;
  desiredTime: string;
  createdAt: string;
}

export interface Document {
  id: string;
  patientId: string;
  professionalId?: string;
  appointmentId?: string;
  type: 'exam' | 'prescription' | 'report' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'ready';
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  professionalId: string;
  amount: number;
  method: 'pix' | 'credit' | 'debit' | 'boleto';
  installments?: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'payment' | 'document' | 'reminder' | 'waiting-list';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface FinancialReport {
  period: 'daily' | 'monthly' | 'yearly';
  totalRevenue: number;
  totalAppointments: number;
  noShowRate: number;
  remarcationRate: number;
  avgConsultationValue: number;
}
