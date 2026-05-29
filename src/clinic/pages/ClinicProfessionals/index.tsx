import React, { useState, useId, useEffect } from 'react';
import {
  UserPlus, Search, Phone, Mail, CalendarDays, ChevronRight,
  Stethoscope, MapPin, DollarSign, Heart, FileText,
  Pencil, Trash2, AlertTriangle, BadgeCheck,
} from 'lucide-react';
import { Card, CardContent } from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Label } from '../../../app/components/ui/label';
import { Textarea } from '../../../app/components/ui/textarea';
import { Switch } from '../../../app/components/ui/switch';
import { Avatar, AvatarFallback } from '../../../app/components/ui/avatar';
import { Separator } from '../../../app/components/ui/separator';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '../../../app/components/ui/sheet';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../../app/components/ui/alert-dialog';
import { useClinic } from '../../contexts/ClinicContext';
import type { ClinicProfessionalMock } from '../../mocks/clinicData';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ClinicProfessionalMock['status'],
  { label: string; color: string; bg: string }
> = {
  attending: { label: 'Em atendimento', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  available:  { label: 'Disponível',     color: '#3B82F6', bg: 'rgba(59,130,246,0.1)'  },
  absent:     { label: 'Ausente',        color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
  day_off:    { label: 'Folga',          color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

const ALL_SPECIALTIES = [
  'Cardiologia', 'Clínica Geral', 'Dermatologia', 'Endocrinologia',
  'Ginecologia', 'Neurologia', 'Oftalmologia', 'Ortopedia',
  'Pediatria', 'Psicologia', 'Psiquiatria', 'Urologia',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function fmtCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B5D53' }}>
      {children}
    </p>
  );
}

function InfoRow({
  icon: Icon, label, value,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value?: string | number }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ background: 'rgba(255,165,0,0.08)' }}>
        <Icon className="size-4 text-[#FFA500]" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: '#6B5D53' }}>{label}</p>
        <p className="text-sm mt-0.5 font-medium leading-snug" style={{ color: '#4A3728' }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Form types ───────────────────────────────────────────────────────────────

interface ProfForm {
  name: string;
  professionalTitle: string;
  specialty: string;
  registrationNumber: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  consultationPrice: string;
  acceptsInsurance: boolean;
  insurances: string;
  status: ClinicProfessionalMock['status'];
  biography: string;
}

const emptyForm: ProfForm = {
  name: '', professionalTitle: '', specialty: '', registrationNumber: '',
  cnpj: '', phone: '', email: '', address: '',
  consultationPrice: '', acceptsInsurance: false, insurances: '',
  status: 'available', biography: '',
};

function profToForm(p: ClinicProfessionalMock): ProfForm {
  return {
    name: p.name,
    professionalTitle: p.professionalTitle ?? '',
    specialty: p.specialty,
    registrationNumber: p.registrationNumber,
    cnpj: p.cnpj ?? '',
    phone: p.phone,
    email: p.email,
    address: p.address ?? '',
    consultationPrice: String(p.consultationPrice),
    acceptsInsurance: p.acceptsInsurance,
    insurances: p.insurances ?? '',
    status: p.status,
    biography: p.biography ?? '',
  };
}

// ─── ProfessionalFormSheet ────────────────────────────────────────────────────

interface ProfFormSheetProps {
  open: boolean;
  onClose: () => void;
  professional?: ClinicProfessionalMock;
  onSave: (values: ProfForm) => void;
}

function ProfessionalFormSheet({ open, onClose, professional, onSave }: ProfFormSheetProps) {
  const isEditing = !!professional;
  const [form, setForm] = useState<ProfForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfForm, string>>>({});
  const [specialtyOpen, setSpecialtyOpen] = useState(false);

  const nameId = useId(); const titleId = useId(); const regId = useId();
  const cnpjId = useId(); const phoneId = useId(); const emailId = useId();
  const addrId = useId(); const priceId = useId(); const insId = useId();

  useEffect(() => {
    if (open) {
      setForm(professional ? profToForm(professional) : emptyForm);
      setErrors({});
      setSpecialtyOpen(false);
    }
  }, [open, professional]);

  const set = <K extends keyof ProfForm>(k: K, v: ProfForm[K]) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim())               e.name               = 'Nome é obrigatório.';
    if (!form.specialty.trim())          e.specialty          = 'Especialidade é obrigatória.';
    if (!form.registrationNumber.trim()) e.registrationNumber = 'Registro é obrigatório.';
    if (!form.phone.trim())              e.phone              = 'Telefone é obrigatório.';
    if (!form.email.trim())              e.email              = 'E-mail é obrigatório.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
    onClose();
  };

  const fieldBorder = (k: keyof ProfForm): React.CSSProperties =>
    ({ borderColor: errors[k] ? '#EF4444' : 'rgba(255,165,0,0.25)' });

  const FieldError = ({ k }: { k: keyof ProfForm }) =>
    errors[k] ? (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
        <AlertTriangle className="size-3" />{errors[k]}
      </p>
    ) : null;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-[560px] flex flex-col p-0 gap-0">

        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b shrink-0" style={{ borderColor: 'rgba(255,165,0,0.15)' }}>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
              <Stethoscope className="size-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold" style={{ color: '#4A3728' }}>
                {isEditing ? `Editar — ${professional.name.split(' ').slice(0, 2).join(' ')}` : 'Adicionar Profissional'}
              </SheetTitle>
              <SheetDescription className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>
                {isEditing ? 'Atualize os dados do profissional.' : 'Preencha os dados para cadastrar o profissional.'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">

          {/* ── Identificação ── */}
          <div>
            <SectionLabel>Identificação</SectionLabel>
            <div className="space-y-4">

              {/* Nome */}
              <div className="space-y-1.5">
                <Label htmlFor={nameId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                  Nome completo <span className="text-red-500">*</span>
                </Label>
                <Input id={nameId} placeholder="ex.: Ana Silva"
                  value={form.name} onChange={(e) => set('name', e.target.value)}
                  className="border-2 h-11" style={fieldBorder('name')} />
                <FieldError k="name" />
              </div>

              {/* Título + Especialidade */}
              <div className="grid grid-cols-[140px_1fr] gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={titleId} className="text-sm font-medium" style={{ color: '#4A3728' }}>Título</Label>
                  <Input id={titleId} placeholder="Dr., Dra., PhD…"
                    value={form.professionalTitle} onChange={(e) => set('professionalTitle', e.target.value)}
                    className="border-2 h-11" style={{ borderColor: 'rgba(255,165,0,0.25)' }} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    Especialidade <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setSpecialtyOpen((v) => !v)}
                      className="w-full h-11 border-2 rounded-md px-3 text-left text-sm flex items-center justify-between transition-colors hover:bg-[#FFF8E7]"
                      style={fieldBorder('specialty')}
                    >
                      <span style={{ color: form.specialty ? '#4A3728' : '#9CA3AF' }}>
                        {form.specialty || 'Selecionar…'}
                      </span>
                      <ChevronRight className={`size-4 text-[#6B5D53] transition-transform ${specialtyOpen ? 'rotate-90' : ''}`} />
                    </button>
                    {specialtyOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setSpecialtyOpen(false)} aria-hidden />
                        <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-xl border-2 bg-white shadow-lg overflow-hidden"
                          style={{ borderColor: 'rgba(255,165,0,0.2)' }}>
                          <div className="max-h-48 overflow-y-auto py-1">
                            {ALL_SPECIALTIES.map((s) => (
                              <button key={s} type="button"
                                onClick={() => { set('specialty', s); setSpecialtyOpen(false); }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-[#FFF8E7] transition-colors"
                                style={{ color: form.specialty === s ? '#FFA500' : '#4A3728', fontWeight: form.specialty === s ? 600 : 400 }}
                              >{s}</button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <FieldError k="specialty" />
                </div>
              </div>

              {/* Registro + CNPJ */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={regId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    Nº de registro <span className="text-red-500">*</span>
                  </Label>
                  <Input id={regId} placeholder="CRM 000000/SP"
                    value={form.registrationNumber} onChange={(e) => set('registrationNumber', e.target.value)}
                    className="border-2 h-11" style={fieldBorder('registrationNumber')} />
                  <FieldError k="registrationNumber" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={cnpjId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    CNPJ <span className="text-xs font-normal" style={{ color: '#6B5D53' }}>(opcional)</span>
                  </Label>
                  <Input id={cnpjId} placeholder="00.000.000/0001-00"
                    value={form.cnpj} onChange={(e) => set('cnpj', e.target.value)}
                    className="border-2 h-11" style={{ borderColor: 'rgba(255,165,0,0.25)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Contato e localização ── */}
          <div>
            <SectionLabel>Contato e localização</SectionLabel>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={phoneId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    Telefone <span className="text-red-500">*</span>
                  </Label>
                  <Input id={phoneId} placeholder="(11) 99999-0000"
                    value={form.phone} onChange={(e) => set('phone', e.target.value)}
                    className="border-2 h-11" style={fieldBorder('phone')} />
                  <FieldError k="phone" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={emailId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    E-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input id={emailId} type="email" placeholder="nome@clinica.com"
                    value={form.email} onChange={(e) => set('email', e.target.value)}
                    className="border-2 h-11" style={fieldBorder('email')} />
                  <FieldError k="email" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={addrId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                  Endereço <span className="text-xs font-normal" style={{ color: '#6B5D53' }}>(opcional)</span>
                </Label>
                <Input id={addrId} placeholder="Av. Paulista, 1000 — São Paulo, SP"
                  value={form.address} onChange={(e) => set('address', e.target.value)}
                  className="border-2 h-11" style={{ borderColor: 'rgba(255,165,0,0.25)' }} />
              </div>
            </div>
          </div>

          {/* ── Prática clínica ── */}
          <div>
            <SectionLabel>Prática clínica</SectionLabel>
            <div className="space-y-4">

              {/* Preço */}
              <div className="space-y-1.5">
                <Label htmlFor={priceId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                  Preço da consulta (R$)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: '#6B5D53' }}>R$</span>
                  <Input id={priceId} type="number" min="0" placeholder="350,00"
                    value={form.consultationPrice} onChange={(e) => set('consultationPrice', e.target.value)}
                    className="border-2 h-11 pl-9" style={{ borderColor: 'rgba(255,165,0,0.25)' }} />
                </div>
              </div>

              {/* Aceita convênio */}
              <div className="flex items-center justify-between rounded-xl border-2 px-4 py-3.5"
                style={{ borderColor: 'rgba(255,165,0,0.2)', background: form.acceptsInsurance ? '#FFFDF9' : '#FAFAFA' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#4A3728' }}>Aceita convênio</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>
                    {form.acceptsInsurance ? 'Convênios aceitos visíveis no perfil.' : 'Atendimento particular apenas.'}
                  </p>
                </div>
                <Switch
                  checked={form.acceptsInsurance}
                  onCheckedChange={(v) => set('acceptsInsurance', v)}
                  className="data-[state=checked]:bg-[#FFA500]"
                />
              </div>

              {/* Convênios (condicional) */}
              {form.acceptsInsurance && (
                <div className="space-y-1.5">
                  <Label htmlFor={insId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    Convênios aceitos
                  </Label>
                  <Input id={insId} placeholder="ex.: Unimed, Bradesco Saúde, Amil"
                    value={form.insurances} onChange={(e) => set('insurances', e.target.value)}
                    className="border-2 h-11" style={{ borderColor: 'rgba(255,165,0,0.25)' }} />
                  <p className="text-[11px]" style={{ color: '#6B5D53' }}>Separe por vírgula.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Disponibilidade ── */}
          <div>
            <SectionLabel>Disponibilidade atual</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(STATUS_CONFIG) as [ClinicProfessionalMock['status'], typeof STATUS_CONFIG[ClinicProfessionalMock['status']]][]).map(([key, cfg]) => (
                <button key={key} type="button" onClick={() => set('status', key)}
                  className="flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-xs font-medium transition-all text-left"
                  style={
                    form.status === key
                      ? { background: cfg.bg, borderColor: cfg.color, color: cfg.color }
                      : { borderColor: 'rgba(74,55,40,0.12)', color: '#6B5D53', background: 'white' }
                  }
                >
                  <span className="size-2.5 rounded-full shrink-0 inline-block" style={{ background: cfg.color }} />
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Biografia ── */}
          <div>
            <SectionLabel>Biografia / Apresentação</SectionLabel>
            <Textarea placeholder="Breve apresentação exibida no perfil público do profissional…"
              value={form.biography} onChange={(e) => set('biography', e.target.value)}
              className="border-2 resize-none min-h-[96px]"
              style={{ borderColor: 'rgba(255,165,0,0.25)' }} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3 shrink-0" style={{ borderColor: 'rgba(255,165,0,0.15)' }}>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-2"
            style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} className="flex-1 border-0 text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
            {isEditing ? 'Atualizar' : 'Adicionar profissional'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── ProfessionalProfileSheet ─────────────────────────────────────────────────

interface ProfProfileSheetProps {
  open: boolean;
  onClose: () => void;
  professional: ClinicProfessionalMock | null;
  onEdit: () => void;
  onDelete: () => void;
}

function ProfessionalProfileSheet({ open, onClose, professional, onEdit, onDelete }: ProfProfileSheetProps) {
  if (!professional) return null;
  const sc = STATUS_CONFIG[professional.status];

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] flex flex-col p-0 gap-0">

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b shrink-0"
          style={{ borderColor: 'rgba(255,165,0,0.15)', background: 'linear-gradient(135deg, #FFFDF9, #FFF8E7)' }}>
          <SheetHeader className="p-0 text-left space-y-0">
            <SheetTitle className="sr-only">Perfil de {professional.name}</SheetTitle>
          </SheetHeader>

          <div className="flex items-start gap-4">
            <Avatar className="size-[72px] shrink-0 border-[3px]" style={{ borderColor: '#FFA500' }}>
              <AvatarFallback className="text-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
                {initials(professional.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-lg font-bold truncate" style={{ color: '#4A3728' }}>{professional.name}</p>
              <p className="text-sm" style={{ color: '#6B5D53' }}>{professional.specialty}</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>{professional.registrationNumber}</p>
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: sc.bg, color: sc.color }}>
                  <span className="size-1.5 rounded-full inline-block" style={{ background: sc.color }} />
                  {sc.label}
                </span>
                {professional.acceptsInsurance && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border"
                    style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#6B5D53', background: 'white' }}>
                    <Heart className="size-3 text-[#FFA500]" /> Aceita convênio
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Hoje', value: professional.todayAppointments },
              { label: 'Semana', value: professional.weekAppointments },
              { label: 'Consulta', value: fmtCurrency(professional.consultationPrice) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border text-center py-2.5"
                style={{ borderColor: 'rgba(255,165,0,0.18)', background: 'white' }}>
                <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: '#6B5D53' }}>{label}</p>
                <p className="font-bold text-sm mt-0.5" style={{ color: '#4A3728' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button type="button" onClick={onEdit} className="flex-1 gap-2 border-0 text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
              <Pencil className="size-4" /> Editar perfil
            </Button>
            <Button type="button" variant="outline" onClick={onDelete}
              className="border-2 gap-1.5 text-red-500 hover:bg-red-50 hover:border-red-200"
              style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
              <Trash2 className="size-4" /> Desligar
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Contato */}
          <div>
            <SectionLabel>Contato</SectionLabel>
            <div className="space-y-3">
              <InfoRow icon={Phone}  label="Telefone"  value={professional.phone} />
              <InfoRow icon={Mail}   label="E-mail"    value={professional.email} />
              <InfoRow icon={MapPin} label="Endereço"  value={professional.address} />
              <InfoRow icon={BadgeCheck} label="CNPJ"  value={professional.cnpj} />
            </div>
          </div>

          <Separator style={{ backgroundColor: 'rgba(74,55,40,0.08)' }} />

          {/* Prática */}
          <div>
            <SectionLabel>Prática clínica</SectionLabel>
            <div className="space-y-3">
              <InfoRow icon={DollarSign} label="Preço por consulta" value={fmtCurrency(professional.consultationPrice)} />
              <InfoRow icon={Heart} label="Convênios aceitos"
                value={professional.acceptsInsurance ? (professional.insurances || 'Aceita convênios') : 'Particular'} />
            </div>
          </div>

          {/* Biografia */}
          {professional.biography && (
            <>
              <Separator style={{ backgroundColor: 'rgba(74,55,40,0.08)' }} />
              <div>
                <SectionLabel>Biografia</SectionLabel>
                <div className="rounded-xl border px-4 py-3"
                  style={{ borderColor: 'rgba(255,165,0,0.18)', background: '#FFFDF9' }}>
                  <div className="flex gap-2">
                    <FileText className="size-4 shrink-0 mt-0.5 text-[#FFA500]" />
                    <p className="text-sm leading-relaxed" style={{ color: '#4A3728' }}>{professional.biography}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t shrink-0 flex gap-3"
          style={{ borderColor: 'rgba(255,165,0,0.15)' }}>
          <a href={`tel:${professional.phone}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-sm font-medium transition hover:bg-[#FFF8E7]"
            style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}>
            <Phone className="size-4" /> Ligar
          </a>
          <a href={`mailto:${professional.email}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-sm font-medium transition hover:bg-[#FFF8E7]"
            style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}>
            <Mail className="size-4" /> E-mail
          </a>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-2"
            style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}>
            Fechar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const SPECIALTY_FILTERS = ['Todos', ...ALL_SPECIALTIES];
type SheetMode = 'add' | 'edit' | 'profile' | null;

export function ClinicProfessionals() {
  const { professionals, addProfessional, updateProfessional, removeProfessional } = useClinic();

  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState<ClinicProfessionalMock['status'] | 'all'>('all');
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [selected, setSelected] = useState<ClinicProfessionalMock | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClinicProfessionalMock | null>(null);

  const openAdd     = () => { setSelected(null); setSheetMode('add'); };
  const openProfile = (p: ClinicProfessionalMock) => { setSelected(p); setSheetMode('profile'); };
  const openEdit    = () => setSheetMode('edit');
  const closeSheet  = () => setSheetMode(null);

  const filtered = professionals.filter((p) => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialtyFilter === 'Todos' || p.specialty === specialtyFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchSpecialty && matchStatus;
  });

  const handleSave = (values: ProfForm) => {
    const data = {
      name: values.name.trim(),
      professionalTitle: values.professionalTitle.trim() || undefined,
      specialty: values.specialty.trim(),
      registrationNumber: values.registrationNumber.trim(),
      cnpj: values.cnpj.trim() || undefined,
      phone: values.phone.trim(),
      email: values.email.trim(),
      address: values.address.trim() || undefined,
      consultationPrice: parseFloat(values.consultationPrice) || 0,
      acceptsInsurance: values.acceptsInsurance,
      insurances: values.insurances.trim() || undefined,
      status: values.status,
      biography: values.biography.trim() || undefined,
    };

    if (sheetMode === 'add') {
      addProfessional(data);
    } else if (sheetMode === 'edit' && selected) {
      updateProfessional(selected.id, data);
      setSelected((prev) => prev ? { ...prev, ...data } : prev);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      removeProfessional(deleteTarget.id);
      setDeleteTarget(null);
      closeSheet();
    }
  };

  return (
    <>
      <div className="space-y-6 pb-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#4A3728' }}>Profissionais</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B5D53' }}>
              {professionals.length} profissional{professionals.length !== 1 ? 'is' : ''} cadastrado{professionals.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={openAdd}
            style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}
            className="gap-2 border-0 shadow-md">
            <UserPlus className="size-4" /> Adicionar profissional
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6B5D53]" />
              <Input placeholder="Buscar por nome ou especialidade…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-2" style={{ borderColor: 'rgba(255,165,0,0.2)' }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_FILTERS.map((s) => (
                <button key={s} type="button" onClick={() => setSpecialtyFilter(s)}
                  className="rounded-full px-3 py-1 text-xs font-medium border-2 transition-all"
                  style={
                    specialtyFilter === s
                      ? { background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white', borderColor: 'transparent' }
                      : { borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728', background: 'white' }
                  }>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'attending', 'available', 'absent', 'day_off'] as const).map((s) => {
                const cfg = s === 'all' ? null : STATUS_CONFIG[s];
                return (
                  <button key={s} type="button" onClick={() => setStatusFilter(s)}
                    className="rounded-full px-3 py-1 text-xs font-medium border-2 transition-all flex items-center gap-1.5"
                    style={
                      statusFilter === s
                        ? { background: 'rgba(255,165,0,0.12)', borderColor: '#FFA500', color: '#4A3728' }
                        : { borderColor: 'rgba(74,55,40,0.12)', color: '#6B5D53', background: 'white' }
                    }>
                    {cfg && <span className="size-2 rounded-full shrink-0 inline-block" style={{ background: cfg.color }} />}
                    {s === 'all' ? 'Todos status' : cfg!.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: '#6B5D53' }}>Nenhum profissional encontrado com esses filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((prof) => {
              const sc = STATUS_CONFIG[prof.status];
              return (
                <Card key={prof.id}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    <Avatar className="size-16 border-2" style={{ borderColor: '#FFA500' }}>
                      <AvatarFallback className="text-lg font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
                        {initials(prof.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1 min-w-0 w-full">
                      <p className="font-semibold text-sm truncate" style={{ color: '#4A3728' }}>{prof.name}</p>
                      <p className="text-xs" style={{ color: '#6B5D53' }}>{prof.specialty}</p>
                      <p className="text-[11px]" style={{ color: '#6B5D53' }}>{prof.registrationNumber}</p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ background: sc.bg, color: sc.color }}>
                      <span className="size-1.5 rounded-full inline-block" style={{ background: sc.color }} />
                      {sc.label}
                    </span>

                    <div className="w-full grid grid-cols-2 gap-2 text-center pt-1 border-t"
                      style={{ borderColor: 'rgba(74,55,40,0.08)' }}>
                      <div>
                        <p className="text-[11px]" style={{ color: '#6B5D53' }}>Hoje</p>
                        <p className="font-bold text-sm" style={{ color: '#4A3728' }}>{prof.todayAppointments}</p>
                      </div>
                      <div>
                        <p className="text-[11px]" style={{ color: '#6B5D53' }}>Semana</p>
                        <p className="font-bold text-sm" style={{ color: '#4A3728' }}>{prof.weekAppointments}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <a href={`tel:${prof.phone}`}
                        className="flex-1 flex items-center justify-center rounded-lg border py-1.5 transition hover:bg-[#FFF8E7]"
                        style={{ borderColor: 'rgba(255,165,0,0.2)', color: '#6B5D53' }}>
                        <Phone className="size-3.5" />
                      </a>
                      <a href={`mailto:${prof.email}`}
                        className="flex-1 flex items-center justify-center rounded-lg border py-1.5 transition hover:bg-[#FFF8E7]"
                        style={{ borderColor: 'rgba(255,165,0,0.2)', color: '#6B5D53' }}>
                        <Mail className="size-3.5" />
                      </a>
                      <button type="button"
                        className="flex-1 flex items-center justify-center rounded-lg border py-1.5 transition hover:bg-[#FFF8E7]"
                        style={{ borderColor: 'rgba(255,165,0,0.2)', color: '#FFA500' }}
                        aria-label="Ver agenda">
                        <CalendarDays className="size-3.5" />
                      </button>
                    </div>

                    <button type="button" onClick={() => openProfile(prof)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
                      Ver perfil completo
                      <ChevronRight className="size-3.5" />
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add sheet */}
      <ProfessionalFormSheet
        open={sheetMode === 'add'}
        onClose={closeSheet}
        onSave={handleSave}
      />

      {/* Edit sheet */}
      <ProfessionalFormSheet
        open={sheetMode === 'edit'}
        onClose={() => setSheetMode('profile')}
        professional={selected ?? undefined}
        onSave={handleSave}
      />

      {/* Profile sheet */}
      <ProfessionalProfileSheet
        open={sheetMode === 'profile'}
        onClose={closeSheet}
        professional={selected}
        onEdit={openEdit}
        onDelete={() => setDeleteTarget(selected)}
      />

      {/* Delete dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#4A3728' }}>Desligar profissional?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: '#6B5D53' }}>
              <strong style={{ color: '#4A3728' }}>{deleteTarget?.name}</strong> será removido da clínica e desvinculado de todas as unidades. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}
              className="border-0 bg-red-500 hover:bg-red-600 text-white">
              Desligar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
