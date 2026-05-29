import { Badge } from '../../../../app/components/ui/badge';
import { statusConfig } from '../constants/admin-payments-page.constants';
import type { PaymentConciliationStatus } from '../../../services/paymentReconciliation.service';

export function PaymentStatusBadge({ status }: { status: PaymentConciliationStatus }) {
  const c = statusConfig[status];
  return (
    <Badge variant="outline" style={{ color: c.color, background: c.bg, borderColor: c.border }}>
      {c.label}
    </Badge>
  );
}
