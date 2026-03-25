import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface FilterSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function FilterSection({ 
  title = 'Filtros de Busca', 
  description = 'Refine sua busca',
  children 
}: FilterSectionProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#FFF8E7] to-white border-b">
        <CardTitle style={{ color: '#4A3728' }}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
}
