import { Card, CardContent, CardDescription } from '../../../../app/components/ui/card';
import { Input } from '../../../../app/components/ui/input';
import { Label } from '../../../../app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { Separator } from '../../../../app/components/ui/separator';
import {
  LOCALE_OPTIONS,
  settingsCardBorderStyle,
  TIMEZONE_OPTIONS,
} from '../constants/admin-system-settings-page.constants';
import type { SystemSettings, SystemSettingsSectionProps } from '../types/admin-system-settings-page.types';

export function PlatformIdentitySection({ settings, setSettings }: SystemSettingsSectionProps) {
  return (
    <Card className="border-2" style={settingsCardBorderStyle}>
      <CardContent className="pt-6 space-y-4">
        <div>
          <div className="text-sm font-semibold" style={{ color: '#4A3728' }}>
            Identidade da plataforma
          </div>
          <CardDescription>O que aparece em e-mails, telas e comunicações.</CardDescription>
        </div>

        <Separator />

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="platformName">Nome da plataforma</Label>
            <Input
              id="platformName"
              value={settings.platformName}
              onChange={(e) => setSettings((s) => ({ ...s, platformName: e.target.value }))}
              className="border-2 bg-white"
              style={settingsCardBorderStyle}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="supportEmail">E-mail de suporte</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))}
              className="border-2 bg-white"
              style={settingsCardBorderStyle}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="baseUrl">URL base</Label>
            <Input
              id="baseUrl"
              value={settings.baseUrl}
              onChange={(e) => setSettings((s) => ({ ...s, baseUrl: e.target.value }))}
              className="border-2 bg-white"
              style={settingsCardBorderStyle}
            />
          </div>

          <div className="grid gap-2">
            <Label>Fuso horário</Label>
            <Select value={settings.timezone} onValueChange={(v) => setSettings((s) => ({ ...s, timezone: v }))}>
              <SelectTrigger className="border-2 bg-white" style={settingsCardBorderStyle}>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Idioma</Label>
            <Select
              value={settings.locale}
              onValueChange={(v) => setSettings((s) => ({ ...s, locale: v as SystemSettings['locale'] }))}
            >
              <SelectTrigger className="border-2 bg-white" style={settingsCardBorderStyle}>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {LOCALE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
