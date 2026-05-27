import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../../../../contexts/DataContext';
import type { SortBy } from '../types/search-professionals.types';
import {
  buildSpecialtyOptions,
  filterProfessionals,
  sortProfessionals,
} from '../utils/search-professionals.utils';

export function useSearchProfessionals() {
  const { professionals } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortBy>('nearest');

  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [appliedSpecialtyFilter, setAppliedSpecialtyFilter] = useState('all');
  const [appliedSortBy, setAppliedSortBy] = useState<SortBy>('nearest');

  const specialties = useMemo(
    () => buildSpecialtyOptions(professionals),
    [professionals],
  );

  const sortedProfessionals = useMemo(() => {
    const filtered = filterProfessionals(
      professionals,
      appliedSearchTerm,
      appliedSpecialtyFilter,
    );
    return sortProfessionals(filtered, appliedSortBy);
  }, [professionals, appliedSearchTerm, appliedSpecialtyFilter, appliedSortBy]);

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setAppliedSpecialtyFilter(specialtyFilter);
    setAppliedSortBy(sortBy);
  };

  return {
    filters: {
      searchTerm,
      specialtyFilter,
      sortBy,
      specialties,
      onSearchTermChange: setSearchTerm,
      onSpecialtyFilterChange: setSpecialtyFilter,
      onSortByChange: setSortBy,
      onSearch: handleSearch,
    },
    results: {
      professionals: sortedProfessionals,
      onBookClick: (id: string) => navigate(`/patient/book/${id}`),
    },
  };
}
