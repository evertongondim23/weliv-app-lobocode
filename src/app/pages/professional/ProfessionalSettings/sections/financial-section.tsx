import { ListChecks, Plus, TimerReset, WalletCards, X } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Switch } from '../../../../components/ui/switch';
import { TabsContent } from '../../../../components/ui/tabs';
import {
  CARD_BORDER_STYLE,
  FIELD_CLASS_NAME,
  FIELD_STYLE,
  PRIMARY_ACTION_STYLE,
} from '../constants/professional-settings.constants';
import type { DepositPercentage, FinancialSectionProps } from '../types/professional-settings.types';

export function FinancialSection({
  consultationPrice,
  setConsultationPrice,
  acceptsInsurance,
  setAcceptsInsurance,
  insurances,
  newInsurance,
  setNewInsurance,
  remarcationEnabled,
  setRemarcationEnabled,
  remarcationLimit,
  setRemarcationLimit,
  depositPercentage,
  setDepositPercentage,
  waitingListEnabled,
  setWaitingListEnabled,
  onAddInsurance,
  onRemoveInsurance,
  onSaveFinancial,
}: FinancialSectionProps) {
  return (
    <TabsContent value="financial" className="space-y-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border shadow-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide flex items-center gap-2" style={{ color: '#6B5D53' }}>
              <WalletCards className="size-3.5" />
              Depósito
            </p>
            <p className="text-xl font-bold" style={{ color: '#4A3728' }}>
              {depositPercentage === '0' ? 'Sem entrada' : `${depositPercentage}%`}
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide flex items-center gap-2" style={{ color: '#6B5D53' }}>
              <TimerReset className="size-3.5" />
              Remarcação
            </p>
            <p className="text-xl font-bold" style={{ color: '#4A3728' }}>
              {remarcationEnabled ? (remarcationLimit === '999' ? 'Ilimitada' : `${remarcationLimit}x`) : 'Bloqueada'}
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
          <CardContent className="pt-6 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide flex items-center gap-2" style={{ color: '#6B5D53' }}>
              <ListChecks className="size-3.5" />
              Convênios
            </p>
            <p className="text-xl font-bold" style={{ color: '#4A3728' }}>
              {acceptsInsurance ? insurances.length : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-sm" style={CARD_BORDER_STYLE}>
        <CardHeader className="border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
          <CardTitle style={{ color: '#4A3728' }}>Valores de Consulta</CardTitle>
          <CardDescription>Configure os preços e formas de pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="price">Valor da Consulta (R$) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={consultationPrice}
              onChange={(e) => setConsultationPrice(e.target.value)}
              className={FIELD_CLASS_NAME}
              style={FIELD_STYLE}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="insurance">Aceita Convênios</Label>
                <p className="text-sm text-muted-foreground">Permite que pacientes agendem com planos de saúde</p>
              </div>
              <Switch id="insurance" checked={acceptsInsurance} onCheckedChange={setAcceptsInsurance} />
            </div>

            {acceptsInsurance && (
              <div className="space-y-3 p-4 rounded-xl border bg-[#FFFDF9]" style={{ borderColor: 'rgba(255,165,0,0.15)' }}>
                <Label>Convênios Aceitos</Label>
                <div className="flex flex-wrap gap-2">
                  {insurances.map((insurance, index) => (
                    <Badge key={index} variant="secondary" className="gap-2 pl-3 pr-2 py-1">
                      {insurance}
                      <button onClick={() => onRemoveInsurance(index)} className="hover:text-red-600">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do convênio"
                    value={newInsurance}
                    onChange={(e) => setNewInsurance(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onAddInsurance()}
                    className={FIELD_CLASS_NAME}
                    style={FIELD_STYLE}
                  />
                  <Button
                    onClick={onAddInsurance}
                    variant="outline"
                    className="border-2"
                    style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-sm" style={CARD_BORDER_STYLE}>
        <CardHeader className="border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
          <CardTitle style={{ color: '#4A3728' }}>Regras de Agendamento</CardTitle>
          <CardDescription>Configure as políticas de remarcação e depósitos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="remarcation">Permitir Remarcação</Label>
              <p className="text-sm text-muted-foreground">Pacientes podem remarcar suas consultas</p>
            </div>
            <Switch id="remarcation" checked={remarcationEnabled} onCheckedChange={setRemarcationEnabled} />
          </div>

          {remarcationEnabled && (
            <div className="space-y-2">
              <Label htmlFor="remarcationLimit">Limite de Remarcações</Label>
              <Select value={remarcationLimit} onValueChange={setRemarcationLimit}>
                <SelectTrigger className={FIELD_CLASS_NAME} style={FIELD_STYLE}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 remarcação</SelectItem>
                  <SelectItem value="2">2 remarcações</SelectItem>
                  <SelectItem value="3">3 remarcações</SelectItem>
                  <SelectItem value="5">5 remarcações</SelectItem>
                  <SelectItem value="999">Ilimitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="deposit">Exigir Depósito no Agendamento</Label>
            <Select
              value={depositPercentage}
              onValueChange={(val: DepositPercentage) => setDepositPercentage(val)}
            >
              <SelectTrigger className={FIELD_CLASS_NAME} style={FIELD_STYLE}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não exigir depósito</SelectItem>
                <SelectItem value="10">10% do valor</SelectItem>
                <SelectItem value="30">30% do valor</SelectItem>
                <SelectItem value="100">100% do valor (pagamento integral)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="waitingList">Ativar Fila de Espera</Label>
              <p className="text-sm text-muted-foreground">Pacientes podem entrar na fila quando não há horários</p>
            </div>
            <Switch id="waitingList" checked={waitingListEnabled} onCheckedChange={setWaitingListEnabled} />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onSaveFinancial} style={PRIMARY_ACTION_STYLE}>
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
