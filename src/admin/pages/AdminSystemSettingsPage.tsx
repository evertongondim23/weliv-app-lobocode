import React, { useMemo, useRef, useState } from "react";

import { RotateCcw, Save } from "lucide-react";

import { Button } from "../../app/components/ui/button";
import { Card, CardContent, CardDescription } from "../../app/components/ui/card";
import { Input } from "../../app/components/ui/input";
import { Label } from "../../app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../app/components/ui/select";
import { Separator } from "../../app/components/ui/separator";
import { Switch } from "../../app/components/ui/switch";
import { Textarea } from "../../app/components/ui/textarea";
import { PageHeader } from "../components/common/PageHeader";

type SystemSettings = {
  platformName: string;
  supportEmail: string;
  baseUrl: string;
  timezone: string;
  locale: "pt-BR" | "en-US";
  maintenanceMode: boolean;
  allowSameDayBooking: boolean;
  defaultCancellationWindowHours: number;
  notifyAdminOnNewUser: boolean;
  notifyAdminOnPaymentIssues: boolean;
  requireMfaForAdmins: boolean;
  auditRetentionDays: 30 | 90 | 180 | 365;
  publicStatusPageMessage: string;
};

const seedSettings: SystemSettings = {
  platformName: "Weliv",
  supportEmail: "suporte@weliv.com",
  baseUrl: "https://app.weliv.com",
  timezone: "America/Sao_Paulo",
  locale: "pt-BR",
  maintenanceMode: false,
  allowSameDayBooking: true,
  defaultCancellationWindowHours: 12,
  notifyAdminOnNewUser: true,
  notifyAdminOnPaymentIssues: true,
  requireMfaForAdmins: true,
  auditRetentionDays: 180,
  publicStatusPageMessage: "",
};

function clampInt(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

export function AdminSystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(seedSettings);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const initialRef = useRef<string>(JSON.stringify(seedSettings));
  const isDirty = JSON.stringify(settings) !== initialRef.current;

  const timezoneOptions = useMemo(
    () => [
      { value: "America/Sao_Paulo", label: "América/São Paulo" },
      { value: "America/Manaus", label: "América/Manaus" },
      { value: "America/Fortaleza", label: "América/Fortaleza" },
      { value: "UTC", label: "UTC" },
    ],
    [],
  );

  const retentionOptions: Array<{ value: SystemSettings["auditRetentionDays"]; label: string }> = [
    { value: 30, label: "30 dias" },
    { value: 90, label: "90 dias" },
    { value: 180, label: "180 dias" },
    { value: 365, label: "365 dias" },
  ];

  const save = () => {
    initialRef.current = JSON.stringify(settings);
    setLastSavedAt(new Date());
  };

  const reset = () => {
    const initial = JSON.parse(initialRef.current) as SystemSettings;
    setSettings(initial);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parâmetros do sistema"
        description="Configurações globais da plataforma e preferências de operação."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-2" style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}>
          <CardContent className="pt-6 space-y-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: "#4A3728" }}>
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
                  style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}
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
                  style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="baseUrl">URL base</Label>
                <Input
                  id="baseUrl"
                  value={settings.baseUrl}
                  onChange={(e) => setSettings((s) => ({ ...s, baseUrl: e.target.value }))}
                  className="border-2 bg-white"
                  style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}
                />
              </div>

              <div className="grid gap-2">
                <Label>Fuso horário</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(v) => setSettings((s) => ({ ...s, timezone: v }))}
                >
                  <SelectTrigger className="border-2 bg-white" style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {timezoneOptions.map((opt) => (
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
                  onValueChange={(v) => setSettings((s) => ({ ...s, locale: v as SystemSettings["locale"] }))}
                >
                  <SelectTrigger className="border-2 bg-white" style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}>
          <CardContent className="pt-6 space-y-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: "#4A3728" }}>
                Preferências de operação
              </div>
              <CardDescription>Regras padrão que impactam jornada e SLA.</CardDescription>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-start justify-between gap-4 rounded-xl border p-3 bg-white">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium" style={{ color: "#4A3728" }}>
                    Modo manutenção
                  </div>
                  <div className="text-xs" style={{ color: "#6B5D53" }}>
                    Bloqueia ações críticas e exibe aviso para usuários.
                  </div>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, maintenanceMode: v }))}
                />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-xl border p-3 bg-white">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium" style={{ color: "#4A3728" }}>
                    Permitir agendamento no mesmo dia
                  </div>
                  <div className="text-xs" style={{ color: "#6B5D53" }}>
                    Se desativado, oferta apenas para dias futuros.
                  </div>
                </div>
                <Switch
                  checked={settings.allowSameDayBooking}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, allowSameDayBooking: v }))}
                />
              </div>

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
                  style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}
                />
                <div className="text-xs" style={{ color: "#6B5D53" }}>
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
                  style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}
                />
                <div className="text-xs" style={{ color: "#6B5D53" }}>
                  Dica: use para avisos curtos (“Estamos em manutenção programada…”).
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}>
          <CardContent className="pt-6 space-y-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: "#4A3728" }}>
                Notificações e alertas
              </div>
              <CardDescription>O que a operação quer saber em tempo real.</CardDescription>
            </div>

            <Separator />

            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-4 rounded-xl border p-3 bg-white">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium" style={{ color: "#4A3728" }}>
                    Alertar admin em novo usuário
                  </div>
                  <div className="text-xs" style={{ color: "#6B5D53" }}>
                    Envia notificação quando um novo usuário é criado.
                  </div>
                </div>
                <Switch
                  checked={settings.notifyAdminOnNewUser}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, notifyAdminOnNewUser: v }))}
                />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-xl border p-3 bg-white">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium" style={{ color: "#4A3728" }}>
                    Alertar admin em problema de pagamento
                  </div>
                  <div className="text-xs" style={{ color: "#6B5D53" }}>
                    Notifica falhas, estornos e recorrência interrompida.
                  </div>
                </div>
                <Switch
                  checked={settings.notifyAdminOnPaymentIssues}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, notifyAdminOnPaymentIssues: v }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}>
          <CardContent className="pt-6 space-y-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: "#4A3728" }}>
                Segurança e auditoria
              </div>
              <CardDescription>Controles básicos para reduzir risco operacional.</CardDescription>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-start justify-between gap-4 rounded-xl border p-3 bg-white">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium" style={{ color: "#4A3728" }}>
                    Exigir MFA para administradores
                  </div>
                  <div className="text-xs" style={{ color: "#6B5D53" }}>
                    Recomendado para perfis com acesso a dados sensíveis.
                  </div>
                </div>
                <Switch
                  checked={settings.requireMfaForAdmins}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, requireMfaForAdmins: v }))}
                />
              </div>

              <div className="grid gap-2">
                <Label>Retenção de auditoria</Label>
                <Select
                  value={String(settings.auditRetentionDays)}
                  onValueChange={(v) =>
                    setSettings((s) => ({ ...s, auditRetentionDays: Number(v) as SystemSettings["auditRetentionDays"] }))
                  }
                >
                  <SelectTrigger className="border-2 bg-white" style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {retentionOptions.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs" style={{ color: "#6B5D53" }}>
                  Mantém logs e rastreabilidade para investigações e conformidade.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isDirty ? (
        <div className="sticky bottom-0 z-30">
          <div
            className="rounded-xl border-2 px-3 py-3 md:px-4 md:py-3 shadow-sm"
            style={{
              borderColor: "rgba(255, 165, 0, 0.25)",
              background: "#FFF8E7",
            }}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm font-medium" style={{ color: "#4A3728" }}>
                Você tem alterações não salvas.
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={reset} className="w-full md:w-auto">
                  <RotateCcw className="size-4" />
                  Descartar
                </Button>
                <Button
                  type="button"
                  onClick={save}
                  className="w-full md:w-auto"
                  style={{ background: "linear-gradient(135deg, #FFA500, #FF8C00)" }}
                >
                  <Save className="size-4" />
                  Salvar alterações
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs" style={{ color: "#6B5D53" }}>
          {lastSavedAt ? `Última atualização: ${lastSavedAt.toLocaleString("pt-BR")}` : "Nenhuma alteração pendente."}
        </div>
      )}
    </div>
  );
}

