import { Clock, DollarSign, Settings, User } from 'lucide-react';
import { WelcomeCard } from '../../../components/common';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { TAB_TRIGGER_CLASS } from './constants/professional-settings.constants';
import { useProfessionalSettings } from './hooks/use-professional-settings';
import { FinancialSection } from './sections/financial-section';
import { ProfileSection } from './sections/profile-section';
import { ScheduleSection } from './sections/schedule-section';

export function ProfessionalSettings() {
  const { guards, profile, financial, schedule } = useProfessionalSettings();
  const { user, authReady, professional } = guards;

  if (user?.role !== 'professional') {
    return (
      <div className="text-sm py-8" style={{ color: '#6B5D53' }}>
        Acesse como profissional para editar configurações.
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="text-sm py-8" style={{ color: '#6B5D53' }}>
        {!authReady ? 'Carregando sessão…' : 'Preparando seu perfil…'}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 max-w-6xl mx-auto">
      <WelcomeCard icon={Settings} title="Configurações" subtitle="Gerencie seu perfil e preferências" />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList
          className="grid w-full grid-cols-3 h-auto p-1.5 rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
        >
          <TabsTrigger value="profile" className={TAB_TRIGGER_CLASS}>
            <User className="size-4 mr-2" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className={TAB_TRIGGER_CLASS}>
            <DollarSign className="size-4 mr-2" />
            <span>Valores</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className={TAB_TRIGGER_CLASS}>
            <Clock className="size-4 mr-2" />
            <span>Horários</span>
          </TabsTrigger>
        </TabsList>

        <ProfileSection {...profile} />
        <FinancialSection {...financial} />
        <ScheduleSection {...schedule} />
      </Tabs>
    </div>
  );
}
