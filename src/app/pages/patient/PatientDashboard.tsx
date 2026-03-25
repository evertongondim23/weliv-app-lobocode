import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, FileText, Bell, Search, Heart, ArrowRight, Clock, Plus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WelcomeCard } from '../../components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export function PatientDashboard() {
  const { user } = useAuth();
  const { appointments, notifications, documents, professionals } = useData();
  const navigate = useNavigate();

  const myAppointments = appointments.filter(apt => apt.patientId === user?.id);

  const upcomingAppointments = myAppointments
    .filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed')
    .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));

  const nextAppointment = upcomingAppointments[0];
  const upcomingPreview = upcomingAppointments.slice(0, 4);

  const unreadNotifications = notifications.filter(not => not.userId === user?.id && !not.read).length;
  const myDocuments = documents.filter(doc => doc.patientId === user?.id);

  const statsCards = [
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

  const quickActions = [
    { icon: Search, label: 'Buscar Profissionais', path: '/patient/search', color: '#FFA500' },
    { icon: Calendar, label: 'Minhas Consultas', path: '/patient/appointments', color: '#FFC700' },
    { icon: FileText, label: 'Meus Documentos', path: '/patient/documents', color: '#FFC700' },
    { icon: Bell, label: 'Minhas Notificações', path: '/patient/notifications', color: '#FF8C00' },
  ];

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={Heart}
        title="Painel do Paciente"
        subtitle={`Olá, ${user?.name?.split(' ')[0]} — como posso ajudar hoje?`}
        iconFilled
      />

      {nextAppointment && (
        <Card
          className="border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg"
          style={{
            borderColor: '#FFA500',
            background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(251, 174, 68, 0.05) 100%)',
          }}
          onClick={() => navigate('/patient/appointments')}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
                    <Clock className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6B5D53' }}>
                      Próxima Consulta
                    </p>
                    <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>
                      {nextAppointment.time}
                    </p>
                  </div>
                </div>

                <div className="ml-12">
                  <p className="text-sm" style={{ color: '#6B5D53' }}>
                    {format(new Date(nextAppointment.date), "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                  <p className="text-sm font-medium mt-1" style={{ color: '#4A3728' }}>
                    {professionals.find(p => p.id === nextAppointment.professionalId)?.name || 'Profissional'}
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-2"
                    style={{ borderColor: '#FFA500', color: '#FFA500', background: 'rgba(255, 165, 0, 0.1)' }}
                  >
                    {nextAppointment.status === 'confirmed' ? 'Confirmada' : 'Agendada'}
                  </Badge>
                </div>
              </div>

              <Button variant="ghost" size="icon" style={{ color: '#FFA500' }}>
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105 group"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
            onClick={stat.action}
          >
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start justify-between mb-3 lg:mb-4">
                <div className="p-2 lg:p-3 rounded-xl" style={{ background: stat.gradient }}>
                  <stat.icon className="size-5 lg:size-6 text-white" />
                </div>
              </div>

              <h3 className="text-xs lg:text-sm font-medium mb-1" style={{ color: '#6B5D53' }}>
                {stat.title}
              </h3>

              <p className="text-xl lg:text-3xl font-bold mb-1" style={{ color: '#4A3728' }}>
                {stat.value}
              </p>

              <p className="text-[10px] lg:text-xs mb-2 lg:mb-3" style={{ color: '#6B5D53' }}>
                {stat.description}
              </p>

              <div
                className="flex items-center gap-1 text-[10px] lg:text-xs font-medium group-hover:gap-2 transition-all"
                style={{ color: '#FFA500' }}
              >
                <span className="hidden lg:inline">{stat.actionLabel}</span>
                <span className="lg:hidden">Ver</span>
                <ArrowRight className="size-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg" style={{ color: '#4A3728' }}>
              <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
                <Activity className="size-4 lg:size-5 text-white" />
              </div>
              Ações Rápidas
            </CardTitle>
            <CardDescription className="text-xs lg:text-sm">Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => navigate(action.path)}
                className="flex flex-col lg:flex-row items-center lg:justify-between p-3 lg:p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md hover:scale-102 group"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              >
                <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-3 w-full">
                  <div
                    className="p-2 rounded-lg transition-transform group-hover:scale-110"
                    style={{ background: `${action.color}20` }}
                  >
                    <action.icon className="size-5" style={{ color: action.color }} />
                  </div>
                  <span className="font-medium text-xs lg:text-sm text-center lg:text-left" style={{ color: '#4A3728' }}>
                    {action.label}
                  </span>
                </div>
                <ArrowRight
                  className="size-4 lg:size-5 mt-2 lg:mt-0 transition-transform group-hover:translate-x-1 hidden lg:block"
                  style={{ color: '#6B5D53' }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg" style={{ color: '#4A3728' }}>
                  <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
                    <Calendar className="size-4 lg:size-5 text-white" />
                  </div>
                  Próximas Consultas
                </CardTitle>
                <CardDescription className="mt-2 text-xs lg:text-sm">Seus próximos agendamentos</CardDescription>
              </div>
              {upcomingAppointments.length > 0 && (
                <Badge style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}>
                  {upcomingAppointments.length}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {upcomingPreview.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <div
                  className="inline-flex p-3 lg:p-4 rounded-full mb-3 lg:mb-4"
                  style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
                >
                  <Calendar className="size-8 lg:size-12" style={{ color: '#FFA500' }} />
                </div>
                <p className="text-base lg:text-lg mb-2" style={{ color: '#4A3728' }}>
                  Nenhuma consulta agendada
                </p>
                <p className="text-xs lg:text-sm mb-4" style={{ color: '#6B5D53' }}>
                  Que tal encontrar um profissional de saúde?
                </p>
                <Button
                  onClick={() => navigate('/patient/search')}
                  style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
                  size="sm"
                  className="lg:text-base"
                >
                  <Plus className="size-4 mr-2" />
                  Buscar Profissionais
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2 lg:space-y-3 mb-4">
                  {upcomingPreview.map(apt => {
                    const professional = professionals.find(p => p.id === apt.professionalId);
                    return (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-2 lg:p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer group"
                        style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                        onClick={() => navigate('/patient/appointments')}
                      >
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="p-1.5 lg:p-2 rounded-lg" style={{ background: 'rgba(255, 165, 0, 0.1)' }}>
                            <Clock className="size-3 lg:size-4" style={{ color: '#FFA500' }} />
                          </div>
                          <div>
                            <p className="font-medium text-sm lg:text-base" style={{ color: '#4A3728' }}>
                              {apt.time} • {format(new Date(apt.date), "dd 'de' MMM", { locale: ptBR })}
                            </p>
                            <p className="text-xs lg:text-sm" style={{ color: '#6B5D53' }}>
                              {professional?.name || 'Profissional'}
                              {professional?.specialty ? ` • ${professional.specialty}` : ''}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] lg:text-xs"
                          style={{
                            borderColor: apt.status === 'confirmed' ? '#10b981' : '#FFA500',
                            color: apt.status === 'confirmed' ? '#10b981' : '#FFA500',
                          }}
                        >
                          {apt.status === 'confirmed' ? 'Confirmada' : 'Agendada'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate('/patient/appointments')}
                  className="w-full border-2 text-xs lg:text-sm"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.2)', color: '#FFA500' }}
                  size="sm"
                >
                  Ver todas
                  <ArrowRight className="size-3 lg:size-4 ml-2" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
