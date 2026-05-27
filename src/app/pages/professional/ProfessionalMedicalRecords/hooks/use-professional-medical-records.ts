import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import {
  addMedicalRecordPdf,
  createMedicalRecord,
  deleteMedicalRecord,
  listMedicalRecordsByProfessional,
  removeMedicalRecordPdf,
  updateMedicalRecord,
  type MedicalRecord,
  type MedicationEntry,
} from '../../../../services/medicalRecord.service';
import type { MedicalRecordFormState } from '../types/professional-medical-records.types';
import { emptyForm, formToWriteInput, recordToForm } from '../utils/professional-medical-records.utils';

export function useProfessionalMedicalRecords() {
  const { user } = useAuth();
  const { uploadDocument } = useData();
  const professionalId = user?.id ?? '';

  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  const rows = useMemo(
    () => (professionalId ? listMedicalRecordsByProfessional(professionalId) : []),
    [professionalId, refreshKey],
  );

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MedicalRecord | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MedicalRecordFormState>(emptyForm);

  const [deleteTarget, setDeleteTarget] = useState<MedicalRecord | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.patientName.toLowerCase().includes(q) ||
        r.patientCpf.includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.chiefComplaint.toLowerCase().includes(q),
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

  const handlePdfUpload = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (!open) setDeleteTarget(null);
  };

  return {
    professionalId,
    searchToolbar: {
      search,
      onSearchChange: setSearch,
      onCreate: openCreate,
      count: filtered.length,
    },
    workspace: {
      isEmpty: filtered.length === 0,
      hasSearch: !!search.trim(),
      records: filtered,
      selected,
      onSelect: setSelected,
      onCreate: openCreate,
    },
    detail: {
      record: selected,
      onClose: () => setSelected(null),
      onEdit: openEdit,
      onDelete: setDeleteTarget,
      onPdfUpload: handlePdfUpload,
      onPdfRemove: handleRemovePdf,
    },
    formDialog: {
      open: formOpen,
      onOpenChange: setFormOpen,
      editingId,
      form,
      setForm,
      addMedRow,
      removeMedRow,
      updateMed,
      onSubmit: submitForm,
    },
    deleteDialog: {
      target: deleteTarget,
      onOpenChange: handleDeleteDialogOpenChange,
      onConfirm: confirmDelete,
    },
  };
}
