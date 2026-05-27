import { Switch } from '../../../../app/components/ui/switch';
import type { SettingsSwitchRowProps } from '../types/admin-system-settings-page.types';

export function SettingsSwitchRow({ label, description, checked, onCheckedChange }: SettingsSwitchRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border p-3 bg-white">
      <div className="space-y-0.5">
        <div className="text-sm font-medium" style={{ color: '#4A3728' }}>
          {label}
        </div>
        <div className="text-xs" style={{ color: '#6B5D53' }}>
          {description}
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
