export type AdminKpi = {
  id: string;
  label: string;
  value: string;
  trend: string;
  status: 'neutral' | 'positive' | 'warning';
};

export type AdminAlert = {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
};

export type AdminPendingItem = {
  id: string;
  item: string;
  owner: string;
  dueAt: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress';
};

export type AdminFinanceSummary = {
  receivedToday: string;
  pendingAmount: string;
  defaultRate: string;
  forecastNext7Days: string;
};

export type AdminOperationSummary = {
  occupancyRate: string;
  avgWaitTime: string;
  pendingDocuments: number;
  noShowToday: number;
};

export type AdminAreaQuickMetric = {
  id: string;
  label: string;
  value: string;
};

export type AdminAreaTask = {
  id: string;
  title: string;
  owner: string;
  dueAt: string;
};

export const adminDashboardKpis: AdminKpi[] = [
  { id: 'kpi-1', label: 'Atendimentos hoje', value: '42', trend: '+8% vs ontem', status: 'positive' },
  { id: 'kpi-2', label: 'Cobranças pendentes', value: '18', trend: '5 vencem hoje', status: 'warning' },
  { id: 'kpi-3', label: 'Usuários ativos', value: '29', trend: '+2 novos esta semana', status: 'neutral' },
  { id: 'kpi-4', label: 'Fila de validação', value: '4', trend: '2 urgentes', status: 'warning' },
];

export const adminAlerts: AdminAlert[] = [
  {
    id: 'alert-1',
    title: 'Pico de demanda no atendimento',
    description: 'Fila acima do limite na manhã. Redistribuir equipe se necessário.',
    severity: 'critical',
  },
  {
    id: 'alert-2',
    title: 'Documentos sem validação',
    description: '12 documentos aguardam análise administrativa.',
    severity: 'warning',
  },
  {
    id: 'alert-3',
    title: 'Backup concluído',
    description: 'Rotina noturna de backup finalizada sem erros.',
    severity: 'info',
  },
];

export const adminPendingItems: AdminPendingItem[] = [
  {
    id: 'pend-1',
    item: 'Aprovar 8 documentos de autorização',
    owner: 'Backoffice',
    dueAt: 'Hoje, 14:00',
    priority: 'high',
    status: 'open',
  },
  {
    id: 'pend-2',
    item: 'Reprocessar lote de cobranças cartão',
    owner: 'Financeiro',
    dueAt: 'Hoje, 17:00',
    priority: 'high',
    status: 'in-progress',
  },
  {
    id: 'pend-3',
    item: 'Revisar conflitos de agenda da unidade Centro',
    owner: 'Operação',
    dueAt: 'Amanhã, 10:00',
    priority: 'medium',
    status: 'open',
  },
  {
    id: 'pend-4',
    item: 'Atualizar perfis de acesso (novo médico)',
    owner: 'Administração',
    dueAt: 'Amanhã, 16:30',
    priority: 'low',
    status: 'open',
  },
];

export const adminFinanceSummary: AdminFinanceSummary = {
  receivedToday: 'R$ 18.420,00',
  pendingAmount: 'R$ 27.950,00',
  defaultRate: '6,8%',
  forecastNext7Days: 'R$ 54.300,00',
};

export const adminOperationSummary: AdminOperationSummary = {
  occupancyRate: '83%',
  avgWaitTime: '11 min',
  pendingDocuments: 12,
  noShowToday: 3,
};

export const adminOperationQuickMetrics: AdminAreaQuickMetric[] = [
  { id: 'op-1', label: 'Pacientes em acompanhamento', value: '1.284' },
  { id: 'op-2', label: 'Atendimentos em aberto hoje', value: '26' },
  { id: 'op-3', label: 'Documentos aguardando validação', value: '12' },
];

export const adminFinancialQuickMetrics: AdminAreaQuickMetric[] = [
  { id: 'fin-1', label: 'Faturamento no mês', value: 'R$ 482.300,00' },
  { id: 'fin-2', label: 'Cobranças pendentes', value: 'R$ 27.950,00' },
  { id: 'fin-3', label: 'Inadimplência consolidada', value: '6,8%' },
];

export const adminAdministrationQuickMetrics: AdminAreaQuickMetric[] = [
  { id: 'adm-1', label: 'Usuários ativos', value: '29' },
  { id: 'adm-2', label: 'Integrações saudáveis', value: '11 / 13' },
  { id: 'adm-3', label: 'Eventos auditáveis (24h)', value: '214' },
];

export const adminOperationTasks: AdminAreaTask[] = [
  { id: 'opt-1', title: 'Revisar conflitos de agenda da unidade Centro', owner: 'Operação', dueAt: 'Hoje, 15:00' },
  { id: 'opt-2', title: 'Validar documentos pendentes de alta prioridade', owner: 'Backoffice', dueAt: 'Hoje, 17:30' },
];

export const adminFinancialTasks: AdminAreaTask[] = [
  { id: 'fit-1', title: 'Reprocessar lote de cobrança rejeitado', owner: 'Financeiro', dueAt: 'Hoje, 14:40' },
  { id: 'fit-2', title: 'Concluir conciliação PIX do dia anterior', owner: 'Financeiro', dueAt: 'Hoje, 18:00' },
];

export const adminAdministrationTasks: AdminAreaTask[] = [
  { id: 'adt-1', title: 'Revisar acessos temporários expirados', owner: 'TI/Admin', dueAt: 'Hoje, 16:00' },
  { id: 'adt-2', title: 'Validar falha em integração de laboratório', owner: 'Integrações', dueAt: 'Hoje, 18:20' },
];
