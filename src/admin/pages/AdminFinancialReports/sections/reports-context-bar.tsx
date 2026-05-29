import { Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../../../app/components/ui/badge';
import { Button } from '../../../../app/components/ui/button';
import { financeBorderStyle } from '../../../utils/financeUi';
import type { ReportsContextBarProps } from '../types/admin-financial-reports-page.types';

export function ReportsContextBar({ periodLabel, unitFilter }: ReportsContextBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-sm" style={{ color: '#6B5D53' }}>
        <span className="font-medium" style={{ color: '#4A3728' }}>
          Recorte ativo:
        </span>
        <Badge
          variant="outline"
          className="font-normal"
          style={{ borderColor: 'rgba(255, 165, 0, 0.35)', color: '#4A3728' }}
        >
          {periodLabel}
        </Badge>
        {unitFilter !== 'all' ? (
          <Badge
            variant="outline"
            className="font-normal"
            style={{ borderColor: 'rgba(255, 165, 0, 0.35)', color: '#4A3728' }}
          >
            {unitFilter}
          </Badge>
        ) : (
          <span className="text-xs">· Todas as unidades</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-2"
          style={financeBorderStyle}
          onClick={() =>
            toast.success('Exportação agendada (demo). Você receberá o arquivo por e-mail.')
          }
        >
          <Download className="size-4 mr-1.5" />
          Exportar
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-2"
          style={financeBorderStyle}
          onClick={() =>
            toast.message('Dados atualizados', { description: 'Snapshot financeiro recarregado (mock).' })
          }
        >
          <RefreshCw className="size-4 mr-1.5" />
          Atualizar
        </Button>
      </div>
    </div>
  );
}
