import type {
  AdminPaymentRow,
  PaymentConciliationStatus,
  PaymentGateway,
  PaymentMethod,
} from '../../../services/paymentReconciliation.service';
import { sortRank } from '../constants/admin-payments-page.constants';

export function filterPaymentRows(
  allRows: AdminPaymentRow[],
  search: string,
  statusFilter: 'all' | PaymentConciliationStatus,
  gatewayFilter: 'all' | PaymentGateway,
  methodFilter: 'all' | PaymentMethod,
): AdminPaymentRow[] {
  const q = search.trim().toLowerCase();
  return allRows.filter((row) => {
    const hay =
      `${row.id} ${row.chargeRef} ${row.patientName} ${row.unit} ${row.nsu ?? ''} ${row.gateway}`.toLowerCase();
    const okSearch = q.length === 0 || hay.includes(q);
    const okStatus = statusFilter === 'all' || row.status === statusFilter;
    const okGateway = gatewayFilter === 'all' || row.gateway === gatewayFilter;
    const okMethod = methodFilter === 'all' || row.method === methodFilter;
    return okSearch && okStatus && okGateway && okMethod;
  });
}

export function sortPaymentRows(filtered: AdminPaymentRow[]): AdminPaymentRow[] {
  return [...filtered].sort((a, b) => {
    const dr = sortRank[a.status] - sortRank[b.status];
    if (dr !== 0) return dr;
    return b.capturedAtIso.localeCompare(a.capturedAtIso);
  });
}

export function hasPaymentFilters(
  search: string,
  statusFilter: 'all' | PaymentConciliationStatus,
  gatewayFilter: 'all' | PaymentGateway,
  methodFilter: 'all' | PaymentMethod,
): boolean {
  return (
    search.trim().length > 0 ||
    statusFilter !== 'all' ||
    gatewayFilter !== 'all' ||
    methodFilter !== 'all'
  );
}

export function paymentRowAccent(row: AdminPaymentRow): string | undefined {
  if (row.status === 'dispute') return 'border-l-4 border-l-orange-600';
  if (row.status === 'refunded') return 'border-l-4 border-l-slate-500';
  if (row.status === 'pending_gateway') return 'border-l-4 border-l-amber-500';
  return 'border-l-4 border-l-emerald-600/70';
}
