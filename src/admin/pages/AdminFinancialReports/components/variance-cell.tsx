import { TrendingDown, TrendingUp } from 'lucide-react';
import { formatPct } from '../utils/admin-financial-reports-page.utils';

export function VarianceCell({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return <span className="text-sm tabular-nums text-[#6B5D53]">—</span>;
  const v = ((current - previous) / Math.abs(previous)) * 100;
  const up = v >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  const color = up ? 'text-emerald-700' : 'text-red-700';
  return (
    <span className={`inline-flex items-center gap-1 text-sm tabular-nums font-medium ${color}`}>
      <Icon className="size-3.5 shrink-0" />
      {formatPct(v)}
    </span>
  );
}
