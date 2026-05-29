import { Search } from 'lucide-react';
import { ProfessionalCard } from '../../../../components/common';
import { EmptyState } from '../../../../components/EmptyState';
import type { ProfessionalsResultsSectionProps } from '../types/search-professionals.types';

export function ProfessionalsResultsSection({
  professionals,
  onBookClick,
}: ProfessionalsResultsSectionProps) {
  if (professionals.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="Nenhum profissional encontrado"
        description="Tente ajustar os filtros de busca"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {professionals.map((professional) => (
        <ProfessionalCard
          key={professional.id}
          id={professional.id}
          name={professional.name}
          specialty={professional.specialty}
          professionalTitle={professional.professionalTitle}
          biography={professional.biography}
          location={professional.address}
          consultationPrice={professional.consultationPrice}
          rating={4.8}
          avatar={professional.avatar}
          available={true}
          onBookClick={onBookClick}
        />
      ))}
    </div>
  );
}
