/**
 * Cobranças — fatura ao paciente (status operacional: pendente / pago / atrasado).
 * Demo: dados em `adminEntities`; esta camada espelha o padrão `list*` + `get*Summary`
 * dos outros serviços do módulo financeiro.
 */

import { adminChargesRows, type ChargeRow } from '../mocks/adminEntities';

export type { ChargeRow };

export function listCharges(): ChargeRow[] {
  return [...adminChargesRows];
}

export type ChargePortfolioSummary = {
  openCount: number;
  openTotal: number;
  overdueCount: number;
  overdueTotal: number;
  receivedTotal: number;
  pendingOnlyTotal: number;
};

export function getChargePortfolioSummary(rows: ChargeRow[]): ChargePortfolioSummary {
  const open = rows.filter((r) => r.status === 'pendente' || r.status === 'atrasado');
  const overdue = rows.filter((r) => r.status === 'atrasado');
  const paid = rows.filter((r) => r.status === 'pago');
  const openTotal = open.reduce((s, r) => s + r.valueNumber, 0);
  const overdueTotal = overdue.reduce((s, r) => s + r.valueNumber, 0);
  const receivedTotal = paid.reduce((s, r) => s + r.valueNumber, 0);
  return {
    openCount: open.length,
    openTotal,
    overdueCount: overdue.length,
    overdueTotal,
    receivedTotal,
    pendingOnlyTotal: rows.filter((r) => r.status === 'pendente').reduce((s, r) => s + r.valueNumber, 0),
  };
}
