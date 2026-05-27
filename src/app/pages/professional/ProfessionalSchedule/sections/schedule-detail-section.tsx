import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { CARD_BORDER_STYLE } from '../constants/professional-schedule.constants';
import type { ScheduleDetailSectionProps } from '../types/professional-schedule.types';
import { AppointmentsTabSection } from './appointments-tab-section';
import { AvailableSlotsTabSection } from './available-slots-tab-section';

export function ScheduleDetailSection({
  selectedDate,
  dayAppointments,
  freeSlots,
  onConfirm,
  onComplete,
  onMarkNoShow,
}: ScheduleDetailSectionProps) {
  return (
    <Card className="lg:col-span-2 border-2" style={CARD_BORDER_STYLE}>
      <CardHeader>
        <CardTitle className="capitalize" style={{ color: '#4A3728' }}>
          {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </CardTitle>
        <CardDescription>
          {dayAppointments.length > 0
            ? `${dayAppointments.length} consulta${dayAppointments.length > 1 ? 's' : ''} agendada${dayAppointments.length > 1 ? 's' : ''}`
            : 'Nenhuma consulta agendada'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appointments">Consultas ({dayAppointments.length})</TabsTrigger>
            <TabsTrigger value="available">Horários Livres ({freeSlots.length})</TabsTrigger>
          </TabsList>

          <AppointmentsTabSection
            dayAppointments={dayAppointments}
            freeSlotsCount={freeSlots.length}
            onConfirm={onConfirm}
            onComplete={onComplete}
            onMarkNoShow={onMarkNoShow}
          />
          <AvailableSlotsTabSection freeSlots={freeSlots} />
        </Tabs>
      </CardContent>
    </Card>
  );
}
