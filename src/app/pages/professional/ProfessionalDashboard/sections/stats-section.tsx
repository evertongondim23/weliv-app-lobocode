import { ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';
import { CARD_BORDER_STYLE } from '../constants/professional-dashboard.constants';
import type { StatsSectionProps } from '../types/professional-dashboard.types';

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105 group"
          style={CARD_BORDER_STYLE}
          onClick={stat.action}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between mb-3 lg:mb-4">
              <div className="p-2 lg:p-3 rounded-xl" style={{ background: stat.gradient }}>
                <stat.icon className="size-5 lg:size-6 text-white" />
              </div>
              {stat.trend === 'up' && <TrendingUp className="size-4 lg:size-5 text-green-600" />}
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
  );
}
