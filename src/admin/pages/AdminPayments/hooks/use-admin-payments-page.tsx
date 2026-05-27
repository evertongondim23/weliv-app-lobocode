import { useEffect, useMemo, useState } from 'react';
import type { DataTableColumn } from '../../../components/tables/DataTable';
import { formatBRL } from '../../../utils/formatCurrency';
import {
  getPaymentReconciliationSummary,
  listAdminPayments,
  type AdminPaymentRow,
  type PaymentConciliationStatus,
  type PaymentGateway,
  type PaymentMethod,
} from '../../../services/paymentReconciliation.service';
import { PaymentStatusBadge } from '../components/payment-status-badge';
import {
  filterPaymentRows,
  hasPaymentFilters,
  sortPaymentRows,
} from '../utils/admin-payments-page.utils';

export function useAdminPaymentsPage() {
  const allRows = useMemo(() => listAdminPayments(), []);
  const summary = useMemo(() => getPaymentReconciliationSummary(allRows), [allRows]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentConciliationStatus>('all');
  const [gatewayFilter, setGatewayFilter] = useState<'all' | PaymentGateway>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');
  const [selected, setSelected] = useState<AdminPaymentRow | null>(null);

  const filtered = useMemo(
    () => filterPaymentRows(allRows, search, statusFilter, gatewayFilter, methodFilter),
    [allRows, search, statusFilter, gatewayFilter, methodFilter],
  );

  const sortedRows = useMemo(() => sortPaymentRows(filtered), [filtered]);

  useEffect(() => {
    if (sortedRows.length === 0) {
      setSelected(null);
      return;
    }
    setSelected((prev) => {
      if (prev && sortedRows.some((r) => r.id === prev.id)) return prev;
      return sortedRows[0];
    });
  }, [sortedRows]);

  const hasFilters = hasPaymentFilters(search, statusFilter, gatewayFilter, methodFilter);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setGatewayFilter('all');
    setMethodFilter('all');
  };

  const columns: DataTableColumn<AdminPaymentRow>[] = useMemo(
    () => [
      {
        key: 'id',
        header: 'Pagamento',
        render: (row) => <span className="font-semibold tabular-nums">{row.id}</span>,
      },
      {
        key: 'ref',
        header: 'Cobrança',
        render: (row) => <span className="font-medium text-sm tabular-nums">{row.chargeRef}</span>,
      },
      { key: 'patient', header: 'Paciente', className: 'min-w-[130px]', render: (row) => row.patientName },
      {
        key: 'gross',
        header: 'Bruto',
        render: (row) => <span className="tabular-nums font-medium">{formatBRL(row.grossAmount)}</span>,
      },
      {
        key: 'net',
        header: 'Líquido',
        render: (row) => (
          <span className="tabular-nums text-sm" style={{ color: '#047857' }}>
            {formatBRL(row.netAmount)}
          </span>
        ),
      },
      {
        key: 'gw',
        header: 'Gateway',
        render: (row) => (
          <span className="text-sm font-medium" style={{ color: '#4A3728' }}>
            {row.gateway}
          </span>
        ),
      },
      {
        key: 'cap',
        header: 'Captura',
        render: (row) => (
          <span className="text-xs tabular-nums whitespace-nowrap" style={{ color: '#6B5D53' }}>
            {row.capturedAt}
          </span>
        ),
      },
      { key: 'st', header: 'Conciliação', render: (row) => <PaymentStatusBadge status={row.status} /> },
    ],
    [],
  );

  return {
    summary: { summary },
    list: {
      search,
      onSearchChange: setSearch,
      statusFilter,
      onStatusFilterChange: setStatusFilter,
      gatewayFilter,
      onGatewayFilterChange: setGatewayFilter,
      methodFilter,
      onMethodFilterChange: setMethodFilter,
      hasFilters,
      onClearFilters: clearFilters,
      sortedRows,
      columns,
      selected,
      onSelect: setSelected,
      onClosePanel: () => setSelected(null),
    },
  };
}
