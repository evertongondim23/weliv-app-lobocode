import { Search } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { CARD_BORDER_STYLE, FIELD_BORDER_STYLE } from '../constants/professional-patients.constants';
import type { SearchSectionProps } from '../types/professional-patients.types';

export function SearchSection({ searchTerm, onSearchChange }: SearchSectionProps) {
  return (
    <Card className="border-2" style={CARD_BORDER_STYLE}>
      <CardContent className="pt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-2"
            style={FIELD_BORDER_STYLE}
          />
        </div>
      </CardContent>
    </Card>
  );
}
