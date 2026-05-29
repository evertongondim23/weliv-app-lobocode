import { Badge } from '../../../../app/components/ui/badge';
import { riskConfig } from '../constants/admin-defaults-page.constants';
import type { DefaultRiskLevel } from '../../../services/defaultRisk.service';

export function RiskBadge({ level }: { level: DefaultRiskLevel }) {
  const c = riskConfig[level];
  return (
    <Badge variant="outline" style={{ color: c.color, background: c.bg, borderColor: c.border }}>
      {c.label}
    </Badge>
  );
}
