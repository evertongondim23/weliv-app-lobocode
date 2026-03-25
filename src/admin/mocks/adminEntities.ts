export type PatientRow = {
  id: string;
  name: string;
  phone: string;
  plan: string;
  lastVisit: string;
  status: 'ativo' | 'inativo' | 'atenção';
};

export type ScheduleRow = {
  id: string;
  professional: string;
  date: string;
  occupancy: string;
  waitingList: number;
  status: 'normal' | 'lotado' | 'atenção';
};

export type ChargeRow = {
  id: string;
  patient: string;
  amount: string;
  /** Valor numérico para KPIs e totais (demo). */
  valueNumber: number;
  dueDate: string;
  /** ISO para ordenação / regras (YYYY-MM-DD). */
  dueDateIso: string;
  method: 'pix' | 'cartão' | 'boleto';
  status: 'pendente' | 'pago' | 'atrasado';
  unit: string;
  appointmentRef?: string;
  email?: string;
  /** Demo: último aviso enviado ao paciente. */
  lastReminderAt?: string;
  paidAt?: string | null;
};

export type UserRow = {
  id: string;
  name: string;
  role: string;
  unit: string;
  lastAccess: string;
  status: 'ativo' | 'bloqueado' | 'pendente';
};

export type IntegrationRow = {
  id: string;
  name: string;
  type: string;
  lastSync: string;
  latency: string;
  status: 'saudável' | 'instável' | 'fora';
};

export type AuditLogRow = {
  id: string;
  event: string;
  actor: string;
  area: string;
  at: string;
  status: 'ok' | 'alerta' | 'crítico';
};

export const adminPatientsRows: PatientRow[] = [
  { id: 'PAT-1001', name: 'Mariana Souza', phone: '(11) 98811-1234', plan: 'Unimed', lastVisit: '20/03/2026', status: 'ativo' },
  { id: 'PAT-1002', name: 'Ricardo Lima', phone: '(11) 99188-4433', plan: 'Particular', lastVisit: '18/03/2026', status: 'atenção' },
  { id: 'PAT-1003', name: 'Carla Dias', phone: '(11) 99666-2291', plan: 'Amil', lastVisit: '12/03/2026', status: 'ativo' },
  { id: 'PAT-1004', name: 'João Mendes', phone: '(11) 97721-3344', plan: 'Bradesco Saúde', lastVisit: '01/02/2026', status: 'inativo' },
];

export const adminScheduleRows: ScheduleRow[] = [
  { id: 'SCH-201', professional: 'Dra. Ana Silva', date: '24/03/2026', occupancy: '82%', waitingList: 4, status: 'normal' },
  { id: 'SCH-202', professional: 'Dr. Pedro Ramos', date: '24/03/2026', occupancy: '100%', waitingList: 9, status: 'lotado' },
  { id: 'SCH-203', professional: 'Dra. Paula Nunes', date: '24/03/2026', occupancy: '67%', waitingList: 1, status: 'normal' },
  { id: 'SCH-204', professional: 'Dr. João Castro', date: '24/03/2026', occupancy: '91%', waitingList: 5, status: 'atenção' },
];

export const adminChargesRows: ChargeRow[] = [
  {
    id: 'CHG-9001',
    patient: 'Mariana Souza',
    amount: 'R$ 320,00',
    valueNumber: 320,
    dueDate: '24/03/2026',
    dueDateIso: '2026-03-24',
    method: 'pix',
    status: 'pendente',
    unit: 'Unidade Paulista',
    appointmentRef: 'APT-1040',
    email: 'mariana.souza@email.com',
    lastReminderAt: 'Hoje, 08:12',
    paidAt: null,
  },
  {
    id: 'CHG-9002',
    patient: 'Ricardo Lima',
    amount: 'R$ 450,00',
    valueNumber: 450,
    dueDate: '21/03/2026',
    dueDateIso: '2026-03-21',
    method: 'boleto',
    status: 'atrasado',
    unit: 'Unidade Augusta',
    appointmentRef: 'APT-1022',
    email: 'ricardo.lima@email.com',
    lastReminderAt: 'Ontem, 14:30',
    paidAt: null,
  },
  {
    id: 'CHG-9003',
    patient: 'Carla Dias',
    amount: 'R$ 180,00',
    valueNumber: 180,
    dueDate: '20/03/2026',
    dueDateIso: '2026-03-20',
    method: 'cartão',
    status: 'pago',
    unit: 'Unidade Paulista',
    appointmentRef: 'APT-1018',
    lastReminderAt: '18/03/2026, 10:00',
    paidAt: '20/03/2026, 09:41',
  },
  {
    id: 'CHG-9004',
    patient: 'João Mendes',
    amount: 'R$ 750,00',
    valueNumber: 750,
    dueDate: '25/03/2026',
    dueDateIso: '2026-03-25',
    method: 'cartão',
    status: 'pendente',
    unit: 'Unidade Faria Lima',
    appointmentRef: 'APT-1055',
    email: 'joao.mendes@email.com',
    paidAt: null,
  },
  {
    id: 'CHG-9005',
    patient: 'Fernanda Oliveira',
    amount: 'R$ 295,00',
    valueNumber: 295,
    dueDate: '22/03/2026',
    dueDateIso: '2026-03-22',
    method: 'pix',
    status: 'atrasado',
    unit: 'Unidade Paulista',
    appointmentRef: 'APT-1031',
    lastReminderAt: 'Hoje, 07:45',
    paidAt: null,
  },
  {
    id: 'CHG-9006',
    patient: 'Helena Prado',
    amount: 'R$ 510,00',
    valueNumber: 510,
    dueDate: '23/03/2026',
    dueDateIso: '2026-03-23',
    method: 'boleto',
    status: 'pago',
    unit: 'Unidade Augusta',
    paidAt: '23/03/2026, 11:02',
  },
];

export const adminUsersRows: UserRow[] = [
  { id: 'USR-01', name: 'Fernanda Costa', role: 'Administrador', unit: 'Centro', lastAccess: 'Hoje, 09:12', status: 'ativo' },
  { id: 'USR-02', name: 'Lucas Prado', role: 'Financeiro', unit: 'Vila Mariana', lastAccess: 'Hoje, 08:47', status: 'ativo' },
  { id: 'USR-03', name: 'Bianca Torres', role: 'Recepção', unit: 'Centro', lastAccess: 'Ontem, 18:05', status: 'pendente' },
  { id: 'USR-04', name: 'Hugo Mota', role: 'Operação', unit: 'Moema', lastAccess: '12/03/2026', status: 'bloqueado' },
];

export const adminIntegrationsRows: IntegrationRow[] = [
  { id: 'INT-11', name: 'Gateway de Pagamento', type: 'Financeiro', lastSync: 'Há 3 min', latency: '120ms', status: 'saudável' },
  { id: 'INT-12', name: 'Laboratório Exames+', type: 'Documentos', lastSync: 'Há 2h', latency: '2.8s', status: 'instável' },
  { id: 'INT-13', name: 'SMS Provider', type: 'Comunicação', lastSync: 'Há 8 min', latency: '210ms', status: 'saudável' },
  { id: 'INT-14', name: 'ERP Contábil', type: 'Financeiro', lastSync: 'Falhou', latency: '-', status: 'fora' },
];

export const adminAuditLogsRows: AuditLogRow[] = [
  { id: 'LOG-501', event: 'Alteração de permissão', actor: 'Fernanda Costa', area: 'Administração', at: 'Hoje, 09:18', status: 'ok' },
  { id: 'LOG-502', event: 'Tentativa de acesso negada', actor: 'hugo.mota', area: 'Segurança', at: 'Hoje, 08:11', status: 'alerta' },
  { id: 'LOG-503', event: 'Integração indisponível', actor: 'Sistema', area: 'Integrações', at: 'Hoje, 07:59', status: 'crítico' },
  { id: 'LOG-504', event: 'Exportação de relatório financeiro', actor: 'Lucas Prado', area: 'Financeiro', at: 'Ontem, 17:41', status: 'ok' },
];
