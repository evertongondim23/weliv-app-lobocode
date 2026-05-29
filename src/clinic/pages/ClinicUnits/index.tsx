import React, { useState, useId } from 'react';
import {
  Building2,
  MapPin,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Pencil,
  Users,
  X,
  UserPlus,
  Search,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Label } from '../../../app/components/ui/label';
import { Switch } from '../../../app/components/ui/switch';
import { Avatar, AvatarFallback } from '../../../app/components/ui/avatar';
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
import { useClinic } from '../../contexts/ClinicContext';
import type { CompanyUnit } from '../../../app/types';
import type { ClinicProfessionalMock } from '../../mocks/clinicData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const STATUS_CONFIG: Record<
  ClinicProfessionalMock['status'],
  { label: string; color: string; bg: string }
> = {
  attending: { label: 'Em atendimento', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  available:  { label: 'Disponível',     color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  absent:     { label: 'Ausente',        color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  day_off:    { label: 'Folga',          color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

// ─── Form sheet (Add + Edit) ──────────────────────────────────────────────────

interface UnitFormValues {
  name: string;
  code: string;
  address: string;
  isActive: boolean;
}

const emptyForm: UnitFormValues = { name: '', code: '', address: '', isActive: true };

interface UnitFormSheetProps {
  open: boolean;
  onClose: () => void;
  unit?: CompanyUnit;
  onSave: (values: UnitFormValues) => void;
}

function UnitFormSheet({ open, onClose, unit, onSave }: UnitFormSheetProps) {
  const isEditing = !!unit;
  const nameId = useId();
  const codeId = useId();
  const addressId = useId();
  const activeId = useId();

  const [form, setForm] = useState<UnitFormValues>(() =>
    unit
      ? { name: unit.name, code: unit.code ?? '', address: unit.address ?? '', isActive: unit.isActive }
      : emptyForm,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof UnitFormValues, string>>>({});

  React.useEffect(() => {
    if (open) {
      setForm(
        unit
          ? { name: unit.name, code: unit.code ?? '', address: unit.address ?? '', isActive: unit.isActive }
          : emptyForm,
      );
      setErrors({});
    }
  }, [open, unit]);

  const set = <K extends keyof UnitFormValues>(key: K, value: UnitFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = () => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    onSave(form);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] flex flex-col p-0 gap-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b shrink-0" style={{ borderColor: 'rgba(255,165,0,0.15)' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
            >
              <Building2 className="size-5 text-[#FFA500]" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold" style={{ color: '#4A3728' }}>
                {isEditing ? 'Editar Unidade' : 'Nova Unidade'}
              </SheetTitle>
              <SheetDescription className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>
                {isEditing ? `Editando: ${unit.name}` : 'Preencha os dados da nova filial.'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Nome */}
          <div className="space-y-1.5">
            <Label htmlFor={nameId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
              Nome da unidade <span className="text-red-500">*</span>
            </Label>
            <Input
              id={nameId}
              placeholder="ex.: Filial Centro"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="border-2 h-11"
              style={{ borderColor: errors.name ? '#EF4444' : 'rgba(255,165,0,0.25)' }}
            />
            {errors.name && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="size-3" />{errors.name}
              </p>
            )}
          </div>

          {/* Código */}
          <div className="space-y-1.5">
            <Label htmlFor={codeId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
              Código <span className="text-xs font-normal" style={{ color: '#6B5D53' }}>(opcional)</span>
            </Label>
            <Input
              id={codeId}
              placeholder="ex.: CTR"
              value={form.code}
              onChange={(e) => set('code', e.target.value.toUpperCase())}
              className="border-2 h-11 uppercase"
              style={{ borderColor: 'rgba(255,165,0,0.25)' }}
            />
            <p className="text-[11px]" style={{ color: '#6B5D53' }}>
              Sigla usada no UnitSelector e em relatórios.
            </p>
          </div>

          {/* Endereço */}
          <div className="space-y-1.5">
            <Label htmlFor={addressId} className="text-sm font-medium" style={{ color: '#4A3728' }}>
              Endereço <span className="text-xs font-normal" style={{ color: '#6B5D53' }}>(opcional)</span>
            </Label>
            <Input
              id={addressId}
              placeholder="ex.: Av. Paulista, 1000 — São Paulo, SP"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              className="border-2 h-11"
              style={{ borderColor: 'rgba(255,165,0,0.25)' }}
            />
          </div>

          {/* Ativo */}
          <div
            className="flex items-center justify-between rounded-xl border-2 px-4 py-3.5"
            style={{ borderColor: 'rgba(255,165,0,0.2)', background: form.isActive ? '#FFFDF9' : '#FAFAFA' }}
          >
            <div>
              <Label htmlFor={activeId} className="text-sm font-medium cursor-pointer" style={{ color: '#4A3728' }}>
                Unidade ativa
              </Label>
              <p className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>
                {form.isActive ? 'Aparece no seletor e na agenda.' : 'Oculta do seletor e da agenda.'}
              </p>
            </div>
            <Switch
              id={activeId}
              checked={form.isActive}
              onCheckedChange={(v) => set('isActive', v)}
              className="data-[state=checked]:bg-[#FFA500]"
            />
          </div>

          {/* Tip */}
          <div
            className="rounded-xl border px-4 py-3 flex gap-3"
            style={{ borderColor: 'rgba(255,165,0,0.18)', background: 'rgba(255,248,231,0.6)' }}
          >
            <Building2 className="size-4 shrink-0 mt-0.5 text-[#FFA500]" />
            <p className="text-xs leading-relaxed" style={{ color: '#6B5D53' }}>
              Após salvar, vincule profissionais a esta unidade usando o botão{' '}
              <strong style={{ color: '#4A3728' }}>Ver equipe</strong> no card da unidade.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex gap-3 shrink-0"
          style={{ borderColor: 'rgba(255,165,0,0.15)' }}
        >
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
            {isEditing ? 'Atualizar' : 'Criar unidade'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Team sheet ───────────────────────────────────────────────────────────────

interface UnitTeamSheetProps {
  open: boolean;
  onClose: () => void;
  unit: CompanyUnit | null;
}

function UnitTeamSheet({ open, onClose, unit }: UnitTeamSheetProps) {
  const { professionals, unitProfessionals, addProfessionalToUnit, removeProfessionalFromUnit } =
    useClinic();
  const [search, setSearch] = useState('');

  if (!unit) return null;

  const assignedIds = unitProfessionals[unit.id] ?? [];
  const assigned = professionals.filter((p) => assignedIds.includes(p.id));
  const unassigned = professionals.filter(
    (p) =>
      !assignedIds.includes(p.id) &&
      (!search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.specialty.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) { setSearch(''); onClose(); } }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[500px] flex flex-col p-0 gap-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b shrink-0" style={{ borderColor: 'rgba(255,165,0,0.15)' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
            >
              <Users className="size-5 text-[#FFA500]" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold" style={{ color: '#4A3728' }}>
                Equipe — {unit.name}
              </SheetTitle>
              <SheetDescription className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>
                {assigned.length} profissional{assigned.length !== 1 ? 'is' : ''} nesta unidade
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Profissionais na unidade */}
          <div className="px-6 pt-5 pb-3">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B5D53' }}>
              Nesta unidade
            </p>
            {assigned.length === 0 ? (
              <div
                className="rounded-xl border-2 border-dashed px-4 py-6 text-center"
                style={{ borderColor: 'rgba(255,165,0,0.25)' }}
              >
                <Users className="size-8 mx-auto mb-2 text-[#FFA500] opacity-50" />
                <p className="text-sm" style={{ color: '#6B5D53' }}>Nenhum profissional vinculado.</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>
                  Adicione profissionais na seção abaixo.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {assigned.map((prof) => {
                  const sc = STATUS_CONFIG[prof.status];
                  return (
                    <div
                      key={prof.id}
                      className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
                      style={{ borderColor: 'rgba(255,165,0,0.18)', background: '#FFFDF9' }}
                    >
                      <Avatar className="size-9 shrink-0 border" style={{ borderColor: 'rgba(255,165,0,0.3)' }}>
                        <AvatarFallback
                          className="text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
                        >
                          {initials(prof.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#4A3728' }}>
                          {prof.name}
                        </p>
                        <p className="text-xs" style={{ color: '#6B5D53' }}>{prof.specialty}</p>
                      </div>
                      <span
                        className="hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium shrink-0"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        <span className="size-1.5 rounded-full inline-block" style={{ background: sc.color }} />
                        {sc.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeProfessionalFromUnit(unit.id, prof.id)}
                        className="shrink-0 flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-red-50"
                        aria-label={`Remover ${prof.name} da unidade`}
                        title="Remover da unidade"
                      >
                        <X className="size-4 text-red-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mx-6 my-2 border-t" style={{ borderColor: 'rgba(74,55,40,0.08)' }} />

          {/* Adicionar profissionais */}
          <div className="px-6 pb-6">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B5D53' }}>
              Adicionar à equipe
            </p>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#6B5D53]" />
              <Input
                placeholder="Buscar profissional…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm border-2"
                style={{ borderColor: 'rgba(255,165,0,0.2)' }}
              />
            </div>

            {unassigned.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: '#6B5D53' }}>
                {search ? 'Nenhum resultado.' : 'Todos os profissionais já estão nesta unidade.'}
              </p>
            ) : (
              <div className="space-y-2">
                {unassigned.map((prof) => (
                  <div
                    key={prof.id}
                    className="flex items-center gap-3 rounded-xl border px-3 py-2.5 hover:bg-[#FFF8E7] transition-colors"
                    style={{ borderColor: 'rgba(74,55,40,0.1)' }}
                  >
                    <Avatar className="size-9 shrink-0 border" style={{ borderColor: 'rgba(255,165,0,0.2)' }}>
                      <AvatarFallback
                        className="text-xs font-semibold"
                        style={{ background: '#FFF8E7', color: '#FFA500' }}
                      >
                        {initials(prof.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#4A3728' }}>
                        {prof.name}
                      </p>
                      <p className="text-xs" style={{ color: '#6B5D53' }}>{prof.specialty}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addProfessionalToUnit(unit.id, prof.id)}
                      className="shrink-0 flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-[#FFF8E7]"
                      style={{ borderColor: 'rgba(255,165,0,0.35)', color: '#FFA500' }}
                      aria-label={`Adicionar ${prof.name} à unidade`}
                    >
                      <UserPlus className="size-3.5" />
                      Adicionar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t shrink-0"
          style={{ borderColor: 'rgba(255,165,0,0.15)' }}
        >
          <Button
            type="button"
            onClick={() => { setSearch(''); onClose(); }}
            className="w-full border-0 text-white"
            style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
          >
            Fechar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Unit Card ────────────────────────────────────────────────────────────────

interface UnitCardProps {
  unit: CompanyUnit;
  teamCount: number;
  onEdit: () => void;
  onViewTeam: () => void;
  onDelete: () => void;
}

function UnitCard({ unit, teamCount, onEdit, onViewTeam, onDelete }: UnitCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
          >
            <Building2 className="size-5 text-[#FFA500]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate" style={{ color: '#4A3728' }}>{unit.name}</p>
            {unit.code && (
              <p className="text-[11px] mt-0.5" style={{ color: '#6B5D53' }}>Código: {unit.code}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {unit.isActive ? (
              <CheckCircle2 className="size-4 text-emerald-500" title="Ativa" />
            ) : (
              <XCircle className="size-4 text-gray-400" title="Inativa" />
            )}
          </div>
        </div>

        {/* Address */}
        {unit.address && (
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="size-3.5 shrink-0 mt-0.5 text-[#FFA500]" />
            <p className="text-xs leading-snug" style={{ color: '#6B5D53' }}>{unit.address}</p>
          </div>
        )}

        {/* Team count */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4"
          style={{ background: 'rgba(255,165,0,0.07)', border: '1px solid rgba(255,165,0,0.15)' }}
        >
          <Users className="size-3.5 text-[#FFA500]" />
          <span className="text-xs font-medium" style={{ color: '#4A3728' }}>
            {teamCount} profissional{teamCount !== 1 ? 'is' : ''} vinculado{teamCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Status badge */}
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={
              unit.isActive
                ? { background: 'rgba(16,185,129,0.1)', color: '#10B981' }
                : { background: 'rgba(107,114,128,0.1)', color: '#6B7280' }
            }
          >
            <span
              className="size-1.5 rounded-full inline-block"
              style={{ background: unit.isActive ? '#10B981' : '#6B7280' }}
            />
            {unit.isActive ? 'Ativa' : 'Inativa'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 border-2 text-xs gap-1.5 hover:bg-[#FFF8E7]"
            style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}
          >
            <Pencil className="size-3.5" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewTeam}
            className="flex-1 border-2 text-xs gap-1.5 hover:bg-[#FFF8E7]"
            style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}
          >
            <Users className="size-3.5" />
            Ver equipe
          </Button>
          <button
            type="button"
            onClick={onDelete}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border-2 transition-colors hover:bg-red-50 hover:border-red-200"
            style={{ borderColor: 'rgba(74,55,40,0.15)' }}
            aria-label="Excluir unidade"
            title="Excluir unidade"
          >
            <Trash2 className="size-3.5 text-red-400" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type SheetMode = 'add' | 'edit' | 'team' | null;

export function ClinicUnits() {
  const { units, addUnit, updateUnit, removeUnit, unitProfessionals } = useClinic();

  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [selectedUnit, setSelectedUnit] = useState<CompanyUnit | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CompanyUnit | null>(null);

  const openAdd = () => { setSelectedUnit(null); setSheetMode('add'); };
  const openEdit = (unit: CompanyUnit) => { setSelectedUnit(unit); setSheetMode('edit'); };
  const openTeam = (unit: CompanyUnit) => { setSelectedUnit(unit); setSheetMode('team'); };
  const closeSheet = () => { setSheetMode(null); setSelectedUnit(null); };

  const handleSave = (values: { name: string; code: string; address: string; isActive: boolean }) => {
    if (sheetMode === 'add') {
      addUnit({
        name: values.name.trim(),
        code: values.code.trim() || undefined,
        address: values.address.trim() || undefined,
        isActive: values.isActive,
      });
    } else if (sheetMode === 'edit' && selectedUnit) {
      updateUnit(selectedUnit.id, {
        name: values.name.trim(),
        code: values.code.trim() || undefined,
        address: values.address.trim() || undefined,
        isActive: values.isActive,
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) { removeUnit(deleteTarget.id); setDeleteTarget(null); }
  };

  if (units.length === 0) {
    return (
      <>
        <div className="space-y-6 pb-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#4A3728' }}>Unidades</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B5D53' }}>Gestão de filiais da rede</p>
          </div>
          <div className="text-center py-20">
            <div
              className="inline-flex p-5 rounded-full mb-4"
              style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
            >
              <Building2 className="size-12 text-[#FFA500]" />
            </div>
            <p className="text-lg font-semibold mb-1" style={{ color: '#4A3728' }}>Nenhuma unidade cadastrada</p>
            <p className="text-sm mb-6" style={{ color: '#6B5D53' }}>
              Adicione filiais para gerenciar sua rede de clínicas.
            </p>
            <Button
              onClick={openAdd}
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}
              className="gap-2 border-0 shadow-md"
            >
              <PlusCircle className="size-4" />
              Adicionar primeira unidade
            </Button>
          </div>
        </div>

        <UnitFormSheet
          open={sheetMode === 'add'}
          onClose={closeSheet}
          onSave={handleSave}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#4A3728' }}>Unidades</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B5D53' }}>
              {units.length} unidade{units.length !== 1 ? 's' : ''} cadastrada{units.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={openAdd}
            style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}
            className="gap-2 border-0 shadow-md"
          >
            <PlusCircle className="size-4" />
            Adicionar unidade
          </Button>
        </div>

        {/* Units grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              teamCount={(unitProfessionals[unit.id] ?? []).length}
              onEdit={() => openEdit(unit)}
              onViewTeam={() => openTeam(unit)}
              onDelete={() => setDeleteTarget(unit)}
            />
          ))}
        </div>
      </div>

      {/* Add / Edit sheet */}
      <UnitFormSheet
        open={sheetMode === 'add' || sheetMode === 'edit'}
        onClose={closeSheet}
        unit={sheetMode === 'edit' ? (selectedUnit ?? undefined) : undefined}
        onSave={handleSave}
      />

      {/* Team sheet */}
      <UnitTeamSheet
        open={sheetMode === 'team'}
        onClose={closeSheet}
        unit={selectedUnit}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#4A3728' }}>Excluir unidade?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: '#6B5D53' }}>
              A unidade <strong style={{ color: '#4A3728' }}>{deleteTarget?.name}</strong> será removida permanentemente.
              Os profissionais vinculados não serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{ borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728' }}
            >
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
