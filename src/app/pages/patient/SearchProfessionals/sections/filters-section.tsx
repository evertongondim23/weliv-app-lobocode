import { Search } from 'lucide-react';
import { FilterSection } from '../../../../components/common';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import {
  FIELD_BORDER_STYLE,
  PRIMARY_ACTION_STYLE,
  SORT_OPTIONS,
} from '../constants/search-professionals.constants';
import type { FiltersSectionProps, SortBy } from '../types/search-professionals.types';

export function FiltersSection({
  searchTerm,
  specialtyFilter,
  sortBy,
  specialties,
  onSearchTermChange,
  onSpecialtyFilterChange,
  onSortByChange,
  onSearch,
}: FiltersSectionProps) {
  return (
    <FilterSection
      title="Filtros de Busca"
      description="Refine sua busca por especialidade e localização"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar por nome ou especialidade</Label>
          <Input
            id="search"
            placeholder="Digite para buscar..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="border-2"
            style={FIELD_BORDER_STYLE}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialty">Especialidade</Label>
          <Select value={specialtyFilter} onValueChange={onSpecialtyFilterChange}>
            <SelectTrigger id="specialty" className="border-2" style={FIELD_BORDER_STYLE}>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as especialidades</SelectItem>
              {specialties
                .filter((s) => s !== 'all')
                .map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortBy">Ordenar por</Label>
          <Select value={sortBy} onValueChange={(val) => onSortByChange(val as SortBy)}>
            <SelectTrigger id="sortBy" className="border-2" style={FIELD_BORDER_STYLE}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        className="mt-4 w-full sm:w-auto"
        onClick={onSearch}
        style={PRIMARY_ACTION_STYLE}
      >
        <Search className="size-4 mr-2" />
        Buscar
      </Button>
    </FilterSection>
  );
}
