import { useRef, useState } from 'react';
import { SEED_SYSTEM_SETTINGS } from '../constants/admin-system-settings-page.constants';
import type { SystemSettings } from '../types/admin-system-settings-page.types';

export function useAdminSystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(SEED_SYSTEM_SETTINGS);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const initialRef = useRef<string>(JSON.stringify(SEED_SYSTEM_SETTINGS));
  const isDirty = JSON.stringify(settings) !== initialRef.current;

  function save() {
    initialRef.current = JSON.stringify(settings);
    setLastSavedAt(new Date());
  }

  function reset() {
    const initial = JSON.parse(initialRef.current) as SystemSettings;
    setSettings(initial);
  }

  return {
    settings,
    setSettings,
    isDirty,
    lastSavedAt,
    save,
    reset,
  };
}
