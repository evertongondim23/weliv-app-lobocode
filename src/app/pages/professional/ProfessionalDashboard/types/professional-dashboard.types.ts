import type { LucideIcon } from 'lucide-react';
import type { Appointment } from '../../../../types';

export type StatTrend = 'up' | 'down' | 'neutral';

export interface StatCardItem {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  gradient: string;
  action: () => void;
  actionLabel: string;
  trend: StatTrend;
}

export interface QuickActionItem {
  icon: LucideIcon;
  label: string;
  path: string;
  color: string;
}

export interface NextAppointmentSectionProps {
  appointment: Appointment | undefined;
  onNavigateSchedule: () => void;
}

export interface StatsSectionProps {
  stats: StatCardItem[];
}

export interface QuickActionsSectionProps {
  actions: QuickActionItem[];
  onNavigate: (path: string) => void;
}

export interface TodayAppointmentsSectionProps {
  appointments: Appointment[];
  onNavigateSchedule: () => void;
}
