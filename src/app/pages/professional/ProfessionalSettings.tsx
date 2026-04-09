import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Settings,
  User,
  Clock,
  DollarSign,
  Plus,
  X,
  WalletCards,
  TimerReset,
  ListChecks,
  Camera,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { WelcomeCard } from '../../components/common';
import { DaySchedule, WeekSchedule } from '../../types';

const MAX_PROFESSIONAL_TITLE = 120;
const MAX_BIOGRAPHY = 600;
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export function ProfessionalSettings() {
  const { user, patchUser } = useAuth();
  const { professionals, updateProfessional } = useData();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const localAvatarBlobRef = useRef<string | null>(null);

  const professional = professionals.find((p) => p.id === user?.id);
  const tabTriggerClassName =
    'h-11 rounded-xl data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20 data-[state=active]:border-transparent data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)]';
  const primaryActionStyle = { background: 'linear-gradient(135deg, #FFA500, #FF8C00)' } as const;
  const fieldClassName =
    'border-2 bg-white/95 focus-visible:ring-2 focus-visible:ring-blue-500/25';
  const fieldStyle = { borderColor: 'rgba(255, 165, 0, 0.22)' } as const;

  const [profileHydrated, setProfileHydrated] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    cpf: '',
    cnpj: '',
    email: '',
    address: '',
    registrationNumber: '',
    specialty: '',
    professionalTitle: '',
    biography: '',
  });
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    setProfileHydrated(false);
  }, [user?.id]);

  useEffect(() => {
    if (!professional || profileHydrated) return;
    setProfileData({
      name: professional.name,
      phone: professional.phone,
      cpf: professional.cpf,
      cnpj: professional.cnpj ?? '',
      email: professional.email,
      address: professional.address,
      registrationNumber: professional.registrationNumber,
      specialty: professional.specialty,
      professionalTitle: professional.professionalTitle ?? '',
      biography: professional.biography ?? '',
    });
    setAvatarUrl(professional.avatar ?? '');
    setProfileHydrated(true);
  }, [professional, profileHydrated]);

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

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Envie uma imagem (JPG, PNG ou WebP).');
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      toast.error('A imagem deve ter no máximo 2 MB.');
      return;
    }
    if (localAvatarBlobRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(localAvatarBlobRef.current);
    }
    const url = URL.createObjectURL(file);
    localAvatarBlobRef.current = url;
    setAvatarUrl(url);
    toast.success('Foto atualizada na pré-visualização. Salve para confirmar.');
  };

  const handleClearAvatar = () => {
    if (localAvatarBlobRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(localAvatarBlobRef.current);
      localAvatarBlobRef.current = null;
    }
    setAvatarUrl('');
    toast.info('Foto removida na pré-visualização. Salve para confirmar.');
  };

  const handleSaveProfile = () => {
    if (!user || user.role !== 'professional') {
      toast.error('Faça login como profissional.');
      return;
    }
    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast.error('Preencha nome e e-mail.');
      return;
    }
    if (profileData.professionalTitle.length > MAX_PROFESSIONAL_TITLE) {
      toast.error(`Título: no máximo ${MAX_PROFESSIONAL_TITLE} caracteres.`);
      return;
    }
    if (profileData.biography.length > MAX_BIOGRAPHY) {
      toast.error(`Biografia: no máximo ${MAX_BIOGRAPHY} caracteres.`);
      return;
    }

    updateProfessional(user.id, {
      name: profileData.name.trim(),
      phone: profileData.phone.trim(),
      cpf: profileData.cpf.trim(),
      email: profileData.email.trim(),
      cnpj: profileData.cnpj.trim() || undefined,
      address: profileData.address.trim(),
      registrationNumber: profileData.registrationNumber.trim(),
      specialty: profileData.specialty.trim(),
      professionalTitle: profileData.professionalTitle.trim() || undefined,
      biography: profileData.biography.trim() || undefined,
      avatar: avatarUrl || undefined,
    });
    patchUser({
      name: profileData.name.trim(),
      phone: profileData.phone.trim(),
      email: profileData.email.trim(),
      avatar: avatarUrl || undefined,
    });
    toast.success('Perfil público e dados cadastrais salvos.');
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

  useEffect(() => {
    return () => {
      if (localAvatarBlobRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(localAvatarBlobRef.current);
      }
    };
  }, []);

  if (user?.role !== 'professional') {
    return (
      <div className="text-sm py-8" style={{ color: '#6B5D53' }}>
        Acesse como profissional para editar configurações.
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="text-sm py-8" style={{ color: '#6B5D53' }}>
        Perfil profissional não encontrado. Faça login novamente.
      </div>
    );
  }

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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card
              className="border-2 shadow-sm xl:col-span-2 overflow-hidden"
              style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
            >
              <CardHeader
                className="border-b space-y-1"
                style={{ borderColor: 'rgba(255, 165, 0, 0.15)', background: 'linear-gradient(135deg, #FFFBF5, #FFFFFF)' }}
              >
                <CardTitle style={{ color: '#4A3728' }}>Foto e apresentação</CardTitle>
                <CardDescription>
                  Estes itens aparecem na busca e na tela de agendamento do paciente. Use linguagem clara e objetiva (LGPD).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
                  <div className="flex flex-col items-center sm:items-start gap-3">
                    <div className="relative">
                      <Avatar className="size-28 border-4 shadow-md" style={{ borderColor: 'rgba(255, 165, 0, 0.35)' }}>
                        <AvatarImage src={avatarUrl || undefined} alt="" className="object-cover" />
                        <AvatarFallback
                          className="text-2xl font-semibold"
                          style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}
                        >
                          {profileData.name
                            ? profileData.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 3)
                            : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#4A3728] text-white shadow-md hover:bg-[#5c493a] transition-colors"
                        aria-label="Alterar foto"
                      >
                        <Camera className="size-4" />
                      </button>
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleAvatarFile}
                    />
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-2"
                        style={fieldStyle}
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Camera className="size-3.5 mr-1.5" />
                        Alterar foto
                      </Button>
                      {avatarUrl ? (
                        <Button type="button" variant="ghost" size="sm" className="text-red-600" onClick={handleClearAvatar}>
                          Remover foto
                        </Button>
                      ) : null}
                    </div>
                    <p className="text-[11px] max-w-[220px] text-center sm:text-left" style={{ color: '#6B5D53' }}>
                      JPG, PNG ou WebP · até 2 MB · proporção quadrada funciona melhor.
                    </p>
                  </div>

                  <div className="flex-1 space-y-4 w-full min-w-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="pro-title">Título profissional</Label>
                        <span className="text-[11px] tabular-nums" style={{ color: '#9CA3AF' }}>
                          {profileData.professionalTitle.length}/{MAX_PROFESSIONAL_TITLE}
                        </span>
                      </div>
                      <Input
                        id="pro-title"
                        placeholder="Ex.: Dra. · CRM 123456 · Subespecialidade ou credencial"
                        maxLength={MAX_PROFESSIONAL_TITLE}
                        value={profileData.professionalTitle}
                        onChange={(e) =>
                          setProfileData({ ...profileData, professionalTitle: e.target.value })
                        }
                        className={fieldClassName}
                        style={fieldStyle}
                      />
                      <p className="text-[11px]" style={{ color: '#6B5D53' }}>
                        Uma linha forte: quem você é e seu registro. Evite textos longos aqui — use a biografia abaixo.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="biography">Biografia para pacientes</Label>
                        <span className="text-[11px] tabular-nums" style={{ color: '#9CA3AF' }}>
                          {profileData.biography.length}/{MAX_BIOGRAPHY}
                        </span>
                      </div>
                      <Textarea
                        id="biography"
                        placeholder="Como você atua, experiência, linha de cuidado e o que o paciente pode esperar da consulta..."
                        maxLength={MAX_BIOGRAPHY}
                        rows={6}
                        value={profileData.biography}
                        onChange={(e) => setProfileData({ ...profileData, biography: e.target.value })}
                        className={`${fieldClassName} min-h-[140px] resize-y`}
                        style={fieldStyle}
                      />
                      <p className="text-[11px]" style={{ color: '#6B5D53' }}>
                        Texto exibido no perfil público. Não inclua dados clínicos de terceiros nem promessas de resultado.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-sm h-fit xl:sticky xl:top-24" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
              <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.12)' }}>
                <CardTitle className="text-base flex items-center gap-2" style={{ color: '#4A3728' }}>
                  <Sparkles className="size-4 text-[#FFA500]" />
                  Pré-visualização
                </CardTitle>
                <CardDescription>Assim pacientes costumam ver você na busca</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start gap-3 rounded-xl border p-3 bg-white" style={{ borderColor: 'rgba(255, 165, 0, 0.18)' }}>
                  <Avatar className="size-14 shrink-0 border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.3)' }}>
                    <AvatarImage src={avatarUrl || undefined} className="object-cover" />
                    <AvatarFallback
                      className="text-sm"
                      style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}
                    >
                      {profileData.name
                        ? profileData.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                        : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate" style={{ color: '#4A3728' }}>
                      {profileData.name.trim() || 'Seu nome'}
                    </p>
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#6B5D53' }}>
                      {profileData.professionalTitle.trim() || profileData.registrationNumber.trim() || 'Título ou registro'}
                    </p>
                    <Badge
                      className="mt-2 text-[10px] border-0"
                      style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}
                    >
                      {profileData.specialty.trim() || 'Especialidade'}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs leading-relaxed line-clamp-6" style={{ color: '#6B5D53' }}>
                  {profileData.biography.trim() ||
                    'Sua biografia aparecerá aqui para ajudar o paciente a escolher com confiança.'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 shadow-sm" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <CardHeader className="border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
              <CardTitle style={{ color: '#4A3728' }}>Dados cadastrais</CardTitle>
              <CardDescription>Informações administrativas e de contato</CardDescription>
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
                <Button type="button" onClick={handleSaveProfile} style={primaryActionStyle}>
                  Salvar perfil e apresentação
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
