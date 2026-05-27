import { Clock } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { TabsContent } from '../../../../components/ui/tabs';
import { CARD_BORDER_STYLE } from '../constants/professional-schedule.constants';
import type { AvailableSlotsTabSectionProps } from '../types/professional-schedule.types';

export function AvailableSlotsTabSection({ freeSlots }: AvailableSlotsTabSectionProps) {
  return (
    <TabsContent value="available" className="mt-6">
      {freeSlots.length === 0 ? (
        <div
          className="rounded-2xl border p-5 lg:p-6 text-center"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
        >
          <div className="inline-flex p-3 rounded-xl bg-white mb-3">
            <Clock className="size-5" style={{ color: '#FFA500' }} />
          </div>
          <p className="text-base font-semibold" style={{ color: '#4A3728' }}>
            Todos os horários ocupados
          </p>
          <p className="text-sm mt-1" style={{ color: '#6B5D53' }}>
            Escolha outra data para visualizar disponibilidade.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {freeSlots.map((slot) => (
            <Button
              key={slot}
              variant="outline"
              className="h-auto py-3 border-2 font-medium"
              style={{
                borderColor: 'rgba(255, 165, 0, 0.2)',
                color: '#6B5D53',
              }}
              disabled
            >
              {slot}
            </Button>
          ))}
        </div>
      )}
    </TabsContent>
  );
}
