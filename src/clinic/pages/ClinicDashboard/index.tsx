import React from 'react';
import { useNavigate } from 'react-router';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info,
  AlertCircle,
  CalendarPlus,
  UserPlus,
  FileBarChart,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { useClinic } from '../../contexts/ClinicContext';
import type { ClinicProfessionalMock } from '../../mocks/clinicData';

const PROFESSIONAL_COLORS = [
  '#FFA500', '#3B82F6', '#10B981', '#8B5CF6', '#F43F5E', '#F59E0B',
];

const STATUS_LABELS: Record<ClinicProfessionalMock['status'], { label: string; color: string }> = {
  attending: { label: 'Em atendimento', color: '#10B981' },
  available: { label: 'Disponível', color: '#3B82F6' },
  absent: { label: 'Ausente', color: '#F59E0B' },
  day_off: { label: 'Folga', color: '#6B7280' },
};

function TrendIcon({ trend }: { trend?: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="size-3.5 text-emerald-500" />;
  if (trend === 'down') return <TrendingDown className="size-3.5 text-red-400" />;
  return <Minus className="size-3.5 text-[#6B5D53]" />;
}

function AlertIcon({ severity }: { severity: 'critical' | 'warning' | 'info' }) {
  if (severity === 'critical') return <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />;
  if (severity === 'warning') return <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />;
  return <Info className="size-4 text-blue-500 shrink-0 mt-0.5" />;
}

export function ClinicDashboard() {
  const { kpis, alerts, professionals, todaySlots } = useClinic();
  const navigate = useNavigate();

  const activeProfessionals = professionals.filter(
    (p) => p.status === 'attending' || p.status === 'available',
  );

  const QUICK_ACTIONS = [
    { icon: CalendarPlus, label: 'Agendar consulta', onClick: () => navigate('/clinic/schedule') },
    { icon: UserPlus, label: 'Adicionar profissional', onClick: () => navigate('/clinic/professionals') },
    { icon: FileBarChart, label: 'Gerar relatório', onClick: () => navigate('/clinic/financial') },
    { icon: Clock, label: 'Ver agenda do dia', onClick: () => navigate('/clinic/schedule') },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#4A3728' }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B5D53' }}>
          Visão geral da clínica •{' '}
          {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date())}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="border-0 shadow-md overflow-hidden">
            <div className="h-1 w-full" style={{ background: kpi.gradient }} />
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#6B5D53' }}>
                {kpi.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>
                {kpi.value}
              </p>
              {kpi.trendLabel && (
                <div className="flex items-center gap-1 mt-1.5">
                  <TrendIcon trend={kpi.trend} />
                  <span className="text-[11px]" style={{ color: '#6B5D53' }}>{kpi.trendLabel}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agenda Strip */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.12)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>Agenda do Dia</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>Ocupação por profissional ativo</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-2 text-xs"
              style={{ borderColor: 'rgba(255, 165, 0, 0.28)', color: '#4A3728' }}
              onClick={() => navigate('/clinic/schedule')}
            >
              Ver agenda completa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <div className="min-w-[560px] space-y-3">
              {activeProfessionals.slice(0, 4).map((prof, idx) => {
                const profSlots = todaySlots.filter((s) => s.professionalId === prof.id);
                const color = PROFESSIONAL_COLORS[idx % PROFESSIONAL_COLORS.length];
                return (
                  <div key={prof.id} className="flex items-center gap-3">
                    <div className="w-32 shrink-0">
                      <p className="text-xs font-medium truncate" style={{ color: '#4A3728' }}>
                        {prof.name.replace('Dr. ', '').replace('Dra. ', '')}
                      </p>
                      <p className="text-[10px] truncate" style={{ color: '#6B5D53' }}>{prof.specialty}</p>
                    </div>
                    <div className="flex gap-1 flex-1">
                      {profSlots.map((slot) => (
                        <div
                          key={slot.hour}
                          title={slot.status === 'booked' ? `${slot.hour} — ${slot.patientName}` : slot.hour}
                          className="flex-1 h-7 rounded-md flex items-center justify-center text-[9px] font-medium transition-opacity hover:opacity-80 cursor-default"
                          style={
                            slot.status === 'booked'
                              ? { background: color, color: 'white' }
                              : slot.status === 'blocked'
                              ? { background: 'rgba(74,55,40,0.08)', color: '#6B5D53' }
                              : { background: 'rgba(255,165,0,0.08)', color: '#FFA500', border: '1px dashed rgba(255,165,0,0.3)' }
                          }
                        >
                          {slot.hour.slice(0, 2)}h
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-4 mt-4 pt-3 border-t" style={{ borderColor: 'rgba(74,55,40,0.08)' }}>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6B5D53' }}>
              <span className="size-3 rounded-sm inline-block" style={{ background: PROFESSIONAL_COLORS[0] }} />
              Ocupado
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6B5D53' }}>
              <span className="size-3 rounded-sm inline-block border border-dashed border-[#FFA500] bg-transparent" />
              Disponível
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6B5D53' }}>
              <span className="size-3 rounded-sm inline-block" style={{ background: 'rgba(74,55,40,0.08)' }} />
              Bloqueado
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alerts */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.12)' }}>
            <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>Alertas de Operação</p>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex gap-3 rounded-xl border p-3"
                style={{ borderColor: 'rgba(255, 165, 0, 0.18)', background: '#FAFAFA' }}
              >
                <AlertIcon severity={alert.severity} />
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#4A3728' }}>{alert.title}</p>
                  <p className="text-xs mt-0.5 leading-snug" style={{ color: '#6B5D53' }}>{alert.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.12)' }}>
            <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>Ações Rápidas</p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ icon: Icon, label, onClick }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className="flex flex-col items-center gap-2 rounded-xl border-2 bg-white p-4 text-center transition-all hover:shadow-md hover:border-[#FFA500]/50"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                >
                  <div
                    className="flex size-10 items-center justify-center rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
                  >
                    <Icon className="size-5 text-[#FFA500]" />
                  </div>
                  <span className="text-xs font-medium leading-tight" style={{ color: '#4A3728' }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
