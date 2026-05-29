import type { Professional } from '../../../../types';
import type { SortBy } from '../types/search-professionals.types';

export function buildSpecialtyOptions(professionals: Professional[]): string[] {
  return [
    'all',
    ...Array.from(
      new Set(
        professionals
          .map((p) => p.specialty?.trim())
          .filter((s): s is string => Boolean(s)),
      ),
    ),
  ];
}

export function filterProfessionals(
  professionals: Professional[],
  appliedSearchTerm: string,
  appliedSpecialtyFilter: string,
): Professional[] {
  return professionals.filter((prof) => {
    const matchesSearch =
      prof.name.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
      prof.specialty.toLowerCase().includes(appliedSearchTerm.toLowerCase());
    const matchesSpecialty =
      appliedSpecialtyFilter === 'all' || prof.specialty === appliedSpecialtyFilter;
    return matchesSearch && matchesSpecialty;
  });
}

export function sortProfessionals(
  professionals: Professional[],
  appliedSortBy: SortBy,
): Professional[] {
  return [...professionals].sort((a, b) => {
    if (appliedSortBy === 'price') return a.consultationPrice - b.consultationPrice;
    if (appliedSortBy === 'availability') return 0;
    return 0;
  });
}
