import { Users } from 'lucide-react';
import { WelcomeCard } from '../../../components/common';
import { EditPatientDialog } from './components/edit-patient-dialog';
import { useProfessionalPatients } from './hooks/use-professional-patients';
import { PatientsListSection } from './sections/patients-list-section';
import { SearchSection } from './sections/search-section';

export function ProfessionalPatients() {
  const { search, list, editDialog } = useProfessionalPatients();

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={Users}
        title="Gerenciar Pacientes"
        subtitle="Consulte e atualize dados dos seus pacientes"
      />

      <SearchSection {...search} />
      <PatientsListSection {...list} />
      <EditPatientDialog {...editDialog} />
    </div>
  );
}
