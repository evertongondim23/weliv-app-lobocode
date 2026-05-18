/**
 * Inadimplência — carteira em atraso por paciente / convênio (demo).
 */

export type PlanKind = 'particular' | 'convenio';

export type DefaultRiskLevel = 'baixo' | 'moderado' | 'alto' | 'critico';

export type RecoveryStage = 'cobranca_ativa' | 'negociacao' | 'juridico' | 'suspenso';

export type AdminDefaultCase = {
  id: string;
  chargeRef: string;
  patientName: string;
  planKind: PlanKind;
  /** Nome do plano ou operadora. */
  planLabel: string;
  overdueAmount: number;
  daysPastDue: number;
  riskLevel: DefaultRiskLevel;
  recoveryStage: RecoveryStage;
  unit: string;
  oldestDueDate: string;
  lastContactAt: string;
  contactChannel: 'whatsapp' | 'email' | 'telefone' | 'nenhum';
  nextBestAction: string;
  email?: string;
  notes?: string;
};

const mockCases: AdminDefaultCase[] = [
  {
    id: 'DEF-501',
    chargeRef: 'CHG-9002',
    patientName: 'Ricardo Lima',
    planKind: 'particular',
    planLabel: 'Particular',
    overdueAmount: 450,
    daysPastDue: 12,
    riskLevel: 'alto',
    recoveryStage: 'cobranca_ativa',
    unit: 'Unidade Augusta',
    oldestDueDate: '12/03/2026',
    lastContactAt: 'Ontem, 14:30',
    contactChannel: 'whatsapp',
    nextBestAction: 'Oferecer parcelamento em 3x com entrada 30%.',
    email: 'ricardo.lima@email.com',
  },
  {
    id: 'DEF-502',
    chargeRef: 'CHG-9005',
    patientName: 'Fernanda Oliveira',
    planKind: 'particular',
    planLabel: 'Particular',
    overdueAmount: 295,
    daysPastDue: 8,
    riskLevel: 'moderado',
    recoveryStage: 'negociacao',
    unit: 'Unidade Paulista',
    oldestDueDate: '16/03/2026',
    lastContactAt: 'Hoje, 07:45',
    contactChannel: 'email',
    nextBestAction: 'Confirmar comprovante de PIX pendente.',
    notes: 'Paciente alegou transferência não identificada.',
  },
  {
    id: 'DEF-503',
    chargeRef: 'CHG-8871',
    patientName: 'Marcos Vieira',
    planKind: 'convenio',
    planLabel: 'Unimed',
    overdueAmount: 1280,
    daysPastDue: 45,
    riskLevel: 'critico',
    recoveryStage: 'cobranca_ativa',
    unit: 'Unidade Faria Lima',
    oldestDueDate: '07/02/2026',
    lastContactAt: '18/03/2026',
    contactChannel: 'telefone',
    nextBestAction: 'Acionar glosa junto à operadora + cobrança paciente coparticipação.',
    notes: 'Glosa parcial em procedimento; paciente com coparticipação em aberto.',
  },
  {
    id: 'DEF-504',
    chargeRef: 'CHG-8820',
    patientName: 'Patrícia Nogueira',
    planKind: 'convenio',
    planLabel: 'Amil',
    overdueAmount: 620,
    daysPastDue: 22,
    riskLevel: 'alto',
    recoveryStage: 'negociacao',
    unit: 'Unidade Paulista',
    oldestDueDate: '02/03/2026',
    lastContactAt: '20/03/2026',
    contactChannel: 'email',
    nextBestAction: 'Solicitar carta de autorização reenviada ao financeiro da Amil.',
  },
  {
    id: 'DEF-505',
    chargeRef: 'CHG-8799',
    patientName: 'Eduardo Ramos',
    planKind: 'particular',
    planLabel: 'Particular',
    overdueAmount: 890,
    daysPastDue: 4,
    riskLevel: 'baixo',
    recoveryStage: 'cobranca_ativa',
    unit: 'Unidade Augusta',
    oldestDueDate: '20/03/2026',
    lastContactAt: '23/03/2026',
    contactChannel: 'whatsapp',
    nextBestAction: 'Lembrete automático D+5 se não houver pagamento.',
  },
  {
    id: 'DEF-506',
    chargeRef: 'CHG-8755',
    patientName: 'Silvia Brandão',
    planKind: 'convenio',
    planLabel: 'Bradesco Saúde',
    overdueAmount: 2340,
    daysPastDue: 67,
    riskLevel: 'critico',
    recoveryStage: 'juridico',
    unit: 'Unidade Faria Lima',
    oldestDueDate: '16/01/2026',
    lastContactAt: '10/03/2026',
    contactChannel: 'telefone',
    nextBestAction: 'Encaminhar para assessoria jurídica — valor acima do limite interno.',
    notes: 'Histórico de promessas não cumpridas.',
  },
  {
    id: 'DEF-507',
    chargeRef: 'CHG-8741',
    patientName: 'Luciana Meyer',
    planKind: 'particular',
    planLabel: 'Particular',
    overdueAmount: 155,
    daysPastDue: 31,
    riskLevel: 'moderado',
    recoveryStage: 'suspenso',
    unit: 'Unidade Paulista',
    oldestDueDate: '21/02/2026',
    lastContactAt: '15/03/2026',
    contactChannel: 'nenhum',
    nextBestAction: 'Reativar cadastro após acordo — paciente pediu pausa por saúde.',
  },
];

export function listDefaultCases(): AdminDefaultCase[] {
  return [...mockCases];
}

export type DefaultRiskSummary = {
  caseCount: number;
  totalOverdue: number;
  criticalCount: number;
  avgDaysPastDue: number;
  convenioTotal: number;
  particularTotal: number;
};

export function getDefaultRiskSummary(cases: AdminDefaultCase[]): DefaultRiskSummary {
  if (cases.length === 0) {
    return {
      caseCount: 0,
      totalOverdue: 0,
      criticalCount: 0,
      avgDaysPastDue: 0,
      convenioTotal: 0,
      particularTotal: 0,
    };
  }
  const criticalCount = cases.filter((c) => c.riskLevel === 'critico').length;
  const totalDays = cases.reduce((s, c) => s + c.daysPastDue, 0);
  return {
    caseCount: cases.length,
    totalOverdue: cases.reduce((s, c) => s + c.overdueAmount, 0),
    criticalCount,
    avgDaysPastDue: Math.round(totalDays / cases.length),
    convenioTotal: cases.filter((c) => c.planKind === 'convenio').reduce((s, c) => s + c.overdueAmount, 0),
    particularTotal: cases.filter((c) => c.planKind === 'particular').reduce((s, c) => s + c.overdueAmount, 0),
  };
}
