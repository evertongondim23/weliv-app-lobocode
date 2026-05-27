import { Search } from 'lucide-react';
import { WelcomeCard } from '../../../components/common';
import { useSearchProfessionals } from './hooks/use-search-professionals';
import { FiltersSection } from './sections/filters-section';
import { ProfessionalsResultsSection } from './sections/professionals-results-section';

export function SearchProfessionals() {
  const { filters, results } = useSearchProfessionals();

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={Search}
        title="Buscar Profissionais"
        subtitle="Encontre o profissional ideal para você"
      />
      <FiltersSection {...filters} />
      <ProfessionalsResultsSection {...results} />
    </div>
  );
}
