import { PageHeader } from '../../components/common/PageHeader';
import { useAdminSystemSettingsPage } from './hooks/use-admin-system-settings-page';
import { NotificationsSection } from './sections/notifications-section';
import { OperationPreferencesSection } from './sections/operation-preferences-section';
import { PlatformIdentitySection } from './sections/platform-identity-section';
import { SecurityAuditSection } from './sections/security-audit-section';
import { SettingsActionsBar } from './sections/settings-actions-bar';

export function AdminSystemSettingsPage() {
  const { settings, setSettings, isDirty, lastSavedAt, save, reset } = useAdminSystemSettingsPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parâmetros do sistema"
        description="Configurações globais da plataforma e preferências de operação."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PlatformIdentitySection settings={settings} setSettings={setSettings} />
        <OperationPreferencesSection settings={settings} setSettings={setSettings} />
        <NotificationsSection settings={settings} setSettings={setSettings} />
        <SecurityAuditSection settings={settings} setSettings={setSettings} />
      </div>

      <SettingsActionsBar isDirty={isDirty} lastSavedAt={lastSavedAt} onSave={save} onReset={reset} />
    </div>
  );
}
