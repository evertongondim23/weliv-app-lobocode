import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import type { QuickActionItem } from '../types/professional-dashboard.types';

export const CARD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const PRIMARY_GRADIENT = 'linear-gradient(135deg, #FFA500, #FF8C00)';

export const NEXT_APPOINTMENT_CARD_STYLE = {
  borderColor: '#FFA500',
  background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(251, 174, 68, 0.05) 100%)',
} as const;

export const QUICK_ACTIONS: QuickActionItem[] = [
  { icon: Calendar, label: 'Ver Agenda Completa', path: '/professional/schedule', color: '#FFA500' },
  { icon: Users, label: 'Gerenciar Pacientes', path: '/professional/patients', color: '#FFC700' },
  { icon: DollarSign, label: 'Relatórios Financeiros', path: '/professional/financial', color: '#FFC700' },
  { icon: Clock, label: 'Configurar Horários', path: '/professional/settings', color: '#FF8C00' },
];
