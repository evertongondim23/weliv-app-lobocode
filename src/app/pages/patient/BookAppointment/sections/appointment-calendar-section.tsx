import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Calendar } from '../../../../components/ui/calendar';
import {
  CARD_BORDER_STYLE,
  CARD_HEADER_STYLE,
  TITLE_COLOR,
} from '../constants/book-appointment.constants';
import type { AppointmentCalendarSectionProps } from '../types/book-appointment.types';

export function AppointmentCalendarSection({
  selectedDate,
  today,
  onSelectDate,
}: AppointmentCalendarSectionProps) {
  return (
    <Card className="border-2 shadow-sm" style={CARD_BORDER_STYLE}>
      <CardHeader className="border-b" style={CARD_HEADER_STYLE}>
        <CardTitle style={{ color: TITLE_COLOR }}>Selecione a Data</CardTitle>
        <CardDescription>Escolha um dia disponível</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={{ before: today }}
          locale={ptBR}
          className="rounded-md border p-2"
          style={CARD_BORDER_STYLE}
        />
      </CardContent>
    </Card>
  );
}
