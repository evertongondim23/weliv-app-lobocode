import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Clock,
  BarChart3,
  Users,
  FileText
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subMonths, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';
import { WelcomeCard } from '../../components/common';
import { EmptyState } from '../../components/EmptyState';

export function ProfessionalFinancial() {
  const { user } = useAuth();
  const { appointments, updateAppointment, professionals } = useData();
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

  const professional = professionals.find(p => p.id === user?.id);
  const myAppointments = appointments.filter(apt => apt.professionalId === user?.id);

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  let filteredAppointments = myAppointments;
  let periodLabel = '';
  let chartData: any[] = [];

  // Consultas de hoje para confirmação
  const todayAppointments = myAppointments.filter(apt => apt.date === todayStr);
  const pendingConfirmation = todayAppointments.filter(apt => 
    apt.status === 'scheduled' || apt.status === 'confirmed'
  );

  if (period === 'daily') {
    // Últimos 7 dias
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    chartData = last7Days.map((day, index) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayAppointments = myAppointments.filter(apt => apt.date === dayStr);
      const completed = dayAppointments.filter(apt => apt.status === 'completed');
      
      return {
        id: `day-${index}`,
        name: format(day, 'EEE', { locale: ptBR }),
        data: format(day, 'dd/MM'),
        receita: completed.length * (professional?.consultationPrice || 0),
        consultas: completed.length,
      };
    });

    filteredAppointments = myAppointments.filter(apt => apt.date === todayStr);
    periodLabel = format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } else if (period === 'monthly') {
    // Últimos 6 meses
    const last6Months = eachMonthOfInterval({
      start: subMonths(today, 5),
      end: today,
    });

    chartData = last6Months.map((month, index) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthAppointments = myAppointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= monthStart && aptDate <= monthEnd;
      });
      const completed = monthAppointments.filter(apt => apt.status === 'completed');
      
      return {
        id: `month-${index}`,
        name: format(month, 'MMM', { locale: ptBR }),
        data: format(month, 'MMM/yy', { locale: ptBR }),
        receita: completed.length * (professional?.consultationPrice || 0),
        consultas: completed.length,
      };
    });

    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    filteredAppointments = myAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= monthStart && aptDate <= monthEnd;
    });
    periodLabel = format(today, "MMMM 'de' yyyy", { locale: ptBR });
  } else {
    // Todos os meses do ano atual
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    const monthsOfYear = eachMonthOfInterval({
      start: yearStart,
      end: yearEnd,
    });

    chartData = monthsOfYear.map((month, index) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthAppointments = myAppointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= monthStart && aptDate <= monthEnd;
      });
      const completed = monthAppointments.filter(apt => apt.status === 'completed');
      
      return {
        id: `year-${index}`,
        name: format(month, 'MMM', { locale: ptBR }),
        data: format(month, 'MMM', { locale: ptBR }),
        receita: completed.length * (professional?.consultationPrice || 0),
        consultas: completed.length,
      };
    });

    filteredAppointments = myAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= yearStart && aptDate <= yearEnd;
    });
    periodLabel = format(today, 'yyyy');
  }

  const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed');
  const scheduledAppointments = filteredAppointments.filter(apt => 
    apt.status === 'scheduled' || apt.status === 'confirmed'
  );
  const noShowAppointments = filteredAppointments.filter(apt => apt.status === 'no-show');
  const cancelledAppointments = filteredAppointments.filter(apt => apt.status === 'cancelled');

  const totalRevenue = completedAppointments.reduce((sum, apt) => 
    sum + (professional?.consultationPrice || 0), 0
  );

  const potentialRevenue = scheduledAppointments.reduce((sum, apt) => 
    sum + (professional?.consultationPrice || 0), 0
  );

  const lostRevenue = (noShowAppointments.length + cancelledAppointments.length) * (professional?.consultationPrice || 0);

  const totalAppointments = filteredAppointments.length;
  const noShowRate = totalAppointments > 0 ? ((noShowAppointments.length / totalAppointments) * 100).toFixed(1) : '0';

  const remarcations = filteredAppointments.reduce((sum, apt) => sum + apt.remarcationCount, 0);
  const remarcationRate = totalAppointments > 0 ? ((remarcations / totalAppointments) * 100).toFixed(1) : '0';

  const handleConfirmAppointment = (appointmentId: string, status: 'completed' | 'no-show') => {
    updateAppointment(appointmentId, { status });
    toast.success(
      status === 'completed' 
        ? 'Consulta confirmada como realizada!' 
        : 'Falta registrada'
    );
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <WelcomeCard
        icon={BarChart3}
        title="Relatórios e Financeiro"
        subtitle={`Período: ${periodLabel}`}
      />

      {/* Period Selector */}
      <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium" style={{ color: '#4A3728' }}>
              Período:
            </label>
            <Select value={period} onValueChange={(val: any) => setPeriod(val)}>
              <SelectTrigger 
                className="w-[200px] border-2"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Últimos 7 Dias</SelectItem>
                <SelectItem value="monthly">Últimos 6 Meses</SelectItem>
                <SelectItem value="yearly">Ano Atual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Confirmar Atendimentos do Dia */}
      {pendingConfirmation.length > 0 && (
        <Card className="border-2" style={{ borderColor: '#FFA500', background: 'linear-gradient(to right, rgba(255, 165, 0, 0.05), rgba(251, 174, 68, 0.05))' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#4A3728' }}>
              <Clock className="size-5" style={{ color: '#FFA500' }} />
              Confirmar Atendimentos de Hoje
            </CardTitle>
            <CardDescription>
              {pendingConfirmation.length} consulta{pendingConfirmation.length !== 1 ? 's' : ''} aguardando confirmação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingConfirmation.map(apt => (
              <div 
                key={apt.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border-2"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="size-4" style={{ color: '#6B5D53' }} />
                    <span className="font-medium" style={{ color: '#4A3728' }}>{apt.time}</span>
                    <Badge variant="outline" style={{ borderColor: '#FFA500', color: '#FFA500' }}>
                      {apt.status === 'confirmed' ? 'Confirmada' : 'Agendada'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Paciente ID: {apt.patientId}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleConfirmAppointment(apt.id, 'completed')}
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    <CheckCircle2 className="size-4 mr-1" />
                    Realizada
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConfirmAppointment(apt.id, 'no-show')}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="size-4 mr-1" />
                    Falta
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium" style={{ color: '#4A3728' }}>
              Faturamento Realizado
            </CardTitle>
            <DollarSign className="size-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {completedAppointments.length} consulta{completedAppointments.length !== 1 ? 's' : ''} realizada{completedAppointments.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium" style={{ color: '#4A3728' }}>
              Faturamento Previsto
            </CardTitle>
            <TrendingUp className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              R$ {potentialRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {scheduledAppointments.length} consulta{scheduledAppointments.length !== 1 ? 's' : ''} agendada{scheduledAppointments.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium" style={{ color: '#4A3728' }}>
              Receita Perdida
            </CardTitle>
            <AlertCircle className="size-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              R$ {lostRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {noShowAppointments.length + cancelledAppointments.length} falta{(noShowAppointments.length + cancelledAppointments.length) !== 1 ? 's' : ''} e cancelamento{(noShowAppointments.length + cancelledAppointments.length) !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: '#4A3728' }}>
              <Users className="size-4" style={{ color: '#FFA500' }} />
              Total de Consultas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#4A3728' }}>
              {totalAppointments}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: '#4A3728' }}>
              <XCircle className="size-4 text-red-600" />
              Taxa de Faltas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{noShowRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {noShowAppointments.length} falta{noShowAppointments.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: '#4A3728' }}>
              <Calendar className="size-4" style={{ color: '#FFA500' }} />
              Taxa de Remarcação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#FFA500' }}>
              {remarcationRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {remarcations} remarcaç{remarcations !== 1 ? 'ões' : 'ão'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: '#4A3728' }}>
              <CheckCircle2 className="size-4 text-green-600" />
              Taxa de Eficiência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalAppointments > 0 
                ? ((completedAppointments.length / totalAppointments) * 100).toFixed(1)
                : '0'
              }%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Consultas realizadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList
          className="grid w-full grid-cols-2 h-auto gap-1 p-1.5 rounded-xl border-2 bg-white shadow-sm"
          style={{ borderColor: 'rgba(255, 165, 0, 0.25)' }}
        >
          <TabsTrigger
            value="revenue"
            className="rounded-lg py-2.5 px-3 text-sm font-semibold text-[#6B5D53] gap-2 transition-all data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)] hover:bg-[#FFF8E7]/80"
          >
            <DollarSign className="size-4 shrink-0" aria-hidden />
            Receita
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="rounded-lg py-2.5 px-3 text-sm font-semibold text-[#6B5D53] gap-2 transition-all data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)] hover:bg-[#FFF8E7]/80"
          >
            <BarChart3 className="size-4 shrink-0" aria-hidden />
            Consultas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6">
          <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardHeader>
              <CardTitle style={{ color: '#4A3728' }}>Evolução de Faturamento</CardTitle>
              <CardDescription>
                {period === 'daily' && 'Últimos 7 dias'}
                {period === 'monthly' && 'Últimos 6 meses'}
                {period === 'yearly' && 'Ano atual'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} key={`revenue-${period}`}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFA500" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FFA500" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita']}
                    labelFormatter={(label) => chartData.find(d => d.name === label)?.data || label}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="#FFA500" 
                    fillOpacity={1} 
                    fill="url(#colorReceita)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardHeader>
              <CardTitle style={{ color: '#4A3728' }}>Número de Consultas</CardTitle>
              <CardDescription>
                {period === 'daily' && 'Últimos 7 dias'}
                {period === 'monthly' && 'Últimos 6 meses'}
                {period === 'yearly' && 'Ano atual'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} key={`appointments-${period}`}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [value, 'Consultas']}
                    labelFormatter={(label) => chartData.find(d => d.name === label)?.data || label}
                  />
                  <Bar dataKey="consultas" fill="#FFA500" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resumo Detalhado */}
      <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
        <CardHeader>
          <CardTitle style={{ color: '#4A3728' }}>Resumo Detalhado</CardTitle>
          <CardDescription>Análise completa do período</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div 
            className="flex items-center justify-between p-4 rounded-lg border-2"
            style={{ borderColor: 'rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)' }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium" style={{ color: '#4A3728' }}>Consultas Realizadas</p>
                <p className="text-sm text-muted-foreground">
                  {completedAppointments.length} atendimento{completedAppointments.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <p className="text-lg font-bold text-green-600">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div 
            className="flex items-center justify-between p-4 rounded-lg border-2"
            style={{ borderColor: 'rgba(59, 130, 246, 0.2)', background: 'rgba(59, 130, 246, 0.05)' }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium" style={{ color: '#4A3728' }}>Consultas Agendadas</p>
                <p className="text-sm text-muted-foreground">
                  {scheduledAppointments.length} pendente{scheduledAppointments.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <p className="text-lg font-bold text-blue-600">
              R$ {potentialRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div 
            className="flex items-center justify-between p-4 rounded-lg border-2"
            style={{ borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <XCircle className="size-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium" style={{ color: '#4A3728' }}>Faltas</p>
                <p className="text-sm text-muted-foreground">
                  {noShowAppointments.length} paciente{noShowAppointments.length !== 1 ? 's' : ''} não comparece{noShowAppointments.length !== 1 ? 'ram' : 'u'}
                </p>
              </div>
            </div>
            <p className="text-lg font-bold text-red-600">
              R$ {(noShowAppointments.length * (professional?.consultationPrice || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div 
            className="flex items-center justify-between p-4 rounded-lg border-2"
            style={{ borderColor: 'rgba(107, 114, 128, 0.2)', background: 'rgba(107, 114, 128, 0.05)' }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <AlertCircle className="size-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium" style={{ color: '#4A3728' }}>Cancelamentos</p>
                <p className="text-sm text-muted-foreground">
                  {cancelledAppointments.length} consulta{cancelledAppointments.length !== 1 ? 's' : ''} cancelada{cancelledAppointments.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-600">
              R$ {(cancelledAppointments.length * (professional?.consultationPrice || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card 
        className="border-2"
        style={{ 
          borderColor: '#FFA500', 
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(251, 174, 68, 0.1))' 
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#4A3728' }}>
            <FileText className="size-5" style={{ color: '#FFA500' }} />
            Resumo Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Valor Médio por Consulta</p>
              <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>
                R$ {professional?.consultationPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Receita Média por Dia</p>
              <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>
                R$ {period === 'daily' 
                  ? (totalRevenue / 7).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                  : period === 'monthly'
                  ? (totalRevenue / 30).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                  : (totalRevenue / 365).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Taxa de Aproveitamento</p>
              <p className="text-2xl font-bold" style={{ color: '#10b981' }}>
                {totalAppointments > 0 
                  ? (((totalAppointments - noShowAppointments.length - cancelledAppointments.length) / totalAppointments) * 100).toFixed(1)
                  : '0'
                }%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}