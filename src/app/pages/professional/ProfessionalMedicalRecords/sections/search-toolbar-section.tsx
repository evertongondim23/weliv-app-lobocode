import { Plus, Search } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import {
  CARD_BORDER_STYLE,
  FIELD_BORDER_STYLE,
  FIELD_CLASS_NAME,
  PRIMARY_ACTION_STYLE,
  TEXT_MUTED_COLOR,
} from '../constants/professional-medical-records.constants';
import type { SearchToolbarSectionProps } from '../types/professional-medical-records.types';

export function SearchToolbarSection({ search, onSearchChange, onCreate, count }: SearchToolbarSectionProps) {
  return (
    <Card className="border-2" style={CARD_BORDER_STYLE}>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Buscar por paciente, CPF, ID ou queixa..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 ${FIELD_CLASS_NAME}`}
              style={FIELD_BORDER_STYLE}
            />
          </div>
          <Button
            type="button"
            className="w-full sm:w-auto shrink-0 text-white border-0"
            style={PRIMARY_ACTION_STYLE}
            onClick={onCreate}
          >
            <Plus className="size-4 mr-2" />
            Novo prontuário
          </Button>
        </div>
        <p className="text-xs mt-3" style={{ color: TEXT_MUTED_COLOR }}>
          {count} prontuário(s) neste perfil profissional
        </p>
      </CardContent>
    </Card>
  );
}
