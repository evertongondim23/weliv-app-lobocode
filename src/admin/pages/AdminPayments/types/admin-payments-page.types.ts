import type { DataTableColumn } from '../../../components/tables/DataTable';
import type {
  AdminPaymentRow,
  PaymentConciliationStatus,
  PaymentGateway,
  PaymentMethod,
} from '../../../services/paymentReconciliation.service';
import type { getPaymentReconciliationSummary } from '../../../services/paymentReconciliation.service';

export type PaymentReconciliationSummary = ReturnType<typeof getPaymentReconciliationSummary>;

export type PaymentsEmptyStateProps = Record<string, never>;

export type PaymentDetailPanelProps = {
  selected: AdminPaymentRow;
  onClose: () => void;
};

export type PaymentsSummarySectionProps = {
  summary: PaymentReconciliationSummary;
};

export type PaymentsListSectionProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | PaymentConciliationStatus;
  onStatusFilterChange: (value: 'all' | PaymentConciliationStatus) => void;
  gatewayFilter: 'all' | PaymentGateway;
  onGatewayFilterChange: (value: 'all' | PaymentGateway) => void;
  methodFilter: 'all' | PaymentMethod;
  onMethodFilterChange: (value: 'all' | PaymentMethod) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
  sortedRows: AdminPaymentRow[];
  columns: DataTableColumn<AdminPaymentRow>[];
  selected: AdminPaymentRow | null;
  onSelect: (row: AdminPaymentRow) => void;
  onClosePanel: () => void;
};
