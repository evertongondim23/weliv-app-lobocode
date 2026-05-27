import { Card, CardContent, CardDescription } from '../../../../app/components/ui/card';
import { Separator } from '../../../../app/components/ui/separator';
import { SettingsSwitchRow } from '../components/settings-switch-row';
import { settingsCardBorderStyle } from '../constants/admin-system-settings-page.constants';
import type { SystemSettingsSectionProps } from '../types/admin-system-settings-page.types';

export function NotificationsSection({ settings, setSettings }: SystemSettingsSectionProps) {
  return (
    <Card className="border-2" style={settingsCardBorderStyle}>
      <CardContent className="pt-6 space-y-4">
        <div>
          <div className="text-sm font-semibold" style={{ color: '#4A3728' }}>
            Notificações e alertas
          </div>
          <CardDescription>O que a operação quer saber em tempo real.</CardDescription>
        </div>

        <Separator />

        <div className="grid gap-3">
          <SettingsSwitchRow
            label="Alertar admin em novo usuário"
            description="Envia notificação quando um novo usuário é criado."
            checked={settings.notifyAdminOnNewUser}
            onCheckedChange={(v) => setSettings((s) => ({ ...s, notifyAdminOnNewUser: v }))}
          />

          <SettingsSwitchRow
            label="Alertar admin em problema de pagamento"
            description="Notifica falhas, estornos e recorrência interrompida."
            checked={settings.notifyAdminOnPaymentIssues}
            onCheckedChange={(v) => setSettings((s) => ({ ...s, notifyAdminOnPaymentIssues: v }))}
          />
        </div>
      </CardContent>
    </Card>
  );
}
