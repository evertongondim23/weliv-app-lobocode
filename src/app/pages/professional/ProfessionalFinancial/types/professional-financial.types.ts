import type { LucideIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { Appointment } from '../../../../types';

export type FinancialPeriod = 'daily' | 'monthly' | 'yearly';

export interface ChartDataPoint {
  id: string;
  name: string;
  data: string;
  receita: number;
  consultas: number;
}

export interface FinancialMetrics {
  completedAppointments: Appointment[];
  scheduledAppointments: Appointment[];
  noShowAppointments: Appointment[];
  cancelledAppointments: Appointment[];
  totalRevenue: number;
  potentialRevenue: number;
  lostRevenue: number;
  totalAppointments: number;
  noShowRate: string;
  remarcations: number;
  remarcationRate: string;
}

export interface FinancialFiltersSectionProps {
  period: FinancialPeriod;
  onPeriodChange: (period: FinancialPeriod) => void;
}

export interface TodayConfirmationSectionProps {
  appointments: Appointment[];
  onConfirm: (appointmentId: string, status: 'completed' | 'no-show') => void;
}

export type FinancialSummarySectionProps = FinancialMetrics;

export interface FinancialChartsSectionProps {
  period: FinancialPeriod;
  chartData: ChartDataPoint[];
}

export interface DetailedBreakdownSectionProps {
  metrics: FinancialMetrics;
  consultationPrice: number;
}

export interface GeneralSummarySectionProps {
  period: FinancialPeriod;
  metrics: FinancialMetrics;
  consultationPrice: number;
}

export interface SummaryCardProps {
  title: string;
  icon: LucideIcon;
  iconClassName?: string;
  iconStyle?: CSSProperties;
  value: ReactNode;
  valueClassName?: string;
  valueStyle?: CSSProperties;
  subtitle?: ReactNode;
  borderStyle?: CSSProperties;
  headerLayout?: 'row' | 'column';
}
