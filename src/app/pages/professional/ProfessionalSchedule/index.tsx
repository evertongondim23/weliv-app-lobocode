import { ProfessionalAgendaBlocksPanel } from '../../../components/professional/ProfessionalAgendaBlocksPanel';
import { useProfessionalSchedule } from './hooks/use-professional-schedule';
import { CalendarSection } from './sections/calendar-section';
import { ScheduleDetailSection } from './sections/schedule-detail-section';

export function ProfessionalSchedule() {
  const { userId, selectedDate, calendar, detail } = useProfessionalSchedule();

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl lg:text-3xl mb-2" style={{ color: '#4A3728' }}>
          Agenda
        </h1>
        <p className="text-sm lg:text-base" style={{ color: '#6B5D53' }}>
          Gerencie seus horários e consultas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <CalendarSection
          selectedDate={selectedDate.date}
          onSelectDate={selectedDate.onSelectDate}
          freeSlotsCount={calendar.freeSlotsCount}
          dayAppointmentsCount={calendar.dayAppointmentsCount}
          upcomingFreeSlots={calendar.upcomingFreeSlots}
        />
        <ScheduleDetailSection {...detail} />
      </div>

      {userId ? (
        <section aria-label="Bloqueios e lembretes da agenda">
          <ProfessionalAgendaBlocksPanel professionalId={userId} />
        </section>
      ) : null}
    </div>
  );
}
