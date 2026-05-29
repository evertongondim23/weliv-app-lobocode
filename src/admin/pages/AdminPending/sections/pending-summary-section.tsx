import { Card, CardContent } from '../../../../app/components/ui/card';
import { pendingCardBorderStyle } from '../constants/admin-pending-page.constants';
import type { PendingSummarySectionProps } from '../types/admin-pending-page.types';

const KPI_ITEMS = [
  { id: 'critical' as const, label: 'Críticas', valueKey: 'critical' as const },
  { id: 'inProgress' as const, label: 'Em andamento', valueKey: 'inProgress' as const },
  { id: 'approval' as const, label: 'Aprovações', valueKey: 'approvals' as const },
  { id: 'blocked' as const, label: 'Bloqueadas', valueKey: 'blocked' as const },
];

export function PendingSummarySection({
  summaryGlobal,
  kpiHighlight,
  onSelectKpi,
}: PendingSummarySectionProps) {
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {KPI_ITEMS.map(({ id, label, valueKey }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelectKpi(id)}
          className={`text-left rounded-xl transition-[box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]/40 ${
            kpiHighlight === id ? 'ring-2 ring-[#FFA500]/60' : ''
          }`}
        >
          <Card
            className="border-2 h-full cursor-pointer hover:bg-[#FFFBF0]/80"
            style={pendingCardBorderStyle}
          >
            <CardContent className="pt-5 space-y-1">
              <p className="text-xs uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                {label}
              </p>
              <p className="text-2xl font-bold" style={{ color: '#4A3728' }}>
                {summaryGlobal[valueKey]}
              </p>
            </CardContent>
          </Card>
        </button>
      ))}
    </section>
  );
}
