import { Badge } from '../../../../app/components/ui/badge';
import type { AttendanceStatus } from '../../../services/attendance.service';
import { statusLabels, statusTone } from '../constants/admin-appointments-page.constants';

type StatusBadgeProps = {
  status: AttendanceStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const t = statusTone[status];
  return (
    <Badge variant="outline" style={{ color: t.c, borderColor: t.c, background: t.b }}>
      {statusLabels[status]}
    </Badge>
  );
}
