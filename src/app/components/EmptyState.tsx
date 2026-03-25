import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="text-center py-16">
        <div className="inline-flex p-4 rounded-full mb-4"
             style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}>
          <Icon className="size-12 text-[#FFA500]" />
        </div>
        <p className="text-lg mb-2 font-semibold" style={{ color: '#4A3728' }}>
          {title}
        </p>
        <p className="mb-6 max-w-md mx-auto" style={{ color: '#6B5D53' }}>
          {description}
        </p>
        {action && action}
      </CardContent>
    </Card>
  );
}
