import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onClick: () => void;
}

export function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  onClick 
}: QuickActionCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 overflow-hidden group"
      style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
      onClick={onClick}
    >
      <div className="h-2 w-full" style={{ background: gradient }} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div 
            className="p-3 rounded-xl group-hover:scale-110 transition-transform"
            style={{ background: gradient }}
          >
            <Icon className="size-6 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg mb-1" style={{ color: '#4A3728' }}>
          {title}
        </CardTitle>
        <p className="text-sm" style={{ color: '#6B5D53' }}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
