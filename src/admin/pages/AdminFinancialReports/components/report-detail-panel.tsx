import { Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../../app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../app/components/ui/card';
import { pctOfTotal } from '../../../services/financialReports.service';
import { formatBRL } from '../../../utils/formatCurrency';
import { financeBorderStyle } from '../../../utils/financeUi';
import type { ReportDetailPanelProps } from '../types/admin-financial-reports-page.types';
import { CategoryBadge } from './category-badge';
import { VarianceCell } from './variance-cell';

export function ReportDetailPanel({ selected, netRevenue, onClose }: ReportDetailPanelProps) {
  return (
    <Card className="border-2 h-fit xl:sticky xl:top-24" style={financeBorderStyle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base" style={{ color: '#4A3728' }}>
              {selected.label}
            </CardTitle>
            <CardDescription className="text-xs">
              {selected.id} · {selected.unit}
            </CardDescription>
          </div>
          <Button type="button" size="icon" variant="ghost" className="size-8" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category={selected.category} />
        </div>
        <div className="space-y-2 rounded-lg border p-3" style={financeBorderStyle}>
          <p>
            <strong>Valor no período:</strong>{' '}
            <span className="tabular-nums font-semibold">{formatBRL(selected.amount)}</span>
          </p>
          <p>
            <strong>Mês anterior:</strong>{' '}
            <span className="tabular-nums">{formatBRL(selected.prevAmount)}</span>
          </p>
          <p>
            <strong>Variação:</strong>{' '}
            <VarianceCell current={selected.amount} previous={selected.prevAmount} />
          </p>
          <p className="text-xs" style={{ color: '#6B5D53' }}>
            Participação na receita líquida do recorte:{' '}
            <strong>
              {netRevenue === 0 ? '—' : `${pctOfTotal(selected.amount, netRevenue).toFixed(1)}%`}
            </strong>
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full border-2"
          style={financeBorderStyle}
          onClick={() => toast.success(`Linha ${selected.id} incluída no próximo export (demo).`)}
        >
          <Download className="size-4 mr-1.5" />
          Incluir no export
        </Button>
      </CardContent>
    </Card>
  );
}
