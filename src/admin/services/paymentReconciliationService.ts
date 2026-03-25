/**
 * Pagamentos administrativos — capturas de gateway, taxas e conciliação com repasses.
 * Demo em memória para o módulo Financeiro > Pagamentos.
 */

export type PaymentConciliationStatus =
  | 'pending_gateway'
  | 'reconciled'
  | 'dispute'
  | 'refunded';

export type PaymentMethod = 'pix' | 'cartão' | 'boleto';

export type PaymentGateway = 'Stone' | 'PagSeguro' | 'Cielo';

export type AdminPaymentRow = {
  id: string;
  chargeRef: string;
  patientName: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  method: PaymentMethod;
  gateway: PaymentGateway;
  /** Exibição amigável. */
  capturedAt: string;
  capturedAtIso: string;
  /** Previsão de liquidação / repasse. */
  settlementEta: string;
  reconciledAt: string | null;
  status: PaymentConciliationStatus;
  unit: string;
  nsu?: string;
  notes?: string;
};

const mockPayments: AdminPaymentRow[] = [
  {
    id: 'PAY-24031',
    chargeRef: 'CHG-9001',
    patientName: 'Mariana Souza',
    grossAmount: 320,
    feeAmount: 9.6,
    netAmount: 310.4,
    method: 'pix',
    gateway: 'Stone',
    capturedAt: '24/03/2026 09:14',
    capturedAtIso: '2026-03-24T09:14:00',
    settlementEta: 'D+0 (PIX)',
    reconciledAt: null,
    status: 'pending_gateway',
    unit: 'Unidade Paulista',
    nsu: 'STN-PX-883921',
  },
  {
    id: 'PAY-24029',
    chargeRef: 'CHG-9003',
    patientName: 'Carla Dias',
    grossAmount: 180,
    feeAmount: 5.22,
    netAmount: 174.78,
    method: 'cartão',
    gateway: 'Cielo',
    capturedAt: '20/03/2026 09:41',
    capturedAtIso: '2026-03-20T09:41:00',
    settlementEta: 'D+1 cartão',
    reconciledAt: '21/03/2026 06:00',
    status: 'reconciled',
    unit: 'Unidade Paulista',
    nsu: 'CL-774102991',
  },
  {
    id: 'PAY-24028',
    chargeRef: 'CHG-9002',
    patientName: 'Ricardo Lima',
    grossAmount: 450,
    feeAmount: 15.75,
    netAmount: 434.25,
    method: 'boleto',
    gateway: 'PagSeguro',
    capturedAt: '21/03/2026 14:02',
    capturedAtIso: '2026-03-21T14:02:00',
    settlementEta: 'D+2 boleto',
    reconciledAt: null,
    status: 'pending_gateway',
    unit: 'Unidade Augusta',
    nsu: 'PS-BL-292811',
    notes: 'Aguardando confirmação de compensação bancária.',
  },
  {
    id: 'PAY-24027',
    chargeRef: 'CHG-9006',
    patientName: 'Helena Prado',
    grossAmount: 510,
    feeAmount: 17.85,
    netAmount: 492.15,
    method: 'boleto',
    gateway: 'Stone',
    capturedAt: '23/03/2026 11:02',
    capturedAtIso: '2026-03-23T11:02:00',
    settlementEta: 'D+1 após baixa',
    reconciledAt: '24/03/2026 05:30',
    status: 'reconciled',
    unit: 'Unidade Augusta',
    nsu: 'STN-BL-772100',
  },
  {
    id: 'PAY-24026',
    chargeRef: 'CHG-9005',
    patientName: 'Fernanda Oliveira',
    grossAmount: 295,
    feeAmount: 10.03,
    netAmount: 284.97,
    method: 'pix',
    gateway: 'PagSeguro',
    capturedAt: '22/03/2026 18:44',
    capturedAtIso: '2026-03-22T18:44:00',
    settlementEta: 'D+0',
    reconciledAt: null,
    status: 'dispute',
    unit: 'Unidade Paulista',
    nsu: 'PS-PX-991002',
    notes: 'Paciente contestou valor na operadora — análise em curso.',
  },
  {
    id: 'PAY-24025',
    chargeRef: 'CHG-8899',
    patientName: 'Marcos Vieira',
    grossAmount: 199,
    feeAmount: 6.77,
    netAmount: 192.23,
    method: 'cartão',
    gateway: 'Cielo',
    capturedAt: '19/03/2026 16:30',
    capturedAtIso: '2026-03-19T16:30:00',
    settlementEta: '—',
    reconciledAt: null,
    status: 'refunded',
    unit: 'Unidade Faria Lima',
    nsu: 'CL-661209833',
    notes: 'Estorno integral por cancelamento de consulta.',
  },
  {
    id: 'PAY-24024',
    chargeRef: 'CHG-9004',
    patientName: 'João Mendes',
    grossAmount: 750,
    feeAmount: 26.25,
    netAmount: 723.75,
    method: 'cartão',
    gateway: 'Stone',
    capturedAt: '24/03/2026 10:22',
    capturedAtIso: '2026-03-24T10:22:00',
    settlementEta: 'D+1',
    reconciledAt: null,
    status: 'pending_gateway',
    unit: 'Unidade Faria Lima',
    nsu: 'STN-CC-102938',
  },
];

export function listAdminPayments(): AdminPaymentRow[] {
  return [...mockPayments].sort((a, b) => b.capturedAtIso.localeCompare(a.capturedAtIso));
}

export type PaymentReconciliationSummary = {
  pendingCount: number;
  pendingGross: number;
  pendingNet: number;
  reconciledCount: number;
  reconciledNet: number;
  totalFees: number;
  attentionCount: number;
};

export function getPaymentReconciliationSummary(rows: AdminPaymentRow[]): PaymentReconciliationSummary {
  const pending = rows.filter((r) => r.status === 'pending_gateway');
  const reconciled = rows.filter((r) => r.status === 'reconciled');
  const attention = rows.filter((r) => r.status === 'dispute' || r.status === 'refunded');
  return {
    pendingCount: pending.length,
    pendingGross: pending.reduce((s, r) => s + r.grossAmount, 0),
    pendingNet: pending.reduce((s, r) => s + r.netAmount, 0),
    reconciledCount: reconciled.length,
    reconciledNet: reconciled.reduce((s, r) => s + r.netAmount, 0),
    totalFees: rows.reduce((s, r) => s + r.feeAmount, 0),
    attentionCount: attention.length,
  };
}
