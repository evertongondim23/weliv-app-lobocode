import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

export function StatCard({ title, value, description, icon: Icon, gradient }: StatCardProps) {
  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div className="h-2 w-full" style={{ background: gradient }} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-semibold" style={{ color: '#6B5D53' }}>
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg" style={{ background: gradient, opacity: 0.9 }}>
          <Icon className="size-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1" style={{ color: '#4A3728' }}>
          {value}
        </div>
        <p className="text-xs" style={{ color: '#6B5D53' }}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
