import { Badge } from '../../../../app/components/ui/badge';
import { statusMeta } from '../constants/admin-pending-page.constants';
import type { PendingStatus } from '../../../services/pending.service';

export function StatusBadge({ status }: { status: PendingStatus }) {
  const meta = statusMeta[status];
  return (
    <Badge variant="outline" style={{ color: meta.color, borderColor: meta.color, background: meta.bg }}>
      {meta.label}
    </Badge>
  );
}
