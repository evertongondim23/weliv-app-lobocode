import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../app/components/ui/card';
import { PageHeader } from '../components/common/PageHeader';

type AdminModuleLandingPageProps = {
  title: string;
  description: string;
};

export function AdminModuleLandingPage({ title, description }: AdminModuleLandingPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
        <CardHeader>
          <CardTitle style={{ color: '#4A3728' }}>Estrutura inicial pronta</CardTitle>
          <CardDescription>
            Esta seção já está conectada ao AppShell e preparada para receber tabelas, filtros e drawers na próxima etapa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B5D53' }}>
            Aqui entram os componentes reutilizáveis do módulo: listagens, estados vazios, filtros avançados e ações rápidas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
