import { Badge } from '../../../../app/components/ui/badge';
import { priorityMeta } from '../constants/admin-pending-page.constants';
import type { PendingPriority } from '../../../services/pending.service';

export function PriorityBadge({ priority }: { priority: PendingPriority }) {
  const meta = priorityMeta[priority];
  return (
    <Badge variant="outline" style={{ color: meta.color, borderColor: meta.color, background: meta.bg }}>
      {meta.label}
    </Badge>
  );
}
