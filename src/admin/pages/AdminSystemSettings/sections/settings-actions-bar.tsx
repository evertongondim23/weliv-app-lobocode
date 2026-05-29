import { RotateCcw, Save } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import {
  settingsDirtyBarStyle,
  settingsPrimaryActionStyle,
} from '../constants/admin-system-settings-page.constants';
import type { SettingsActionsBarProps } from '../types/admin-system-settings-page.types';

export function SettingsActionsBar({ isDirty, lastSavedAt, onSave, onReset }: SettingsActionsBarProps) {
  if (isDirty) {
    return (
      <div className="sticky bottom-0 z-30">
        <div className="rounded-xl border-2 px-3 py-3 md:px-4 md:py-3 shadow-sm" style={settingsDirtyBarStyle}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm font-medium" style={{ color: '#4A3728' }}>
              Você tem alterações não salvas.
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={onReset} className="w-full md:w-auto">
                <RotateCcw className="size-4" />
                Descartar
              </Button>
              <Button
                type="button"
                onClick={onSave}
                className="w-full md:w-auto"
                style={settingsPrimaryActionStyle}
              >
                <Save className="size-4" />
                Salvar alterações
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-xs" style={{ color: '#6B5D53' }}>
      {lastSavedAt ? `Última atualização: ${lastSavedAt.toLocaleString('pt-BR')}` : 'Nenhuma alteração pendente.'}
    </div>
  );
}
