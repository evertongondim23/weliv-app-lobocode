import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action?: ReactNode;
  badge?: number;
}

export function PageHeader({ icon: Icon, title, subtitle, action, badge }: PageHeaderProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center justify-between" 
         style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Icon className="size-8 text-[#FFA500]" strokeWidth={2.5} />
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 size-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#4A3728' }}>
            {title}
          </h1>
          <p style={{ color: '#6B5D53' }}>
            {subtitle}
          </p>
        </div>
      </div>
      {action && (
        <div className="hidden sm:block">
          {action}
        </div>
      )}
    </div>
  );
}
