import { Badge } from '../../../../app/components/ui/badge';
import { reportCategoryLabels } from '../../../services/financialReports.service';
import type { ReportCategory } from '../../../services/financialReports.service';
import { categoryStyle } from '../constants/admin-financial-reports-page.constants';

export function CategoryBadge({ category }: { category: ReportCategory }) {
  const c = categoryStyle[category];
  return (
    <Badge variant="outline" style={{ color: c.color, background: c.bg, borderColor: c.border }}>
      {reportCategoryLabels[category]}
    </Badge>
  );
}
