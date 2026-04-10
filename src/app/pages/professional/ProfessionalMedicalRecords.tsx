import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ClipboardList,
  Search,
  Pill,
  AlertTriangle,
  Calendar,
  User,
  FileHeart,
  X,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { WelcomeCard } from '../../components/common';
import { EmptyState } from '../../components/EmptyState';
import {
  listMedicalRecordsByProfessional,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  addMedicalRecordPdf,
  removeMedicalRecordPdf,
  type MedicalRecord,
  type MedicalRecordWriteInput,
  type MedicationEntry,
} from '../../services/medicalRecord.service';

const fieldClassName = 'border-2';
const fieldStyle = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;
const primaryBtnStyle = { background: 'linear-gradient(135deg, #FFA500, #FF8C00)' } as const;

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}

function formatBirth(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function splitComma(text: string): string[] {
  return text
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

type FormState = {
  patientId: string;
  patientName: string;
  patientCpf: string;
  patientBirthDate: string;
  bloodType: string;
  allergiesText: string;
  chronicText: string;
  meds: MedicationEntry[];
  lastConsultLocal: string;
  chiefComplaint: string;
  clinicalSummary: string;
};

function emptyForm(): FormState {
  return {
    patientId: '',
    patientName: '',
    patientCpf: '',
    patientBirthDate: '',
    bloodType: '',
    allergiesText: '',
    chronicText: '',
    meds: [{ name: '', dosage: '', since: '' }],
    lastConsultLocal: toDatetimeLocalValue(new Date().toISOString()),
    chiefComplaint: '',
    clinicalSummary: '',
  };
}

function recordToForm(r: MedicalRecord): FormState {
  return {
    patientId: r.patientId,
    patientName: r.patientName,
    patientCpf: r.patientCpf,
    patientBirthDate: r.patientBirthDate.slice(0, 10),
    bloodType: r.bloodType ?? '',
    allergiesText: r.allergies.join(', '),
    chronicText: r.chronicConditions.join(', '),
    meds:
      r.currentMedications.length > 0
        ? r.currentMedications.map((m) => ({ ...m }))
        : [{ name: '', dosage: '', since: '' }],
    lastConsultLocal: toDatetimeLocalValue(r.lastConsultAt),
    chiefComplaint: r.chiefComplaint,
    clinicalSummary: r.clinicalSummary,
  };
}

function formToWriteInput(f: FormState): MedicalRecordWriteInput | null {
  if (!f.patientName.trim() || !f.patientCpf.trim() || !f.patientBirthDate) {
    toast.error('Preencha nome, CPF e data de nascimento.');
    return null;
  }
  if (!f.chiefComplaint.trim() || !f.clinicalSummary.trim()) {
    toast.error('Preencha queixa principal e evolução / resumo.');
    return null;
  }
  const lastConsultAt = f.lastConsultLocal
    ? new Date(f.lastConsultLocal).toISOString()
    : new Date().toISOString();
  if (Number.isNaN(new Date(lastConsultAt).getTime())) {
    toast.error('Data/hora da última consulta inválida.');
    return null;
  }
  const meds = f.meds
    .filter((m) => m.name.trim())
    .map((m) => ({
      name: m.name.trim(),
      dosage: m.dosage.trim(),
      since: m.since.trim() || new Date().toISOString().slice(0, 10),
    }));
  return {
    patientId: f.patientId.trim() || `pat-${Date.now()}`,
    patientName: f.patientName.trim(),
    patientCpf: f.patientCpf.trim(),
    patientBirthDate: f.patientBirthDate,
    bloodType: f.bloodType.trim() || undefined,
    allergies: splitComma(f.allergiesText),
    chronicConditions: splitComma(f.chronicText),
    currentMedications: meds,
    lastConsultAt,
    chiefComplaint: f.chiefComplaint.trim(),
    clinicalSummary: f.clinicalSummary.trim(),
  };
}

export function ProfessionalMedicalRecords() {
  const { user } = useAuth();
  const { uploadDocument } = useData();
  const professionalId = user?.id ?? '';
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  const rows = useMemo(
    () => (professionalId ? listMedicalRecordsByProfessional(professionalId) : []),
    [professionalId, refreshKey]
  );

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MedicalRecord | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const [deleteTarget, setDeleteTarget] = useState<MedicalRecord | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.patientName.toLowerCase().includes(q) ||
        r.patientCpf.includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.chiefComplaint.toLowerCase().includes(q)
    );
  }, [rows, search]);

  useEffect(() => {
    if (filtered.length === 0) {
      setSelected(null);
      return;
    }
    setSelected((prev) => {
      if (prev && filtered.some((r) => r.id === prev.id)) return prev;
      return filtered[0];
    });
  }, [filtered]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormOpen(true);
  };

  const openEdit = (record: MedicalRecord) => {
    setEditingId(record.id);
    setForm(recordToForm(record));
    setFormOpen(true);
  };

  const submitForm = () => {
    if (!professionalId) {
      toast.error('Sessão inválida.');
      return;
    }
    const payload = formToWriteInput(form);
    if (!payload) return;

    if (editingId) {
      const updated = updateMedicalRecord(editingId, professionalId, payload);
      if (!updated) {
        toast.error('Não foi possível atualizar o prontuário.');
        return;
      }
      toast.success('Prontuário atualizado.');
      bump();
      setSelected(updated);
    } else {
      const created = createMedicalRecord(professionalId, payload);
      toast.success('Prontuário criado.');
      bump();
      setSelected(created);
      setSearch('');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget || !professionalId) return;
    const ok = deleteMedicalRecord(deleteTarget.id, professionalId);
    if (!ok) {
      toast.error('Não foi possível excluir.');
      return;
    }
    toast.success('Prontuário excluído.');
    bump();
    if (selected?.id === deleteTarget.id) setSelected(null);
    setDeleteTarget(null);
  };

  const addMedRow = () => {
    setForm((f) => ({ ...f, meds: [...f.meds, { name: '', dosage: '', since: '' }] }));
  };

  const removeMedRow = (index: number) => {
    setForm((f) => ({
      ...f,
      meds: f.meds.length <= 1 ? f.meds : f.meds.filter((_, i) => i !== index),
    }));
  };

  const updateMed = (index: number, patch: Partial<MedicationEntry>) => {
    setForm((f) => ({
      ...f,
      meds: f.meds.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    }));
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !selected || !professionalId) return;
    if (file.type !== 'application/pdf') {
      toast.error('Envie apenas arquivos PDF.');
      return;
    }
    const url = URL.createObjectURL(file);
    const updated = addMedicalRecordPdf(selected.id, professionalId, file.name, url);
    if (!updated) {
      URL.revokeObjectURL(url);
      toast.error('Não foi possível anexar o PDF.');
      return;
    }
    uploadDocument({
      patientId: selected.patientId,
      professionalId,
      type: 'other',
      name: `Prontuário: ${file.name}`,
      url,
      status: 'ready',
    });
    toast.success('PDF anexado ao prontuário. Também disponível para o paciente em Meus documentos.');
    bump();
    setSelected(updated);
  };

  const handleRemovePdf = (attachmentId: string) => {
    if (!selected || !professionalId) return;
    const updated = removeMedicalRecordPdf(selected.id, professionalId, attachmentId);
    if (!updated) {
      toast.error('Não foi possível remover o anexo.');
      return;
    }
    toast.success('PDF removido do prontuário.');
    bump();
    setSelected(updated);
  };

  if (!professionalId) {
    return (
      <div className="text-sm" style={{ color: '#6B5D53' }}>
        Faça login como profissional para gerenciar prontuários.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={ClipboardList}
        title="Prontuários médicos"
        subtitle="Crie, edite e organize prontuários (demo em memória — recarregar a página restaura os dados iniciais)."
      />

      <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Buscar por paciente, CPF, ID ou queixa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 ${fieldClassName}`}
                style={fieldStyle}
              />
            </div>
            <Button
              type="button"
              className="w-full sm:w-auto shrink-0 text-white border-0"
              style={primaryBtnStyle}
              onClick={openCreate}
            >
              <Plus className="size-4 mr-2" />
              Novo prontuário
            </Button>
          </div>
          <p className="text-xs mt-3" style={{ color: '#6B5D53' }}>
            {filtered.length} prontuário(s) neste perfil profissional
          </p>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            icon={ClipboardList}
            title={search ? 'Nenhum prontuário encontrado' : 'Sem prontuários para exibir'}
            description={
              search
                ? 'Ajuste a busca ou limpe o campo.'
                : 'Crie o primeiro prontuário ou aguarde novos cadastros.'
            }
          />
          {!search ? (
            <div className="flex justify-center">
              <Button type="button" className="text-white border-0" style={primaryBtnStyle} onClick={openCreate}>
                <Plus className="size-4 mr-2" />
                Criar prontuário
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className={`grid gap-4 ${selected ? 'xl:grid-cols-[1fr_minmax(300px,400px)]' : 'grid-cols-1'}`}
        >
          <div className="space-y-3">
            {filtered.map((record) => {
              const isSel = selected?.id === record.id;
              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => setSelected(record)}
                  className="w-full text-left rounded-xl border-2 transition-all hover:shadow-md"
                  style={{
                    borderColor: isSel ? 'rgba(255, 165, 0, 0.55)' : 'rgba(255, 165, 0, 0.2)',
                    background: isSel ? '#FFF8E7' : 'white',
                  }}
                >
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold" style={{ color: '#4A3728' }}>
                          {record.patientName}
                        </p>
                        <p className="text-xs" style={{ color: '#6B5D53' }}>
                          {record.patientCpf} · {record.id}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 gap-1 text-[10px]">
                        <Calendar className="size-3" />
                        {formatDate(record.lastConsultAt)}
                      </Badge>
                    </div>
                    <p className="text-sm line-clamp-2" style={{ color: '#4A3728' }}>
                      {record.chiefComplaint}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {record.allergies.length > 0 ? (
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-amber-50 text-amber-900 border-amber-200/80"
                        >
                          <AlertTriangle className="size-3" />
                          Alergia
                        </Badge>
                      ) : null}
                      {record.currentMedications.length > 0 ? (
                        <Badge variant="outline" className="gap-1">
                          <Pill className="size-3" />
                          {record.currentMedications.length} med.
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selected ? (
            <Card
              className="border-2 h-fit xl:sticky xl:top-24"
              style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#4A3728' }}>
                      <FileHeart className="size-5 text-[#FFA500] shrink-0" />
                      <span className="truncate">{selected.patientName}</span>
                    </CardTitle>
                    <CardDescription>
                      Atualizado em {formatDate(selected.updatedAt)} · Última consulta{' '}
                      {formatDate(selected.lastConsultAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="size-8 border-2"
                      style={fieldStyle}
                      onClick={() => openEdit(selected)}
                      aria-label="Editar prontuário"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="size-8 border-2 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setDeleteTarget(selected)}
                      aria-label="Excluir prontuário"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={() => setSelected(null)}
                      aria-label="Fechar painel"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
                    <User className="size-4 shrink-0" />
                    <span>
                      Nasc.: {formatBirth(selected.patientBirthDate)}
                      {selected.bloodType ? ` · ${selected.bloodType}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
                    <ClipboardList className="size-4 shrink-0" />
                    <span>CPF {selected.patientCpf}</span>
                  </div>
                </div>
                <p className="text-xs" style={{ color: '#6B5D53' }}>
                  ID paciente: {selected.patientId}
                </p>

                <div className="rounded-lg border p-3" style={{ borderColor: '#FFE5B4', background: '#FFFBF0' }}>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>
                    Queixa principal
                  </p>
                  <p className="mt-1 font-medium" style={{ color: '#4A3728' }}>
                    {selected.chiefComplaint}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#6B5D53' }}>
                    Evolução / resumo
                  </p>
                  <p className="leading-relaxed" style={{ color: '#4A3728' }}>
                    {selected.clinicalSummary}
                  </p>
                </div>

                {selected.allergies.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B5D53' }}>
                      Alergias
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selected.allergies.map((a) => (
                        <Badge key={a} variant="secondary" className="bg-red-50 text-red-800 border-red-200/80">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selected.chronicConditions.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B5D53' }}>
                      Condições crônicas
                    </p>
                    <ul className="list-disc pl-5 space-y-1" style={{ color: '#4A3728' }}>
                      {selected.chronicConditions.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selected.currentMedications.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B5D53' }}>
                      Medicações em uso
                    </p>
                    <ul className="space-y-2">
                      {selected.currentMedications.map((m) => (
                        <li
                          key={`${m.name}-${m.since}`}
                          className="rounded-lg border px-3 py-2"
                          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                        >
                          <span className="font-medium" style={{ color: '#4A3728' }}>
                            {m.name}
                          </span>
                          <span className="block text-xs mt-0.5" style={{ color: '#6B5D53' }}>
                            {m.dosage} · desde {formatBirth(m.since)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div
                  className="rounded-lg border p-3 space-y-3"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.28)', background: '#FFFBF5' }}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2" style={{ color: '#6B5D53' }}>
                      <FileText className="size-4 text-[#FFA500]" />
                      Documentos PDF (prontuário)
                    </p>
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={handlePdfUpload}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-2 shrink-0"
                      style={fieldStyle}
                      onClick={() => pdfInputRef.current?.click()}
                    >
                      <Upload className="size-3.5 mr-1.5" />
                      Enviar PDF
                    </Button>
                  </div>
                  <p className="text-[11px] leading-snug" style={{ color: '#6B5D53' }}>
                    Arquivos ficam ligados a este prontuário. O mesmo arquivo é registrado em{' '}
                    <strong>Meus documentos</strong> do paciente (categoria Outros, nesta demo).
                  </p>
                  {(selected.pdfAttachments ?? []).length === 0 ? (
                    <p className="text-sm py-2 text-center border border-dashed rounded-md" style={{ color: '#6B5D53', borderColor: 'rgba(255, 165, 0, 0.25)' }}>
                      Nenhum PDF anexado ainda.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {(selected.pdfAttachments ?? []).map((doc) => (
                        <li
                          key={doc.id}
                          className="flex items-center justify-between gap-2 rounded-md border bg-white px-3 py-2"
                          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                        >
                          <div className="min-w-0 flex items-center gap-2">
                            <FileText className="size-4 shrink-0 text-red-600" />
                            <div className="min-w-0">
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium truncate block hover:underline"
                                style={{ color: '#4A3728' }}
                              >
                                {doc.name}
                              </a>
                              <span className="text-[10px]" style={{ color: '#6B5D53' }}>
                                {formatDate(doc.uploadedAt)}
                              </span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 shrink-0 text-red-600 hover:bg-red-50"
                            aria-label="Remover PDF"
                            onClick={() => handleRemovePdf(doc.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <p
                  className="text-[11px] pt-2 border-t"
                  style={{ color: '#6B5D53', borderColor: 'rgba(255, 165, 0, 0.12)' }}
                >
                  Dados de demonstração. Em produção, persistir em backend e cumprir LGPD.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent
          className="sm:max-w-lg max-h-[min(90vh,720px)] overflow-y-auto gap-0 p-0"
          style={{ borderColor: 'rgba(255, 165, 0, 0.25)' }}
        >
          <DialogHeader className="p-6 pb-2">
            <DialogTitle style={{ color: '#4A3728' }}>
              {editingId ? 'Editar prontuário' : 'Novo prontuário'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Alterações são salvas apenas nesta sessão do navegador (demo).'
                : 'Preencha os dados do paciente e o resumo clínico.'}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="mr-name">Nome completo *</Label>
                <Input
                  id="mr-name"
                  className={fieldClassName}
                  style={fieldStyle}
                  value={form.patientName}
                  onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mr-cpf">CPF *</Label>
                <Input
                  id="mr-cpf"
                  className={fieldClassName}
                  style={fieldStyle}
                  value={form.patientCpf}
                  onChange={(e) => setForm((f) => ({ ...f, patientCpf: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mr-birth">Nascimento *</Label>
                <Input
                  id="mr-birth"
                  type="date"
                  className={fieldClassName}
                  style={fieldStyle}
                  value={form.patientBirthDate}
                  onChange={(e) => setForm((f) => ({ ...f, patientBirthDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mr-blood">Tipo sanguíneo</Label>
                <Input
                  id="mr-blood"
                  placeholder="ex.: O+"
                  className={fieldClassName}
                  style={fieldStyle}
                  value={form.bloodType}
                  onChange={(e) => setForm((f) => ({ ...f, bloodType: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mr-pid">ID do paciente</Label>
                <Input
                  id="mr-pid"
                  placeholder="Gerado se vazio"
                  className={fieldClassName}
                  style={fieldStyle}
                  value={form.patientId}
                  onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
                  disabled={!!editingId}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="mr-consult">Última consulta</Label>
                <Input
                  id="mr-consult"
                  type="datetime-local"
                  className={fieldClassName}
                  style={fieldStyle}
                  value={form.lastConsultLocal}
                  onChange={(e) => setForm((f) => ({ ...f, lastConsultLocal: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="mr-allergies">Alergias (separar por vírgula)</Label>
                <Input
                  id="mr-allergies"
                  className={fieldClassName}
                  style={fieldStyle}
                  value={form.allergiesText}
                  onChange={(e) => setForm((f) => ({ ...f, allergiesText: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="mr-chronic">Condições crônicas (separar por vírgula)</Label>
                <Input
                  id="mr-chronic"
                  className={fieldClassName}
                  style={fieldStyle}
                  value={form.chronicText}
                  onChange={(e) => setForm((f) => ({ ...f, chronicText: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <Label>Medicações em uso</Label>
                  <Button type="button" variant="outline" size="sm" className="border-2 h-8" style={fieldStyle} onClick={addMedRow}>
                    <Plus className="size-3.5 mr-1" />
                    Linha
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.meds.map((m, i) => (
                    <div
                      key={i}
                      className="grid gap-2 sm:grid-cols-[1fr_1fr_100px_auto] items-end rounded-lg border p-2"
                      style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase" style={{ color: '#6B5D53' }}>
                          Nome
                        </span>
                        <Input
                          className={`h-9 ${fieldClassName}`}
                          style={fieldStyle}
                          value={m.name}
                          onChange={(e) => updateMed(i, { name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase" style={{ color: '#6B5D53' }}>
                          Posologia
                        </span>
                        <Input
                          className={`h-9 ${fieldClassName}`}
                          style={fieldStyle}
                          value={m.dosage}
                          onChange={(e) => updateMed(i, { dosage: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase" style={{ color: '#6B5D53' }}>
                          Desde
                        </span>
                        <Input
                          type="date"
                          className={`h-9 ${fieldClassName}`}
                          style={fieldStyle}
                          value={m.since.slice(0, 10)}
                          onChange={(e) => updateMed(i, { since: e.target.value })}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 text-red-600"
                        onClick={() => removeMedRow(i)}
                        aria-label="Remover medicação"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="mr-complaint">Queixa principal *</Label>
                <Textarea
                  id="mr-complaint"
                  className={`min-h-[72px] ${fieldClassName}`}
                  style={fieldStyle}
                  value={form.chiefComplaint}
                  onChange={(e) => setForm((f) => ({ ...f, chiefComplaint: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="mr-summary">Evolução / resumo clínico *</Label>
                <Textarea
                  id="mr-summary"
                  className={`min-h-[100px] ${fieldClassName}`}
                  style={fieldStyle}
                  value={form.clinicalSummary}
                  onChange={(e) => setForm((f) => ({ ...f, clinicalSummary: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-0 gap-2 sm:gap-0">
            <Button type="button" variant="outline" className="border-2" style={fieldStyle} onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" className="text-white border-0" style={primaryBtnStyle} onClick={submitForm}>
              {editingId ? 'Salvar alterações' : 'Criar prontuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.25)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#4A3728' }}>Excluir prontuário?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Isso remove o prontuário de ${deleteTarget.patientName} (${deleteTarget.id}). Esta ação não pode ser desfeita na demo.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2" style={fieldStyle}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white border-0" onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
