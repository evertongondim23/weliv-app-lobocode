import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Layout padrão para páginas de dashboard
 * Adiciona espaçamento consistente e padding para navegação mobile
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="space-y-6 pb-6">
      {children}
    </div>
  );
}
