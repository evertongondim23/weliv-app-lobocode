import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../app/components/ui/card';
import type { AdminKpi } from '../../mocks/adminData';

type KpiCardProps = {
  item: AdminKpi;
};

export function KpiCard({ item }: KpiCardProps) {
  const trendColor =
    item.status === 'warning' ? '#f59e0b' : item.status === 'positive' ? '#10b981' : '#6B5D53';

  return (
    <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
      <CardHeader className="pb-2">
        <CardDescription>{item.label}</CardDescription>
        <CardTitle className="text-2xl" style={{ color: '#4A3728' }}>
          {item.value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm flex items-center gap-1" style={{ color: trendColor }}>
          <ArrowUpRight className="size-4" />
          {item.trend}
        </p>
      </CardContent>
    </Card>
  );
}
