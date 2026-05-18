import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, Users, DollarSign, Clock, AlertCircle, Activity, TrendingUp, ArrowRight, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  WelcomeCard, 
  StatCard, 
  SectionCard, 
  AppointmentCard,
  ActionButton,
  GradientIcon 
} from '../../components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export function ProfessionalDashboard() {
  const { user } = useAuth();
  const { appointments, professionals } = useData();
  const navigate = useNavigate();

  const professional = professionals.find(p => p.id === user?.id);
  const myAppointments = appointments.filter(apt => apt.professionalId === user?.id);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = myAppointments.filter(apt => 
    apt.date === today && (apt.status === 'scheduled' || apt.status === 'confirmed')
  );

  const thisMonth = myAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const now = new Date();
    return aptDate.getMonth() === now.getMonth() && 
           aptDate.getFullYear() === now.getFullYear() &&
           apt.status === 'completed';
  });

  const totalRevenue = thisMonth.reduce((sum, apt) => 
    sum + (professional?.consultationPrice || 0), 0
  );

  const noShowCount = myAppointments.filter(apt => apt.status === 'no-show').length;
  const totalCount = myAppointments.length;
  const noShowRate = totalCount > 0 ? ((noShowCount / totalCount) * 100).toFixed(1) : '0';

  // Próxima consulta
  const nextAppointment = todayAppointments.sort((a, b) => a.time.localeCompare(b.time))[0];

  const statsCards = [
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

  const quickActions = [
    { icon: Calendar, label: 'Ver Agenda Completa', path: '/professional/schedule', color: '#FFA500' },
    { icon: Users, label: 'Gerenciar Pacientes', path: '/professional/patients', color: '#FFC700' },
    { icon: DollarSign, label: 'Relatórios Financeiros', path: '/professional/financial', color: '#FFC700' },
    { icon: Clock, label: 'Configurar Horários', path: '/professional/settings', color: '#FF8C00' },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Section */}
      <WelcomeCard
        icon={Activity}
        title="Painel Profissional"
        subtitle={`Bem-vindo, Dr(a). ${user?.name?.split(' ')[0]}`}
      />

      {/* Próxima Consulta - Destaque */}
      {nextAppointment && (
        <Card 
          className="border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg"
          style={{ 
            borderColor: '#FFA500',
            background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(251, 174, 68, 0.05) 100%)'
          }}
          onClick={() => navigate('/professional/schedule')}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
                  >
                    <Clock className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6B5D53' }}>Próxima Consulta</p>
                    <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>{nextAppointment.time}</p>
                  </div>
                </div>
                <div className="ml-12">
                  <p className="text-sm" style={{ color: '#6B5D53' }}>
                    Paciente #{nextAppointment.patientId.slice(-4)}
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
              <Button
                variant="ghost"
                size="icon"
                style={{ color: '#FFA500' }}
              >
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid - Melhorado */}
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
                <div 
                  className="p-2 lg:p-3 rounded-xl"
                  style={{ background: stat.gradient }}
                >
                  <stat.icon className="size-5 lg:size-6 text-white" />
                </div>
                {stat.trend === 'up' && (
                  <TrendingUp className="size-4 lg:size-5 text-green-600" />
                )}
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

              <div className="flex items-center gap-1 text-[10px] lg:text-xs font-medium group-hover:gap-2 transition-all" style={{ color: '#FFA500' }}>
                <span className="hidden lg:inline">{stat.actionLabel}</span>
                <span className="lg:hidden">Ver</span>
                <ArrowRight className="size-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions - Melhorado */}
        <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg" style={{ color: '#4A3728' }}>
              <div 
                className="p-2 rounded-lg"
                style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
              >
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
                <ArrowRight className="size-4 lg:size-5 mt-2 lg:mt-0 transition-transform group-hover:translate-x-1 hidden lg:block" style={{ color: '#6B5D53' }} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Appointments - Melhorado */}
        <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg" style={{ color: '#4A3728' }}>
                  <div 
                    className="p-2 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
                  >
                    <Calendar className="size-4 lg:size-5 text-white" />
                  </div>
                  Consultas de Hoje
                </CardTitle>
                <CardDescription className="mt-2 text-xs lg:text-sm">
                  {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
                </CardDescription>
              </div>
              {todayAppointments.length > 0 && (
                <Badge 
                  style={{ 
                    background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
                    color: 'white'
                  }}
                >
                  {todayAppointments.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <div 
                  className="inline-flex p-3 lg:p-4 rounded-full mb-3 lg:mb-4"
                  style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
                >
                  <Calendar className="size-8 lg:size-12" style={{ color: '#FFA500' }} />
                </div>
                <p className="text-base lg:text-lg mb-2" style={{ color: '#4A3728' }}>
                  Nenhuma consulta para hoje
                </p>
                <p className="text-xs lg:text-sm mb-4" style={{ color: '#6B5D53' }}>
                  Aproveite para organizar sua agenda
                </p>
                <Button
                  onClick={() => navigate('/professional/schedule')}
                  style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
                  size="sm"
                  className="lg:text-base"
                >
                  <Plus className="size-4 mr-2" />
                  Ver Agenda
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2 lg:space-y-3 mb-4">
                  {todayAppointments.slice(0, 4).map(apt => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-2 lg:p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer group"
                      style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                    >
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div 
                          className="p-1.5 lg:p-2 rounded-lg"
                          style={{ background: 'rgba(255, 165, 0, 0.1)' }}
                        >
                          <Clock className="size-3 lg:size-4" style={{ color: '#FFA500' }} />
                        </div>
                        <div>
                          <p className="font-medium text-sm lg:text-base" style={{ color: '#4A3728' }}>{apt.time}</p>
                          <p className="text-xs lg:text-sm" style={{ color: '#6B5D53' }}>
                            Paciente #{apt.patientId.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className="text-[10px] lg:text-xs"
                        style={{ 
                          borderColor: apt.status === 'confirmed' ? '#10b981' : '#FFA500',
                          color: apt.status === 'confirmed' ? '#10b981' : '#FFA500'
                        }}
                      >
                        {apt.status === 'confirmed' ? 'Confirmada' : 'Agendada'}
                      </Badge>
                    </div>
                  ))}
                </div>
                {todayAppointments.length > 4 && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/professional/schedule')}
                    className="w-full border-2 text-xs lg:text-sm"
                    style={{ borderColor: 'rgba(255, 165, 0, 0.2)', color: '#FFA500' }}
                    size="sm"
                  >
                    Ver todas ({todayAppointments.length})
                    <ArrowRight className="size-3 lg:size-4 ml-2" />
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}