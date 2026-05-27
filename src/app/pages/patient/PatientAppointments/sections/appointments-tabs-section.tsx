import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import {
  TABS_LIST_CLASS,
  TABS_LIST_STYLE,
  TABS_TRIGGER_CLASS,
} from '../constants/patient-appointments.constants';
import { AppointmentsTabPanel } from '../components/appointments-tab-panel';
import type { AppointmentsTabsSectionProps } from '../types/patient-appointments.types';

export function AppointmentsTabsSection({
  upcoming,
  past,
  cancelled,
  professionals,
  onCancel,
  onReschedule,
}: AppointmentsTabsSectionProps) {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className={TABS_LIST_CLASS} style={TABS_LIST_STYLE}>
        <TabsTrigger value="upcoming" className={TABS_TRIGGER_CLASS}>
          Próximas ({upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="past" className={TABS_TRIGGER_CLASS}>
          Realizadas ({past.length})
        </TabsTrigger>
        <TabsTrigger value="cancelled" className={TABS_TRIGGER_CLASS}>
          Canceladas ({cancelled.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4 mt-6">
        <AppointmentsTabPanel
          appointments={upcoming}
          professionals={professionals}
          emptyTitle="Nenhuma consulta agendada"
          emptyDescription="Quando você agendar uma consulta, ela aparecerá aqui"
          onCancel={onCancel}
          onReschedule={onReschedule}
        />
      </TabsContent>

      <TabsContent value="past" className="space-y-4 mt-6">
        <AppointmentsTabPanel
          appointments={past}
          professionals={professionals}
          emptyTitle="Nenhuma consulta realizada ainda"
          emptyDescription="Seu histórico de consultas será exibido aqui"
          onCancel={onCancel}
          onReschedule={onReschedule}
        />
      </TabsContent>

      <TabsContent value="cancelled" className="space-y-4 mt-6">
        <AppointmentsTabPanel
          appointments={cancelled}
          professionals={professionals}
          emptyTitle="Nenhuma consulta cancelada"
          emptyDescription="Consultas canceladas aparecerão nesta aba"
          onCancel={onCancel}
          onReschedule={onReschedule}
        />
      </TabsContent>
    </Tabs>
  );
}
