import type { Professional } from '../../../../types';

export type SortBy = 'nearest' | 'price' | 'availability';

export type FiltersSectionProps = {
  searchTerm: string;
  specialtyFilter: string;
  sortBy: SortBy;
  specialties: string[];
  onSearchTermChange: (value: string) => void;
  onSpecialtyFilterChange: (value: string) => void;
  onSortByChange: (value: SortBy) => void;
  onSearch: () => void;
};

export type ProfessionalsResultsSectionProps = {
  professionals: Professional[];
  onBookClick: (id: string) => void;
};
