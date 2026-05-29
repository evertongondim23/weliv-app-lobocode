import { Card, CardContent, CardDescription } from '../../../../app/components/ui/card';
import { Label } from '../../../../app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Separator } from '../../../../app/components/ui/separator';
import { SettingsSwitchRow } from '../components/settings-switch-row';
import {
  AUDIT_RETENTION_OPTIONS,
  settingsCardBorderStyle,
} from '../constants/admin-system-settings-page.constants';
import type { SystemSettings, SystemSettingsSectionProps } from '../types/admin-system-settings-page.types';

export function SecurityAuditSection({ settings, setSettings }: SystemSettingsSectionProps) {
  return (
    <Card className="border-2" style={settingsCardBorderStyle}>
      <CardContent className="pt-6 space-y-4">
        <div>
          <div className="text-sm font-semibold" style={{ color: '#4A3728' }}>
            Segurança e auditoria
          </div>
          <CardDescription>Controles básicos para reduzir risco operacional.</CardDescription>
        </div>

        <Separator />

        <div className="grid gap-4">
          <SettingsSwitchRow
            label="Exigir MFA para administradores"
            description="Recomendado para perfis com acesso a dados sensíveis."
            checked={settings.requireMfaForAdmins}
            onCheckedChange={(v) => setSettings((s) => ({ ...s, requireMfaForAdmins: v }))}
          />

          <div className="grid gap-2">
            <Label>Retenção de auditoria</Label>
            <Select
              value={String(settings.auditRetentionDays)}
              onValueChange={(v) =>
                setSettings((s) => ({
                  ...s,
                  auditRetentionDays: Number(v) as SystemSettings['auditRetentionDays'],
                }))
              }
            >
              <SelectTrigger className="border-2 bg-white" style={settingsCardBorderStyle}>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {AUDIT_RETENTION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs" style={{ color: '#6B5D53' }}>
              Mantém logs e rastreabilidade para investigações e conformidade.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
