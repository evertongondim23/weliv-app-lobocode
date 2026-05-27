import type { Dispatch, SetStateAction } from 'react';

export type SystemSettings = {
  platformName: string;
  supportEmail: string;
  baseUrl: string;
  timezone: string;
  locale: 'pt-BR' | 'en-US';
  maintenanceMode: boolean;
  allowSameDayBooking: boolean;
  defaultCancellationWindowHours: number;
  notifyAdminOnNewUser: boolean;
  notifyAdminOnPaymentIssues: boolean;
  requireMfaForAdmins: boolean;
  auditRetentionDays: 30 | 90 | 180 | 365;
  publicStatusPageMessage: string;
};

export type SystemSettingsSectionProps = {
  settings: SystemSettings;
  setSettings: Dispatch<SetStateAction<SystemSettings>>;
};

export type SettingsActionsBarProps = {
  isDirty: boolean;
  lastSavedAt: Date | null;
  onSave: () => void;
  onReset: () => void;
};

export type SettingsSwitchRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};
