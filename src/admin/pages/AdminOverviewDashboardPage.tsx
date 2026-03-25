import React from 'react';
import { AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';
import { Badge } from '../../app/components/ui/badge';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/cards/KpiCard';
import { SectionCard } from '../components/common/SectionCard';
import {
  adminAlerts,
  adminDashboardKpis,
  adminFinanceSummary,
  adminOperationSummary,
  adminPendingItems,
} from '../mocks/adminData';

export function AdminOverviewDashboardPage() {
  const priorityStyleMap = {
    high: { label: 'Alta', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
    medium: { label: 'Média', color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)' },
    low: { label: 'Baixa', color: '#6B5D53', bg: 'rgba(63, 103, 131, 0.1)' },
  } as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão consolidada da operação, financeiro e governança do sistema."
      />

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {adminDashboardKpis.map((kpi) => <KpiCard key={kpi.id} item={kpi} />)}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        <SectionCard
          className="xl:col-span-2"
          title="Alertas críticos"
          description="Itens que exigem ação rápida da administração."
        >
          <div className="space-y-3">
            {adminAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border p-3 flex items-start gap-3"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#ffffff' }}
              >
                {alert.severity === 'critical' ? (
                  <AlertTriangle className="size-4 mt-0.5 text-red-600" />
                ) : alert.severity === 'warning' ? (
                  <Clock3 className="size-4 mt-0.5 text-amber-600" />
                ) : (
                  <CheckCircle2 className="size-4 mt-0.5 text-emerald-600" />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    {alert.title}
                  </p>
                  <p className="text-xs" style={{ color: '#6B5D53' }}>
                    {alert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Pendências"
          description="Lista de tarefas operacionais com maior impacto."
        >
          <div className="space-y-2">
            {adminPendingItems.map((pending) => {
              const priority = priorityStyleMap[pending.priority];
              return (
                <div key={pending.id} className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug" style={{ color: '#4A3728' }}>
                      {pending.item}
                    </p>
                    <Badge variant="outline" style={{ borderColor: priority.color, color: priority.color, background: priority.bg }}>
                      {priority.label}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs" style={{ color: '#6B5D53' }}>
                    <span>{pending.owner}</span>
                    <span>{pending.dueAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <SectionCard
          title="Resumo financeiro"
          description="Saúde financeira do dia e curto prazo."
          className="xl:col-span-1"
        >
          <div className="space-y-2">
            <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
              <p className="text-xs" style={{ color: '#6B5D53' }}>Recebido hoje</p>
              <p className="text-lg font-semibold" style={{ color: '#4A3728' }}>{adminFinanceSummary.receivedToday}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
              <p className="text-xs" style={{ color: '#6B5D53' }}>Pendente em aberto</p>
              <p className="text-lg font-semibold" style={{ color: '#4A3728' }}>{adminFinanceSummary.pendingAmount}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
                <p className="text-xs" style={{ color: '#6B5D53' }}>Inadimplência</p>
                <p className="text-base font-semibold" style={{ color: '#4A3728' }}>{adminFinanceSummary.defaultRate}</p>
              </div>
              <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
                <p className="text-xs" style={{ color: '#6B5D53' }}>Previsão 7 dias</p>
                <p className="text-base font-semibold" style={{ color: '#4A3728' }}>{adminFinanceSummary.forecastNext7Days}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Resumo operacional"
          description="Indicadores de capacidade e eficiência."
          className="xl:col-span-1"
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
              <p className="text-xs" style={{ color: '#6B5D53' }}>Taxa de ocupação</p>
              <p className="text-lg font-semibold" style={{ color: '#4A3728' }}>{adminOperationSummary.occupancyRate}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
              <p className="text-xs" style={{ color: '#6B5D53' }}>Espera média</p>
              <p className="text-lg font-semibold" style={{ color: '#4A3728' }}>{adminOperationSummary.avgWaitTime}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
              <p className="text-xs" style={{ color: '#6B5D53' }}>Docs pendentes</p>
              <p className="text-lg font-semibold" style={{ color: '#4A3728' }}>{adminOperationSummary.pendingDocuments}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
              <p className="text-xs" style={{ color: '#6B5D53' }}>No-show hoje</p>
              <p className="text-lg font-semibold" style={{ color: '#4A3728' }}>{adminOperationSummary.noShowToday}</p>
            </div>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
