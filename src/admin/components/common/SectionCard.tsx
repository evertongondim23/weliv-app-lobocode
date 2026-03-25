import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../app/components/ui/card';

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ title, description, children, className = '' }: SectionCardProps) {
  return (
    <Card className={`border-2 ${className}`} style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
      <CardHeader>
        <CardTitle style={{ color: '#4A3728' }}>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
