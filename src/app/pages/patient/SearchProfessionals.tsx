import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { WelcomeCard, FilterSection, ProfessionalCard } from '../../components/common';
import { EmptyState } from '../../components/EmptyState';

export function SearchProfessionals() {
  const { professionals } = useData();
  const navigate = useNavigate();
  
  // Temporary filter states (before search is clicked)
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'nearest' | 'price' | 'availability'>('nearest');

  // Applied filter states (after search is clicked)
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [appliedSpecialtyFilter, setAppliedSpecialtyFilter] = useState('all');
  const [appliedSortBy, setAppliedSortBy] = useState<'nearest' | 'price' | 'availability'>('nearest');

  const specialties = ['all', ...Array.from(new Set(professionals.map(p => p.specialty)))];

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setAppliedSpecialtyFilter(specialtyFilter);
    setAppliedSortBy(sortBy);
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
                         prof.specialty.toLowerCase().includes(appliedSearchTerm.toLowerCase());
    const matchesSpecialty = appliedSpecialtyFilter === 'all' || prof.specialty === appliedSpecialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    if (appliedSortBy === 'price') return a.consultationPrice - b.consultationPrice;
    if (appliedSortBy === 'availability') return 0; // Simplified
    return 0; // 'nearest' would use geolocation
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <WelcomeCard
        icon={Search}
        title="Buscar Profissionais"
        subtitle="Encontre o profissional ideal para você"
      />

      {/* Filters */}
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2"
              style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Especialidade</Label>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger id="specialty" className="border-2" 
                             style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {specialties.filter(s => s !== 'all').map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortBy">Ordenar por</Label>
            <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <SelectTrigger id="sortBy" className="border-2" 
                             style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nearest">Mais próximo</SelectItem>
                <SelectItem value="price">Menor preço</SelectItem>
                <SelectItem value="availability">Disponibilidade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="mt-4 w-full sm:w-auto"
          onClick={handleSearch}
          style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
        >
          <Search className="size-4 mr-2" />
          Buscar
        </Button>
      </FilterSection>

      {/* Results */}
      {sortedProfessionals.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum profissional encontrado"
          description="Tente ajustar os filtros de busca"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedProfessionals.map(professional => (
            <ProfessionalCard
              key={professional.id}
              id={professional.id}
              name={professional.name}
              specialty={professional.specialty}
              location={professional.address}
              consultationPrice={professional.consultationPrice}
              rating={4.8}
              avatar={professional.avatar}
              available={true}
              onBookClick={(id) => navigate(`/patient/book/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}