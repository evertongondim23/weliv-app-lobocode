import React from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { PageHeader } from '../components/common/PageHeader';
import type { AdminAreaQuickMetric, AdminAreaTask } from '../mocks/adminData';
import type { AdminNavItem } from '../config/navigation';

type AdminAreaOverviewPageProps = {
  title: string;
  description: string;
  quickMetrics: AdminAreaQuickMetric[];
  tasks: AdminAreaTask[];
  links: AdminNavItem[];
};

export function AdminAreaOverviewPage({
  title,
  description,
  quickMetrics,
  tasks,
  links,
}: AdminAreaOverviewPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickMetrics.map((metric) => (
          <Card key={metric.id} className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl" style={{ color: '#4A3728' }}>
                {metric.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        <Card className="xl:col-span-2 border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader>
            <CardTitle style={{ color: '#4A3728' }}>Subáreas do módulo</CardTitle>
            <CardDescription>Acesso rápido para as áreas mais usadas.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="rounded-xl border p-4 transition hover:bg-[#FFF8E7]"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#FFF8E7]">
                        <Icon className="size-4 text-[#FFA500]" />
                      </span>
                      <span className="text-sm font-medium truncate" style={{ color: '#4A3728' }}>
                        {item.label}
                      </span>
                    </div>
                    <ArrowRight className="size-4 text-[#6B5D53]" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          <CardHeader>
            <CardTitle style={{ color: '#4A3728' }}>Ações prioritárias</CardTitle>
            <CardDescription>Pontos com maior impacto no curto prazo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-lg border p-3" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
                <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
                  {task.title}
                </p>
                <p className="text-xs mt-1" style={{ color: '#6B5D53' }}>
                  {task.owner} - {task.dueAt}
                </p>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full mt-2">
              Ver todas as prioridades
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
