import { Card, CardContent } from '../../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import {
  CARD_BORDER_STYLE,
  FIELD_BORDER_STYLE,
  PERIOD_OPTIONS,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-financial.constants';
import type { FinancialFiltersSectionProps, FinancialPeriod } from '../types/professional-financial.types';

export function FinancialFiltersSection({ period, onPeriodChange }: FinancialFiltersSectionProps) {
  return (
    <Card className="border-2" style={CARD_BORDER_STYLE}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium" style={{ color: TEXT_PRIMARY_COLOR }}>
            Período:
          </label>
          <Select value={period} onValueChange={(val) => onPeriodChange(val as FinancialPeriod)}>
            <SelectTrigger className="w-[200px] border-2" style={FIELD_BORDER_STYLE}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
