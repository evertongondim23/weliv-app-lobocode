import { Badge } from '../../../../app/components/ui/badge';
import { chargeStatusConfig } from '../constants/admin-charges-page.constants';
import type { ChargeRow } from '../../../services/charge.service';

export function ChargeStatusBadge({ status }: { status: ChargeRow['status'] }) {
  const c = chargeStatusConfig[status];
  return (
    <Badge variant="outline" style={{ color: c.color, background: c.bg, borderColor: c.border }}>
      {c.label}
    </Badge>
  );
}
