import { Card, CardContent, CardDescription } from '../../../../app/components/ui/card';
import { Input } from '../../../../app/components/ui/input';
import { Label } from '../../../../app/components/ui/label';
import { Separator } from '../../../../app/components/ui/separator';
import { Textarea } from '../../../../app/components/ui/textarea';
import { SettingsSwitchRow } from '../components/settings-switch-row';
import { settingsCardBorderStyle } from '../constants/admin-system-settings-page.constants';
import type { SystemSettingsSectionProps } from '../types/admin-system-settings-page.types';
import { clampInt } from '../utils/admin-system-settings-page.utils';

export function OperationPreferencesSection({ settings, setSettings }: SystemSettingsSectionProps) {
  return (
    <Card className="border-2" style={settingsCardBorderStyle}>
      <CardContent className="pt-6 space-y-4">
        <div>
          <div className="text-sm font-semibold" style={{ color: '#4A3728' }}>
            Preferências de operação
          </div>
          <CardDescription>Regras padrão que impactam jornada e SLA.</CardDescription>
        </div>

        <Separator />

        <div className="grid gap-4">
          <SettingsSwitchRow
            label="Modo manutenção"
            description="Bloqueia ações críticas e exibe aviso para usuários."
            checked={settings.maintenanceMode}
            onCheckedChange={(v) => setSettings((s) => ({ ...s, maintenanceMode: v }))}
          />

          <SettingsSwitchRow
            label="Permitir agendamento no mesmo dia"
            description="Se desativado, oferta apenas para dias futuros."
            checked={settings.allowSameDayBooking}
            onCheckedChange={(v) => setSettings((s) => ({ ...s, allowSameDayBooking: v }))}
          />

          <div className="grid gap-2">
            <Label htmlFor="cancelWindow">Janela padrão de cancelamento (horas)</Label>
            <Input
              id="cancelWindow"
              type="number"
              min={0}
              max={168}
              value={settings.defaultCancellationWindowHours}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  defaultCancellationWindowHours: clampInt(Number(e.target.value), 0, 168),
                }))
              }
              className="border-2 bg-white"
              style={settingsCardBorderStyle}
            />
            <div className="text-xs" style={{ color: '#6B5D53' }}>
              Ex.: 12h significa que o cancelamento é permitido até 12 horas antes.
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="statusMessage">Mensagem para página de status (opcional)</Label>
            <Textarea
              id="statusMessage"
              value={settings.publicStatusPageMessage}
              onChange={(e) => setSettings((s) => ({ ...s, publicStatusPageMessage: e.target.value }))}
              className="border-2 bg-white"
              style={settingsCardBorderStyle}
            />
            <div className="text-xs" style={{ color: '#6B5D53' }}>
              Dica: use para avisos curtos (“Estamos em manutenção programada…”).
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
