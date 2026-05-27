import { Card, CardContent } from '../../../../app/components/ui/card';
import { financeBorderStyle } from '../../../utils/financeUi';
import type { FinanceTabsCardProps } from '../types/admin-charges-page.types';
import { ChargesTabSection } from './charges-tab-section';
import { RecoveryTabSection } from './recovery-tab-section';

export function FinanceTabsCard({
  tab,
  onTabChange,
  chargesCount,
  recoveryCount,
  charges,
  recovery,
}: FinanceTabsCardProps) {
  return (
    <Card className="border-2" style={financeBorderStyle}>
      <div className="flex border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.18)' }}>
        {(
          [
            { id: 'charges' as const, label: 'Cobranças', count: chargesCount },
            { id: 'recovery' as const, label: 'Recuperação', count: recoveryCount },
          ] as const
        ).map(({ id, label, count }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={[
              'px-5 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === id
                ? 'border-[#FFA500] text-[#4A3728]'
                : 'border-transparent text-[#6B5D53] hover:text-[#4A3728]',
            ].join(' ')}
          >
            {label}
            <span
              className={[
                'ml-1.5 text-xs rounded-full px-1.5 py-0.5',
                tab === id ? 'bg-[#FFA500]/15 text-[#4A3728]' : 'bg-slate-100 text-[#6B5D53]',
              ].join(' ')}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <CardContent className="pt-5 space-y-4">
        {tab === 'charges' ? <ChargesTabSection {...charges} /> : <RecoveryTabSection {...recovery} />}
      </CardContent>
    </Card>
  );
}
