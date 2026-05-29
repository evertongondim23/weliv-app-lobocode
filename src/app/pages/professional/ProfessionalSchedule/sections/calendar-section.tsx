import { ptBR } from 'date-fns/locale';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Calendar } from '../../../../components/ui/calendar';
import { CALENDAR_BORDER_STYLE, CARD_BORDER_STYLE } from '../constants/professional-schedule.constants';
import type { CalendarSectionProps } from '../types/professional-schedule.types';

export function CalendarSection({
  selectedDate,
  onSelectDate,
  freeSlotsCount,
  dayAppointmentsCount,
  upcomingFreeSlots,
}: CalendarSectionProps) {
  return (
    <Card className="lg:col-span-1 border-2" style={CARD_BORDER_STYLE}>
      <CardHeader>
        <CardTitle style={{ color: '#4A3728' }}>Selecione o Dia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelectDate(date)}
          locale={ptBR}
          className="rounded-lg border-2"
          style={CALENDAR_BORDER_STYLE}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: '#6B5D53' }}>Horários disponíveis:</span>
            <Badge
              variant="outline"
              className="text-sm font-bold"
              style={{
                borderColor: '#FFA500',
                color: '#FFA500',
                background: 'rgba(255, 165, 0, 0.1)',
              }}
            >
              {freeSlotsCount}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: '#6B5D53' }}>Consultas agendadas:</span>
            <Badge
              variant="outline"
              className="text-sm font-bold"
              style={{
                borderColor: '#4A3728',
                color: '#4A3728',
                background: 'rgba(74, 55, 40, 0.1)',
              }}
            >
              {dayAppointmentsCount}
            </Badge>
          </div>
        </div>

        <div
          className="rounded-xl border p-3 space-y-2"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FFF8E7' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
            Próximos horários livres
          </p>
          {upcomingFreeSlots.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {upcomingFreeSlots.map((slot) => (
                <span
                  key={slot}
                  className="px-2 py-1 rounded-md text-xs font-medium border"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.28)', color: '#4A3728', background: 'white' }}
                >
                  {slot}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: '#6B5D53' }}>
              Sem horários livres neste dia.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
