import type { LucideIcon } from 'lucide-react';
import type { Appointment, Professional } from '../../../../types';

export interface StatCardItem {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  gradient: string;
  action: () => void;
  actionLabel: string;
}

export interface QuickActionItem {
  icon: LucideIcon;
  label: string;
  path: string;
  color: string;
}

export interface NextAppointmentSectionProps {
  appointment: Appointment | undefined;
  professionalName: string;
  onNavigate: () => void;
}

export interface DashboardSummarySectionProps {
  stats: StatCardItem[];
}

export interface DashboardStatCardProps extends StatCardItem {}

export interface QuickActionsSectionProps {
  actions: QuickActionItem[];
  onNavigate: (path: string) => void;
}

export interface AppointmentPreviewCardProps {
  appointment: Appointment;
  professional: Professional | undefined;
  onNavigate: () => void;
}

export interface UpcomingAppointmentsSectionProps {
  preview: Appointment[];
  totalCount: number;
  professionals: Professional[];
  onNavigateAppointments: () => void;
  onNavigateSearch: () => void;
}
