import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Settings, User, Clock, DollarSign, Plus, X, WalletCards, TimerReset, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { WelcomeCard } from '../../components/common';
import { DaySchedule, WeekSchedule } from '../../types';

export function ProfessionalSettings() {
  const { user } = useAuth();
  const tabTriggerClassName =
    'h-11 rounded-xl data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20 data-[state=active]:border-transparent data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)]';
  const primaryActionStyle = { background: 'linear-gradient(135deg, #FFA500, #FF8C00)' } as const;
  const fieldClassName =
    'border-2 bg-white/95 focus-visible:ring-2 focus-visible:ring-blue-500/25';
  const fieldStyle = { borderColor: 'rgba(255, 165, 0, 0.22)' } as const;

  // Dados do Perfil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
    cnpj: '',
    email: user?.email || '',
    address: 'Av. Paulista, 1578 - São Paulo, SP',
    registrationNumber: 'CRM 123456',
    specialty: 'Cardiologia',
  });

  // Valores e Convênios
  const [consultationPrice, setConsultationPrice] = useState('250.00');
  const [acceptsInsurance, setAcceptsInsurance] = useState(true);
  const [insurances, setInsurances] = useState(['Unimed', 'Bradesco Saúde', 'Amil']);
  const [newInsurance, setNewInsurance] = useState('');

  // Configurações de Agendamento
  const [remarcationEnabled, setRemarcationEnabled] = useState(true);
  const [remarcationLimit, setRemarcationLimit] = useState('3');
  const [depositPercentage, setDepositPercentage] = useState<'0' | '10' | '30' | '100'>('30');
  const [waitingListEnabled, setWaitingListEnabled] = useState(true);

  // Horários Disponíveis
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    tuesday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    wednesday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    thursday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    friday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    saturday: { enabled: false, start: '08:00', end: '12:00' },
    sunday: { enabled: false, start: '08:00', end: '12:00' },
  });

  const dayNames: Record<string, string> = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const handleSaveProfile = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleSaveFinancial = () => {
    toast.success('Configurações financeiras atualizadas!');
  };

  const handleSaveSchedule = () => {
    toast.success('Horários atualizados com sucesso!');
  };

  const handleAddInsurance = () => {
    if (newInsurance.trim()) {
      setInsurances([...insurances, newInsurance.trim()]);
      setNewInsurance('');
      toast.success('Convênio adicionado');
    }
  };

  const handleRemoveInsurance = (index: number) => {
    setInsurances(insurances.filter((_, i) => i !== index));
    toast.success('Convênio removido');
  };

  const updateSchedule = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }));
  };

  return (
    <div className="space-y-6 pb-6 max-w-6xl mx-auto">
      {/* Header */}
      <WelcomeCard
        icon={Settings}
        title="Configurações"
        subtitle="Gerencie seu perfil e preferências"
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList
          className="grid w-full grid-cols-3 h-auto p-1.5 rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
        >
          <TabsTrigger
            value="profile"
            className={tabTriggerClassName}
          >
            <User className="size-4 mr-2" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            className={tabTriggerClassName}
          >
            <DollarSign className="size-4 mr-2" />
            <span>Valores</span>
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className={tabTriggerClassName}
          >
            <Clock className="size-4 mr-2" />
            <span>Horários</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Perfil */}
        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card className="border-2 shadow-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardHeader className="border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
              <CardTitle style={{ color: '#4A3728' }}>Dados Profissionais</CardTitle>
              <CardDescription>Informações do seu cadastro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={profileData.cpf}
                    onChange={(e) => setProfileData({ ...profileData, cpf: e.target.value })}
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                  <Input
                    id="cnpj"
                    value={profileData.cnpj}
                    onChange={(e) => setProfileData({ ...profileData, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço Completo *</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration">Registro Profissional *</Label>
                  <Input
                    id="registration"
                    placeholder="Ex: CRM 123456"
                    value={profileData.registrationNumber}
                    onChange={(e) => setProfileData({ ...profileData, registrationNumber: e.target.value })}
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade *</Label>
                  <Input
                    id="specialty"
                    value={profileData.specialty}
                    onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                    className={fieldClassName}
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveProfile}
                  style={primaryActionStyle}
                >
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Valores e Convênios */}
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

          <Card className="border-2 shadow-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
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
                  className={fieldClassName}
                  style={fieldStyle}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="insurance">Aceita Convênios</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que pacientes agendem com planos de saúde
                    </p>
                  </div>
                  <Switch
                    id="insurance"
                    checked={acceptsInsurance}
                    onCheckedChange={setAcceptsInsurance}
                  />
                </div>

                {acceptsInsurance && (
                  <div className="space-y-3 p-4 rounded-xl border bg-[#FFFDF9]" style={{ borderColor: 'rgba(255,165,0,0.15)' }}>
                    <Label>Convênios Aceitos</Label>
                    <div className="flex flex-wrap gap-2">
                      {insurances.map((insurance, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="gap-2 pl-3 pr-2 py-1"
                        >
                          {insurance}
                          <button
                            onClick={() => handleRemoveInsurance(index)}
                            className="hover:text-red-600"
                          >
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
                        onKeyDown={(e) => e.key === 'Enter' && handleAddInsurance()}
                        className={fieldClassName}
                        style={fieldStyle}
                      />
                      <Button
                        onClick={handleAddInsurance}
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

          <Card className="border-2 shadow-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardHeader className="border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
              <CardTitle style={{ color: '#4A3728' }}>Regras de Agendamento</CardTitle>
              <CardDescription>Configure as políticas de remarcação e depósitos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="remarcation">Permitir Remarcação</Label>
                  <p className="text-sm text-muted-foreground">
                    Pacientes podem remarcar suas consultas
                  </p>
                </div>
                <Switch
                  id="remarcation"
                  checked={remarcationEnabled}
                  onCheckedChange={setRemarcationEnabled}
                />
              </div>

              {remarcationEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="remarcationLimit">Limite de Remarcações</Label>
                  <Select value={remarcationLimit} onValueChange={setRemarcationLimit}>
                    <SelectTrigger className={fieldClassName} style={fieldStyle}>
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
                  onValueChange={(val: '0' | '10' | '30' | '100') => setDepositPercentage(val)}
                >
                  <SelectTrigger className={fieldClassName} style={fieldStyle}>
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
                  <p className="text-sm text-muted-foreground">
                    Pacientes podem entrar na fila quando não há horários
                  </p>
                </div>
                <Switch
                  id="waitingList"
                  checked={waitingListEnabled}
                  onCheckedChange={setWaitingListEnabled}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveFinancial}
                  style={primaryActionStyle}
                >
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Horários */}
        <TabsContent value="schedule" className="space-y-4 mt-6">
          <Card className="border-2 shadow-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardHeader className="border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
              <CardTitle style={{ color: '#4A3728' }}>Horários de Atendimento</CardTitle>
              <CardDescription>Configure sua agenda semanal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {Object.entries(schedule).map(([day, daySchedule]) => (
                <div
                  key={day}
                  className="p-4 rounded-xl border-2 space-y-3 bg-white/80"
                  style={{ borderColor: daySchedule.enabled ? 'rgba(255, 165, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-base" style={{ color: '#4A3728' }}>
                      {dayNames[day]}
                    </Label>
                    <Switch
                      checked={daySchedule.enabled}
                      onCheckedChange={(enabled) => updateSchedule(day, { enabled })}
                    />
                  </div>

                  {daySchedule.enabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm">Início</Label>
                        <Input
                          type="time"
                          value={daySchedule.start}
                          onChange={(e) => updateSchedule(day, { start: e.target.value })}
                          className={fieldClassName}
                          style={fieldStyle}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Término</Label>
                        <Input
                          type="time"
                          value={daySchedule.end}
                          onChange={(e) => updateSchedule(day, { end: e.target.value })}
                          className={fieldClassName}
                          style={fieldStyle}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Início Almoço (opcional)</Label>
                        <Input
                          type="time"
                          value={daySchedule.lunchStart || ''}
                          onChange={(e) => updateSchedule(day, { lunchStart: e.target.value })}
                          placeholder="Ex: 12:00"
                          className={fieldClassName}
                          style={fieldStyle}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Fim Almoço (opcional)</Label>
                        <Input
                          type="time"
                          value={daySchedule.lunchEnd || ''}
                          onChange={(e) => updateSchedule(day, { lunchEnd: e.target.value })}
                          placeholder="Ex: 13:00"
                          className={fieldClassName}
                          style={fieldStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveSchedule}
                  style={primaryActionStyle}
                >
                  Salvar Horários
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
