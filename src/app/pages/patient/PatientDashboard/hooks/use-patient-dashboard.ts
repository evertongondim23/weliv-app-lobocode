import { Bell, Calendar, FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import { QUICK_ACTIONS } from '../constants/patient-dashboard.constants';
import type { StatCardItem } from '../types/patient-dashboard.types';
import {
  filterPatientAppointments,
  getUpcomingAppointments,
  getUpcomingPreview,
} from '../utils/patient-dashboard.utils';

export function usePatientDashboard() {
  const { user } = useAuth();
  const { appointments, notifications, documents, professionals } = useData();
  const navigate = useNavigate();

  const myAppointments = filterPatientAppointments(appointments, user?.id);
  const upcomingAppointments = getUpcomingAppointments(myAppointments);
  const nextAppointment = upcomingAppointments[0];
  const upcomingPreview = getUpcomingPreview(upcomingAppointments);

  const unreadNotifications = notifications.filter(
    (not) => not.userId === user?.id && !not.read,
  ).length;
  const myDocuments = documents.filter((doc) => doc.patientId === user?.id);

  const statsCards: StatCardItem[] = [
    {
      title: 'Próximas Consultas',
      value: upcomingAppointments.length,
      description: 'Agendadas/confirmadas',
      icon: Calendar,
      action: () => navigate('/patient/appointments'),
      actionLabel: 'Ver consultas',
      gradient: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
    },
    {
      title: 'Documentos',
      value: myDocuments.length,
      description: 'Exames e receitas',
      icon: FileText,
      action: () => navigate('/patient/documents'),
      actionLabel: 'Ver documentos',
      gradient: 'linear-gradient(135deg, #FFC700 0%, #FFA500 100%)',
    },
    {
      title: 'Notificações',
      value: unreadNotifications,
      description: 'Não lidas',
      icon: Bell,
      action: () => navigate('/patient/notifications'),
      actionLabel: 'Ver notificações',
      gradient: 'linear-gradient(135deg, #FFC700 0%, #FF8C00 100%)',
    },
    {
      title: 'Profissionais',
      value: professionals.length,
      description: 'Disponíveis na plataforma',
      icon: Search,
      action: () => navigate('/patient/search'),
      actionLabel: 'Buscar',
      gradient: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
    },
  ];

  const navigateAppointments = () => navigate('/patient/appointments');

  return {
    welcome: { firstName: user?.name?.split(' ')[0] ?? '' },
    nextAppointment: {
      appointment: nextAppointment,
      professionalName:
        professionals.find((p) => p.id === nextAppointment?.professionalId)?.name || 'Profissional',
      onNavigate: navigateAppointments,
    },
    summary: { stats: statsCards },
    quickActions: {
      actions: QUICK_ACTIONS,
      onNavigate: (path: string) => navigate(path),
    },
    upcoming: {
      preview: upcomingPreview,
      totalCount: upcomingAppointments.length,
      professionals,
      onNavigateAppointments: navigateAppointments,
      onNavigateSearch: () => navigate('/patient/search'),
    },
  };
}
