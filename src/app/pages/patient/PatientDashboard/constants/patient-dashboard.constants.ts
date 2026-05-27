import { Bell, Calendar, FileText, Search } from 'lucide-react';
import type { QuickActionItem } from '../types/patient-dashboard.types';

export const CARD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const PRIMARY_GRADIENT = 'linear-gradient(135deg, #FFA500, #FF8C00)';

export const NEXT_APPOINTMENT_CARD_STYLE = {
  borderColor: '#FFA500',
  background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(251, 174, 68, 0.05) 100%)',
} as const;

export const TEXT_PRIMARY_COLOR = '#4A3728';

export const TEXT_MUTED_COLOR = '#6B5D53';

export const EMPTY_STATE_ICON_STYLE = {
  background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)',
} as const;

export const QUICK_ACTIONS: QuickActionItem[] = [
  { icon: Search, label: 'Buscar Profissionais', path: '/patient/search', color: '#FFA500' },
  { icon: Calendar, label: 'Minhas Consultas', path: '/patient/appointments', color: '#FFC700' },
  { icon: FileText, label: 'Meus Documentos', path: '/patient/documents', color: '#FFC700' },
  { icon: Bell, label: 'Minhas Notificações', path: '/patient/notifications', color: '#FF8C00' },
];
