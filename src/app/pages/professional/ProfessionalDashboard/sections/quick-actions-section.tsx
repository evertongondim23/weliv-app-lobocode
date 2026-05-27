import { Activity, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { CARD_BORDER_STYLE, PRIMARY_GRADIENT } from '../constants/professional-dashboard.constants';
import type { QuickActionsSectionProps } from '../types/professional-dashboard.types';

export function QuickActionsSection({ actions, onNavigate }: QuickActionsSectionProps) {
  return (
    <Card className="border-2" style={CARD_BORDER_STYLE}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base lg:text-lg" style={{ color: '#4A3728' }}>
          <div className="p-2 rounded-lg" style={{ background: PRIMARY_GRADIENT }}>
            <Activity className="size-4 lg:size-5 text-white" />
          </div>
          Ações Rápidas
        </CardTitle>
        <CardDescription className="text-xs lg:text-sm">Acesso rápido às principais funcionalidades</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={() => onNavigate(action.path)}
            className="flex flex-col lg:flex-row items-center lg:justify-between p-3 lg:p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md hover:scale-102 group"
            style={CARD_BORDER_STYLE}
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
  );
}
