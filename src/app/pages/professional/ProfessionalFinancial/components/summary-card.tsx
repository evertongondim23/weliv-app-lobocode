import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  CARD_BORDER_STYLE,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-financial.constants';
import type { SummaryCardProps } from '../types/professional-financial.types';

export function SummaryCard({
  title,
  icon: Icon,
  iconClassName,
  iconStyle,
  value,
  valueClassName,
  valueStyle,
  subtitle,
  borderStyle = CARD_BORDER_STYLE,
  headerLayout = 'row',
}: SummaryCardProps) {
  return (
    <Card className="border-2" style={borderStyle}>
      <CardHeader
        className={
          headerLayout === 'row'
            ? 'flex flex-row items-center justify-between pb-2 space-y-0'
            : 'pb-2'
        }
      >
        <CardTitle
          className={`text-sm font-medium${headerLayout === 'column' ? ' flex items-center gap-2' : ''}`}
          style={{ color: TEXT_PRIMARY_COLOR }}
        >
          {headerLayout === 'column' && Icon ? (
            <Icon className={iconClassName ?? 'size-4'} style={iconStyle} />
          ) : null}
          {title}
        </CardTitle>
        {headerLayout === 'row' && Icon ? (
          <Icon className={iconClassName ?? 'size-5'} style={iconStyle} />
        ) : null}
      </CardHeader>
      <CardContent>
        <div className={`${valueClassName ?? ''} ${headerLayout === 'row' ? 'text-3xl font-bold' : 'text-2xl font-bold'}`} style={valueStyle}>
          {value}
        </div>
        {subtitle ? (
          <p className={`text-muted-foreground mt-1 ${headerLayout === 'column' ? 'text-xs' : 'text-sm'}`}>
            {subtitle}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
