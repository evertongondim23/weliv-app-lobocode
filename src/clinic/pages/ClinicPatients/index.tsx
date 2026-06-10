import React, { useState, useId, useEffect } from 'react';
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  Heart,
  Stethoscope,
  CalendarDays,
  FileText,
  Pencil,
  Trash2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Label } from '../../../app/components/ui/label';
import { Avatar, AvatarFallback } from '../../../app/components/ui/avatar';
import { Textarea } from '../../../app/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../../../app/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../app/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../app/components/ui/select';
import { useClinic } from '../../contexts/ClinicContext';
import type { ClinicPatientMock } from '../../mocks/clinicData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const STATUS_CONFIG: Record<
  ClinicPatientMock['status'],
  { label: string; color: string; bg: string }
> = {
  active:           { label: 'Ativo',   color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  inactive:         { label: 'Inativo', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  needs_attention:  { label: 'Atenção', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
};

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('pt-BR').format(new Date(iso));
}

// ─── Form types ───────────────────────────────────────────────────────────────

interface PatientFormValues {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  birthDate: string;
  healthPlan: string;
  primaryProfessionalId: string;
  status: ClinicPatientMock['status'];
  notes: string;
}

const emptyForm: PatientFormValues = {
  name: '', cpf: '', phone: '', email: '',
  birthDate: '', healthPlan: '',
  primaryProfessionalId: '', status: 'active', notes: '',
};

function patientToForm(p: ClinicPatientMock): PatientFormValues {
  return {
    name: p.name,
    cpf: p.cpf,
    phone: p.phone,
    email: p.email,
    birthDate: p.birthDate ?? '',
    healthPlan: p.healthPlan ?? '',
    primaryProfessionalId: p.primaryProfessionalId ?? '',
    status: p.status,
    notes: p.notes ?? '',
  };
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest mb-3 mt-1" style={{ color: '#6B5D53' }}>
      {children}
    </p>
  );
}

// ─── PatientFormSheet ─────────────────────────────────────────────────────────

interface PatientFormSheetProps {
  open: boolean;
  onClose: () => void;
  patient?: ClinicPatientMock;
  onSave: (values: PatientFormValues) => void;
}

function PatientFormSheet({ open, onClose, patient, onSave }: PatientFormSheetProps) {
  const { professionals } = useClinic();
  const isEditing = !!patient;

  const nameId = useId();
  const cpfId = useId();
  const phoneId = useId();
  const emailId = useId();
  const bdId = useId();
  const planId = useId();

  const [form, setForm] = useState<PatientFormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof PatientFormValues, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(patient ? patientToForm(patient) : emptyForm);
      setErrors({});
    }
  }, [open, patient]);

  const set = <K extends keyof PatientFormValues>(k: K, v: PatientFormValues[K]) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim())  e.name  = 'Nome é obrigatório.';
    if (!form.cpf.trim())   e.cpf   = 'CPF é obrigatório.';
    if (!form.phone.trim()) e.phone = 'Telefone é obrigatório.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
    onClose();
  };

  const inputCls = (field: keyof PatientFormValues) =>
    `border-2 h-11 ${errors[field] ? 'border-red-400 focus-visible:ring-red-300' : ''}`;
  const inputStyle = (field: keyof PatientFormValues) =>
    ({ borderColor: errors[field] ? '#EF4444' : 'rgba(255,165,0,0.25)' } as React.CSSProperties);

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] flex flex-col p-0 gap-0">

        {/* ── Header ── */}
        <SheetHeader className="px-6 py-5 border-b shrink-0" style={{ borderColor: 'rgba(255,165,0,0.15)' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
            >
              <UserPlus className="size-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold" style={{ color: '#4A3728' }}>
                {isEditing ? `Editar — ${patient.name.split(' ')[0]}` : 'Novo Paciente'}
              </SheetTitle>
              <SheetDescription className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>
                {isEditing ? 'Atualize os dados do paciente.' : 'Preencha os dados para cadastrar o paciente.'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Dados pessoais */}
          <div>
            <SectionLabel>Dados pessoais</SectionLabel>
            <div className="space-y-4">

              {/* Nome */}
              <div className="space-y-1.5">
                <Label htmlFor={nameId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                  Nome completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={nameId}
                  placeholder="ex.: Maria da Silva"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={inputCls('name')}
                  style={inputStyle('name')}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="size-3" />{errors.name}
                  </p>
                )}
              </div>

              {/* CPF + Data nascimento */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={cpfId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    CPF <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={cpfId}
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={(e) => set('cpf', e.target.value)}
                    className={inputCls('cpf')}
                    style={inputStyle('cpf')}
                  />
                  {errors.cpf && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="size-3" />{errors.cpf}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={bdId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    Nascimento
                  </Label>
                  <Input
                    id={bdId}
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => set('birthDate', e.target.value)}
                    className="border-2 h-11"
                    style={{ borderColor: 'rgba(255,165,0,0.25)' }}
                  />
                </div>
              </div>

              {/* Telefone + E-mail */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={phoneId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    Telefone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={phoneId}
                    placeholder="(11) 99999-0000"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className={inputCls('phone')}
                    style={inputStyle('phone')}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="size-3" />{errors.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={emailId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                    E-mail
                  </Label>
                  <Input
                    id={emailId}
                    type="email"
                    placeholder="ex.: maria@email.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    className="border-2 h-11"
                    style={{ borderColor: 'rgba(255,165,0,0.25)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Plano e vínculo */}
          <div>
            <SectionLabel>Plano e vínculo clínico</SectionLabel>
            <div className="space-y-4">

              {/* Convênio */}
              <div className="space-y-1.5">
                <Label htmlFor={planId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
                  Convênio / Plano de saúde
                </Label>
                <Input
                  id={planId}
                  placeholder="ex.: Unimed, Bradesco Saúde, Particular…"
                  value={form.healthPlan}
                  onChange={(e) => set('healthPlan', e.target.value)}
                  className="border-2 h-11"
                  style={{ borderColor: 'rgba(255,165,0,0.25)' }}
                />
              </div>

              {/* Profissional responsável */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium" style={{ color: '#4A3728' }}>
                  Profissional responsável
                </Label>
                <Select
                  value={form.primaryProfessionalId || '_none'}
                  onValueChange={(v) => set('primaryProfessionalId', v === '_none' ? '' : v)}
                >
                  <SelectTrigger
                    className="h-11 border-2"
                    style={{ borderColor: 'rgba(255,165,0,0.25)' }}
                  >
                    <SelectValue placeholder="Selecionar profissional…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Nenhum</SelectItem>
                    {professionals.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {p.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium" style={{ color: '#4A3728' }}>Status</Label>
                <div className="flex gap-2">
                  {(Object.entries(STATUS_CONFIG) as [ClinicPatientMock['status'], typeof STATUS_CONFIG[ClinicPatientMock['status']]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => set('status', key)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 py-2 text-xs font-medium transition-all"
                      style={
                        form.status === key
                          ? { background: cfg.bg, borderColor: cfg.color, color: cfg.color }
                          : { borderColor: 'rgba(74,55,40,0.12)', color: '#6B5D53', background: 'white' }
                      }
                    >
                      <span className="size-2 rounded-full shrink-0 inline-block" style={{ background: cfg.color }} />
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <SectionLabel>Observações</SectionLabel>
            <Textarea
              placeholder="Anotações clínicas, alergias conhecidas, histórico relevante…"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className="border-2 resize-none min-h-[96px]"
              style={{ borderColor: 'rgba(255,165,0,0.25)' }}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t flex gap-3 shrink-0" style={{ borderColor: 'rgba(255,165,0,0.15)' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 border-2"
            style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="flex-1 border-0 text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
          >
            {isEditing ? 'Atualizar' : 'Cadastrar paciente'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── PatientDetailSheet ───────────────────────────────────────────────────────

interface PatientDetailSheetProps {
  open: boolean;
  onClose: () => void;
  patient: ClinicPatientMock | null;
  onEdit: () => void;
  onDelete: () => void;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
        style={{ background: 'rgba(255,165,0,0.08)' }}
      >
        <Icon className="size-4 text-[#FFA500]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: '#6B5D53' }}>{label}</p>
        <p className="text-sm mt-0.5 font-medium" style={{ color: '#4A3728' }}>{value}</p>
      </div>
    </div>
  );
}

function PatientDetailSheet({ open, onClose, patient, onEdit, onDelete }: PatientDetailSheetProps) {
  const { professionals } = useClinic();

  if (!patient) return null;

  const sc = STATUS_CONFIG[patient.status];
  const prof = professionals.find((p) => p.id === patient.primaryProfessionalId);

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-[500px] flex flex-col p-0 gap-0">

        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-5 border-b shrink-0" style={{ borderColor: 'rgba(255,165,0,0.15)', background: 'linear-gradient(135deg, #FFFDF9, #FFF8E7)' }}>
          <SheetHeader className="p-0 text-left space-y-0">
            <SheetTitle className="sr-only">Detalhes do paciente {patient.name}</SheetTitle>
          </SheetHeader>
          <div className="flex items-start gap-4">
            <Avatar className="size-16 shrink-0 border-2" style={{ borderColor: '#FFA500' }}>
              <AvatarFallback
                className="text-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
              >
                {initials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-lg font-bold truncate" style={{ color: '#4A3728' }}>{patient.name}</p>
              <p className="text-sm mt-0.5" style={{ color: '#6B5D53' }}>{patient.cpf}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  <span className="size-1.5 rounded-full inline-block" style={{ background: sc.color }} />
                  {sc.label}
                </span>
                {patient.healthPlan && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border"
                    style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#6B5D53', background: 'white' }}
                  >
                    <Heart className="size-3 text-[#FFA500]" />
                    {patient.healthPlan}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-5">
            <Button
              type="button"
              onClick={onEdit}
              className="flex-1 gap-2 border-0 text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
            >
              <Pencil className="size-4" />
              Editar dados
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onDelete}
              className="border-2 gap-1.5 text-red-500 hover:bg-red-50 hover:border-red-200"
              style={{ borderColor: 'rgba(239,68,68,0.3)' }}
            >
              <Trash2 className="size-4" />
              Excluir
            </Button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Contato */}
          <div>
            <SectionLabel>Contato</SectionLabel>
            <div className="space-y-3">
              <InfoRow icon={Phone} label="Telefone" value={patient.phone} />
              <InfoRow icon={Mail} label="E-mail" value={patient.email || undefined} />
              <InfoRow icon={CalendarDays} label="Data de nascimento" value={patient.birthDate ? formatDate(patient.birthDate) : undefined} />
            </div>
          </div>

          {/* Vínculo clínico */}
          <div>
            <SectionLabel>Vínculo clínico</SectionLabel>
            <div className="space-y-3">
              <InfoRow icon={Heart} label="Convênio / Plano" value={patient.healthPlan} />
              <InfoRow icon={Stethoscope} label="Profissional responsável" value={prof?.name ?? patient.primaryProfessionalName} />
              <InfoRow icon={CalendarDays} label="Última visita" value={patient.lastVisit ? formatDate(patient.lastVisit) : undefined} />
            </div>
          </div>

          {/* Observações */}
          {patient.notes && (
            <div>
              <SectionLabel>Observações</SectionLabel>
              <div
                className="rounded-xl border px-4 py-3"
                style={{ borderColor: 'rgba(255,165,0,0.18)', background: '#FFFDF9' }}
              >
                <div className="flex gap-2">
                  <FileText className="size-4 shrink-0 mt-0.5 text-[#FFA500]" />
                  <p className="text-sm leading-relaxed" style={{ color: '#4A3728' }}>{patient.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty state if no extra info */}
          {!patient.phone && !patient.email && !patient.healthPlan && !patient.notes && (
            <p className="text-sm text-center py-4" style={{ color: '#6B5D53' }}>
              Nenhuma informação adicional cadastrada.
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t shrink-0" style={{ borderColor: 'rgba(255,165,0,0.15)' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full border-2"
            style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}
          >
            Fechar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type SheetMode = 'add' | 'edit' | 'detail' | null;

export function ClinicPatients() {
  const { patients, addPatient, updatePatient, removePatient } = useClinic();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClinicPatientMock['status'] | 'all'>('all');
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [selected, setSelected] = useState<ClinicPatientMock | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClinicPatientMock | null>(null);

  const openAdd    = () => { setSelected(null); setSheetMode('add'); };
  const openDetail = (p: ClinicPatientMock) => { setSelected(p); setSheetMode('detail'); };
  const openEdit   = () => setSheetMode('edit');
  const closeSheet = () => { setSheetMode(null); };

  const filtered = patients.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.includes(search) ||
      p.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSave = (values: PatientFormValues) => {
    const prof = undefined; // would come from professionals list
    const data: Omit<ClinicPatientMock, 'id'> = {
      name: values.name.trim(),
      cpf: values.cpf.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      birthDate: values.birthDate || undefined,
      healthPlan: values.healthPlan.trim() || undefined,
      primaryProfessionalId: values.primaryProfessionalId || undefined,
      status: values.status,
      notes: values.notes.trim() || undefined,
    };

    if (sheetMode === 'add') {
      addPatient(data);
    } else if (sheetMode === 'edit' && selected) {
      updatePatient(selected.id, data);
      setSelected((prev) => prev ? { ...prev, ...data } : prev);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      removePatient(deleteTarget.id);
      setDeleteTarget(null);
      closeSheet();
    }
  };

  return (
    <>
      <div className="space-y-6 pb-6">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#4A3728' }}>Pacientes</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B5D53' }}>
              {patients.length} paciente{patients.length !== 1 ? 's' : ''} cadastrado{patients.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={openAdd}
            style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}
            className="gap-2 border-0 shadow-md"
          >
            <UserPlus className="size-4" />
            Novo paciente
          </Button>
        </div>

        {/* ── Filters ── */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6B5D53]" />
              <Input
                placeholder="Buscar por nome, CPF ou e-mail…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-2"
                style={{ borderColor: 'rgba(255,165,0,0.2)' }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'active', 'inactive', 'needs_attention'] as const).map((s) => {
                const cfg = s !== 'all' ? STATUS_CONFIG[s] : null;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className="rounded-full px-3 py-1 text-xs font-medium border-2 transition-all flex items-center gap-1.5"
                    style={
                      statusFilter === s
                        ? { background: 'rgba(255,165,0,0.12)', borderColor: '#FFA500', color: '#4A3728' }
                        : { borderColor: 'rgba(74,55,40,0.12)', color: '#6B5D53', background: 'white' }
                    }
                  >
                    {cfg && <span className="size-2 rounded-full inline-block" style={{ background: cfg.color }} />}
                    {s === 'all' ? 'Todos' : cfg!.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Table ── */}
        <Card className="border-0 shadow-md overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm" style={{ color: '#6B5D53' }}>
                {search || statusFilter !== 'all' ? 'Nenhum paciente encontrado com esses filtros.' : 'Nenhum paciente cadastrado.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'rgba(255,165,0,0.12)', background: '#FFFDF9' }}>
                    {['Paciente', 'Contato', 'Convênio', 'Última visita', 'Status', ''].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: '#6B5D53' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const sc = STATUS_CONFIG[p.status];
                    return (
                      <tr
                        key={p.id}
                        onClick={() => openDetail(p)}
                        className="border-b hover:bg-[#FFF8E7] transition-colors cursor-pointer group"
                        style={{ borderColor: 'rgba(74,55,40,0.06)' }}
                      >
                        {/* Paciente */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9 border shrink-0" style={{ borderColor: 'rgba(255,165,0,0.3)' }}>
                              <AvatarFallback
                                className="text-xs font-bold text-white"
                                style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
                              >
                                {initials(p.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-semibold truncate" style={{ color: '#4A3728' }}>{p.name}</p>
                              <p className="text-[11px]" style={{ color: '#6B5D53' }}>{p.cpf}</p>
                            </div>
                          </div>
                        </td>
                        {/* Contato */}
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium" style={{ color: '#4A3728' }}>{p.phone}</p>
                          <p className="text-[11px]" style={{ color: '#6B5D53' }}>{p.email}</p>
                        </td>
                        {/* Convênio */}
                        <td className="px-4 py-3">
                          <span className="text-xs" style={{ color: p.healthPlan ? '#4A3728' : '#6B5D53' }}>
                            {p.healthPlan ?? '—'}
                          </span>
                        </td>
                        {/* Última visita */}
                        <td className="px-4 py-3">
                          <span className="text-xs" style={{ color: '#6B5D53' }}>{formatDate(p.lastVisit)}</span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                            style={{ background: sc.bg, color: sc.color }}
                          >
                            <span className="size-1.5 rounded-full inline-block" style={{ background: sc.color }} />
                            {sc.label}
                          </span>
                        </td>
                        {/* Chevron */}
                        <td className="px-3 py-3">
                          <ChevronRight className="size-4 text-[#6B5D53] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* ── Add sheet ── */}
      <PatientFormSheet
        open={sheetMode === 'add'}
        onClose={closeSheet}
        onSave={handleSave}
      />

      {/* ── Edit sheet ── */}
      <PatientFormSheet
        open={sheetMode === 'edit'}
        onClose={() => setSheetMode('detail')}
        patient={selected ?? undefined}
        onSave={handleSave}
      />

      {/* ── Detail sheet ── */}
      <PatientDetailSheet
        open={sheetMode === 'detail'}
        onClose={closeSheet}
        patient={selected}
        onEdit={openEdit}
        onDelete={() => { setDeleteTarget(selected); }}
      />

      {/* ── Delete dialog ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#4A3728' }}>Excluir paciente?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: '#6B5D53' }}>
              O paciente <strong style={{ color: '#4A3728' }}>{deleteTarget?.name}</strong> será removido permanentemente.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="border-0 bg-red-500 hover:bg-red-600 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
