import { toast } from 'sonner';
import type {
  MedicalRecord,
  MedicalRecordWriteInput,
} from '../../../../services/medicalRecord.service';
import type { MedicalRecordFormState } from '../types/professional-medical-records.types';

export function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

export function formatBirth(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function toDatetimeLocalValue(iso: string): string {
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

export function emptyForm(): MedicalRecordFormState {
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

export function recordToForm(r: MedicalRecord): MedicalRecordFormState {
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

export function formToWriteInput(f: MedicalRecordFormState): MedicalRecordWriteInput | null {
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
