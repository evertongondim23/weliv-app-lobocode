import { Camera, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { TabsContent } from '../../../../components/ui/tabs';
import { Textarea } from '../../../../components/ui/textarea';
import {
  CARD_BORDER_STYLE,
  FIELD_CLASS_NAME,
  FIELD_STYLE,
  MAX_BIOGRAPHY,
  MAX_PROFESSIONAL_TITLE,
  PRIMARY_ACTION_STYLE,
} from '../constants/professional-settings.constants';
import type { ProfileSectionProps } from '../types/professional-settings.types';

function getNameInitials(name: string, max: number) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, max);
}

export function ProfileSection({
  profileData,
  setProfileData,
  avatarUrl,
  avatarInputRef,
  onAvatarFile,
  onClearAvatar,
  onSaveProfile,
}: ProfileSectionProps) {
  return (
    <TabsContent value="profile" className="space-y-4 mt-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="border-2 shadow-sm xl:col-span-2 overflow-hidden" style={CARD_BORDER_STYLE}>
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
                      {getNameInitials(profileData.name, 3)}
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
                  onChange={onAvatarFile}
                />
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-2"
                    style={FIELD_STYLE}
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <Camera className="size-3.5 mr-1.5" />
                    Alterar foto
                  </Button>
                  {avatarUrl ? (
                    <Button type="button" variant="ghost" size="sm" className="text-red-600" onClick={onClearAvatar}>
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
                    onChange={(e) => setProfileData({ ...profileData, professionalTitle: e.target.value })}
                    className={FIELD_CLASS_NAME}
                    style={FIELD_STYLE}
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
                    className={`${FIELD_CLASS_NAME} min-h-[140px] resize-y`}
                    style={FIELD_STYLE}
                  />
                  <p className="text-[11px]" style={{ color: '#6B5D53' }}>
                    Texto exibido no perfil público. Não inclua dados clínicos de terceiros nem promessas de resultado.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm h-fit xl:sticky xl:top-24" style={CARD_BORDER_STYLE}>
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
                  {getNameInitials(profileData.name, 2)}
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

      <Card className="border-2 shadow-sm" style={CARD_BORDER_STYLE}>
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
                className={FIELD_CLASS_NAME}
                style={FIELD_STYLE}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className={FIELD_CLASS_NAME}
                style={FIELD_STYLE}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={profileData.cpf}
                onChange={(e) => setProfileData({ ...profileData, cpf: e.target.value })}
                className={FIELD_CLASS_NAME}
                style={FIELD_STYLE}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ (opcional)</Label>
              <Input
                id="cnpj"
                value={profileData.cnpj}
                onChange={(e) => setProfileData({ ...profileData, cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
                className={FIELD_CLASS_NAME}
                style={FIELD_STYLE}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className={FIELD_CLASS_NAME}
                style={FIELD_STYLE}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço Completo *</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                className={FIELD_CLASS_NAME}
                style={FIELD_STYLE}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration">Registro Profissional *</Label>
              <Input
                id="registration"
                placeholder="Ex: CRM 123456"
                value={profileData.registrationNumber}
                onChange={(e) => setProfileData({ ...profileData, registrationNumber: e.target.value })}
                className={FIELD_CLASS_NAME}
                style={FIELD_STYLE}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade *</Label>
              <Input
                id="specialty"
                value={profileData.specialty}
                onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                className={FIELD_CLASS_NAME}
                style={FIELD_STYLE}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" onClick={onSaveProfile} style={PRIMARY_ACTION_STYLE}>
              Salvar perfil e apresentação
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
