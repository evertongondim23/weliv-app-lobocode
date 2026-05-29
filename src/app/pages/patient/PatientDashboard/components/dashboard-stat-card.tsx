import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';
import { CARD_BORDER_STYLE, TEXT_MUTED_COLOR, TEXT_PRIMARY_COLOR } from '../constants/patient-dashboard.constants';
import type { DashboardStatCardProps } from '../types/patient-dashboard.types';

export function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  action,
  actionLabel,
}: DashboardStatCardProps) {
  return (
    <Card
      className="border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105 group"
      style={CARD_BORDER_STYLE}
      onClick={action}
    >
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start justify-between mb-3 lg:mb-4">
          <div className="p-2 lg:p-3 rounded-xl" style={{ background: gradient }}>
            <Icon className="size-5 lg:size-6 text-white" />
          </div>
        </div>

        <h3 className="text-xs lg:text-sm font-medium mb-1" style={{ color: TEXT_MUTED_COLOR }}>
          {title}
        </h3>

        <p className="text-xl lg:text-3xl font-bold mb-1" style={{ color: TEXT_PRIMARY_COLOR }}>
          {value}
        </p>

        <p className="text-[10px] lg:text-xs mb-2 lg:mb-3" style={{ color: TEXT_MUTED_COLOR }}>
          {description}
        </p>

        <div
          className="flex items-center gap-1 text-[10px] lg:text-xs font-medium group-hover:gap-2 transition-all"
          style={{ color: '#FFA500' }}
        >
          <span className="hidden lg:inline">{actionLabel}</span>
          <span className="lg:hidden">Ver</span>
          <ArrowRight className="size-3" />
        </div>
      </CardContent>
    </Card>
  );
}
