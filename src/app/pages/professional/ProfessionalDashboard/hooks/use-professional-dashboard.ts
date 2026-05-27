import { format } from 'date-fns';
import { AlertCircle, Calendar, DollarSign, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import { QUICK_ACTIONS } from '../constants/professional-dashboard.constants';
import type { StatCardItem } from '../types/professional-dashboard.types';

export function useProfessionalDashboard() {
  const { user } = useAuth();
  const { appointments, professionals } = useData();
  const navigate = useNavigate();

  const professional = professionals.find((p) => p.id === user?.id);
  const myAppointments = appointments.filter((apt) => apt.professionalId === user?.id);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = myAppointments.filter(
    (apt) => apt.date === today && (apt.status === 'scheduled' || apt.status === 'confirmed'),
  );

  const thisMonth = myAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    const now = new Date();
    return (
      aptDate.getMonth() === now.getMonth() &&
      aptDate.getFullYear() === now.getFullYear() &&
      apt.status === 'completed'
    );
  });

  const totalRevenue = thisMonth.reduce((sum) => sum + (professional?.consultationPrice || 0), 0);

  const noShowCount = myAppointments.filter((apt) => apt.status === 'no-show').length;
  const totalCount = myAppointments.length;
  const noShowRate = totalCount > 0 ? ((noShowCount / totalCount) * 100).toFixed(1) : '0';

  const nextAppointment = todayAppointments.sort((a, b) => a.time.localeCompare(b.time))[0];

  const statsCards: StatCardItem[] = [
    {
      title: 'Consultas Hoje',
      value: todayAppointments.length,
      description: 'Agendamentos confirmados',
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
      action: () => navigate('/professional/schedule'),
      actionLabel: 'Ver Agenda',
      trend: todayAppointments.length > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Pacientes Atendidos',
      value: thisMonth.length,
      description: 'Este mês',
      icon: Users,
      gradient: 'linear-gradient(135deg, #FFC700 0%, #FFA500 100%)',
      action: () => navigate('/professional/patients'),
      actionLabel: 'Ver Pacientes',
      trend: thisMonth.length > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Faturamento',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      description: 'Este mês',
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #FFC700 0%, #FF8C00 100%)',
      action: () => navigate('/professional/financial'),
      actionLabel: 'Ver Relatórios',
      trend: totalRevenue > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Taxa de Faltas',
      value: `${noShowRate}%`,
      description: 'Total de agendamentos',
      icon: AlertCircle,
      gradient: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
      action: () => navigate('/professional/financial'),
      actionLabel: 'Ver Detalhes',
      trend: parseFloat(noShowRate) > 10 ? 'down' : 'neutral',
    },
  ];

  const navigateSchedule = () => navigate('/professional/schedule');

  return {
    welcome: { firstName: user?.name?.split(' ')[0] },
    nextAppointment: {
      appointment: nextAppointment,
      onNavigateSchedule: navigateSchedule,
    },
    stats: { items: statsCards },
    quickActions: {
      actions: QUICK_ACTIONS,
      onNavigate: (path: string) => navigate(path),
    },
    today: {
      appointments: todayAppointments,
      onNavigateSchedule: navigateSchedule,
    },
  };
}
