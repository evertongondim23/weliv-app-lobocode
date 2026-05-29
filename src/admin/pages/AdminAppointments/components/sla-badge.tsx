import { Badge } from '../../../../app/components/ui/badge';
import type { AttendanceSla } from '../../../services/attendance.service';
import { slaLabels } from '../constants/admin-appointments-page.constants';

type SlaBadgeProps = {
  sla: AttendanceSla;
};

export function SlaBadge({ sla }: SlaBadgeProps) {
  const m = slaLabels[sla];
  return (
    <Badge variant="outline" style={{ color: m.color, borderColor: m.color, background: m.bg }}>
      {m.label}
    </Badge>
  );
}
