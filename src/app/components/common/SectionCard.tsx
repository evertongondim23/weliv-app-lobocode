import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  headerExtra?: ReactNode;
}

export function SectionCard({ 
  title, 
  description, 
  icon: Icon, 
  children,
  headerExtra 
}: SectionCardProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#FFF8E7] to-white border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle style={{ color: '#4A3728' }}>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {Icon && <Icon className="size-8 text-[#FFA500]" />}
          {headerExtra}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
}
