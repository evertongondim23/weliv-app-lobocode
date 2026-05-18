export type ReportCategory = 'consultas' | 'exames' | 'taxas' | 'estornos' | 'repasses';

export type FinancialReportRow = {
  id: string;
  unit: string;
  category: ReportCategory;
  label: string;
  amount: number;
  prevAmount: number;
  periodMonth: string;
};

export const reportCategoryLabels: Record<ReportCategory, string> = {
  consultas: 'Consultas',
  exames: 'Exames',
  taxas: 'Taxas e serviços',
  estornos: 'Estornos',
  repasses: 'Repasses convênio',
};

const mockRows: FinancialReportRow[] = [
  {
    id: 'FIN-R001',
    unit: 'Unidade Centro',
    category: 'consultas',
    label: 'Consultas particulares',
    amount: 428_500,
    prevAmount: 401_200,
    periodMonth: '2026-03',
  },
  {
    id: 'FIN-R002',
    unit: 'Unidade Centro',
    category: 'exames',
    label: 'Exames laboratoriais',
    amount: 198_400,
    prevAmount: 182_300,
    periodMonth: '2026-03',
  },
  {
    id: 'FIN-R003',
    unit: 'Unidade Centro',
    category: 'repasses',
    label: 'Repasses Amil / Unimed',
    amount: 312_800,
    prevAmount: 298_100,
    periodMonth: '2026-03',
  },
  {
    id: 'FIN-R004',
    unit: 'Unidade Centro',
    category: 'taxas',
    label: 'Taxas de agenda e no-show',
    amount: 24_600,
    prevAmount: 31_200,
    periodMonth: '2026-03',
  },
  {
    id: 'FIN-R005',
    unit: 'Unidade Centro',
    category: 'estornos',
    label: 'Estornos e chargebacks',
    amount: -18_900,
    prevAmount: -12_400,
    periodMonth: '2026-03',
  },
  {
    id: 'FIN-R006',
    unit: 'Unidade Zona Sul',
    category: 'consultas',
    label: 'Consultas particulares',
    amount: 265_300,
    prevAmount: 251_000,
    periodMonth: '2026-03',
  },
  {
    id: 'FIN-R007',
    unit: 'Unidade Zona Sul',
    category: 'exames',
    label: 'Exames de imagem',
    amount: 142_100,
    prevAmount: 128_700,
    periodMonth: '2026-03',
  },
  {
    id: 'FIN-R008',
    unit: 'Unidade Zona Sul',
    category: 'repasses',
    label: 'Repasses Bradesco Saúde',
    amount: 187_200,
    prevAmount: 179_400,
    periodMonth: '2026-03',
  },
  {
    id: 'FIN-R009',
    unit: 'Unidade Centro',
    category: 'consultas',
    label: 'Consultas particulares',
    amount: 401_200,
    prevAmount: 388_000,
    periodMonth: '2026-02',
  },
  {
    id: 'FIN-R010',
    unit: 'Unidade Centro',
    category: 'exames',
    label: 'Exames laboratoriais',
    amount: 182_300,
    prevAmount: 175_600,
    periodMonth: '2026-02',
  },
  {
    id: 'FIN-R011',
    unit: 'Unidade Zona Sul',
    category: 'consultas',
    label: 'Consultas particulares',
    amount: 251_000,
    prevAmount: 239_800,
    periodMonth: '2026-02',
  },
  {
    id: 'FIN-R012',
    unit: 'Unidade Zona Sul',
    category: 'repasses',
    label: 'Repasses Bradesco Saúde',
    amount: 179_400,
    prevAmount: 171_200,
    periodMonth: '2026-02',
  },
  {
    id: 'FIN-R013',
    unit: 'Unidade Centro',
    category: 'consultas',
    label: 'Consultas particulares',
    amount: 388_000,
    prevAmount: 372_500,
    periodMonth: '2026-01',
  },
  {
    id: 'FIN-R014',
    unit: 'Unidade Zona Sul',
    category: 'consultas',
    label: 'Consultas particulares',
    amount: 239_800,
    prevAmount: 228_900,
    periodMonth: '2026-01',
  },
];

export const reportPeriodOptions: { value: string; label: string }[] = [
  { value: '2026-03', label: 'Março 2026' },
  { value: '2026-02', label: 'Fevereiro 2026' },
  { value: '2026-01', label: 'Janeiro 2026' },
];

export function listFinancialReportRows(): FinancialReportRow[] {
  return mockRows;
}

export function distinctReportUnits(rows: FinancialReportRow[]): string[] {
  return [...new Set(rows.map((r) => r.unit))].sort();
}

export type FinancialReportKpis = {
  netRevenue: number;
  prevNetRevenue: number;
  variancePct: number | null;
  /** taxa mock para demo executiva */
  defaultRatePct: number;
  cashForecast30d: number;
};

export function computeReportKpis(rows: FinancialReportRow[]): FinancialReportKpis {
  const netRevenue = rows.reduce((s, r) => s + r.amount, 0);
  const prevNetRevenue = rows.reduce((s, r) => s + r.prevAmount, 0);
  const variancePct =
    prevNetRevenue !== 0 ? ((netRevenue - prevNetRevenue) / Math.abs(prevNetRevenue)) * 100 : null;
  const defaultRatePct =
    rows.length > 0 ? Math.min(12, 3.8 + rows.filter((r) => r.category === 'estornos').length * 0.35) : 0;
  const cashForecast30d = Math.round(netRevenue * 0.92 + prevNetRevenue * 0.05);
  return { netRevenue, prevNetRevenue, variancePct, defaultRatePct, cashForecast30d };
}

export function pctOfTotal(amount: number, total: number): number {
  if (total === 0) return 0;
  return (amount / total) * 100;
}
