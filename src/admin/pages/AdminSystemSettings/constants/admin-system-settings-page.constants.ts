import type { SystemSettings } from '../types/admin-system-settings-page.types';

export const settingsCardBorderStyle = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const settingsPrimaryActionStyle = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
} as const;

export const settingsDirtyBarStyle = {
  borderColor: 'rgba(255, 165, 0, 0.25)',
  background: '#FFF8E7',
} as const;

export const SEED_SYSTEM_SETTINGS: SystemSettings = {
  platformName: 'Weliv',
  supportEmail: 'suporte@weliv.com',
  baseUrl: 'https://app.weliv.com',
  timezone: 'America/Sao_Paulo',
  locale: 'pt-BR',
  maintenanceMode: false,
  allowSameDayBooking: true,
  defaultCancellationWindowHours: 12,
  notifyAdminOnNewUser: true,
  notifyAdminOnPaymentIssues: true,
  requireMfaForAdmins: true,
  auditRetentionDays: 180,
  publicStatusPageMessage: '',
};

export const TIMEZONE_OPTIONS = [
  { value: 'America/Sao_Paulo', label: 'América/São Paulo' },
  { value: 'America/Manaus', label: 'América/Manaus' },
  { value: 'America/Fortaleza', label: 'América/Fortaleza' },
  { value: 'UTC', label: 'UTC' },
] as const;

export const LOCALE_OPTIONS = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
] as const;

export const AUDIT_RETENTION_OPTIONS: Array<{ value: SystemSettings['auditRetentionDays']; label: string }> = [
  { value: 30, label: '30 dias' },
  { value: 90, label: '90 dias' },
  { value: 180, label: '180 dias' },
  { value: 365, label: '365 dias' },
];
