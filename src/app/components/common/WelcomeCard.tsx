import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WelcomeCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconFilled?: boolean;
}

export function WelcomeCard({ icon: Icon, title, subtitle, iconFilled = false }: WelcomeCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-sm border" 
      style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon 
          className="size-8 text-[#FFA500]" 
          fill={iconFilled ? '#FFA500' : 'none'}
          strokeWidth={iconFilled ? 0 : 2.5}
        />
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#4A3728' }}>
            {title}
          </h1>
          <p style={{ color: '#6B5D53' }}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
