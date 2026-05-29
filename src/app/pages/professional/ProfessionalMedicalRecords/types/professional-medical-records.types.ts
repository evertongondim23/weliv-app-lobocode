import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type {
  MedicalRecord,
  MedicalRecordPdfAttachment,
  MedicationEntry,
} from '../../../../services/medicalRecord.service';

export interface MedicalRecordFormState {
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
}

export interface SearchToolbarSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  count: number;
}

export interface RecordsListSectionProps {
  records: MedicalRecord[];
  selectedId: string | null;
  onSelect: (record: MedicalRecord) => void;
}

export interface MedicalRecordCardProps {
  record: MedicalRecord;
  isSelected: boolean;
  onSelect: (record: MedicalRecord) => void;
}

export interface PatientRecordSectionProps {
  record: MedicalRecord;
  onEdit: (record: MedicalRecord) => void;
  onDelete: (record: MedicalRecord) => void;
  onClose: () => void;
  onPdfUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onPdfRemove: (attachmentId: string) => void;
}

export interface MedicalHistorySectionProps {
  record: MedicalRecord;
}

export interface AttachmentsSectionProps {
  attachments: MedicalRecordPdfAttachment[];
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (attachmentId: string) => void;
}

export interface MedicalRecordFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  form: MedicalRecordFormState;
  setForm: Dispatch<SetStateAction<MedicalRecordFormState>>;
  addMedRow: () => void;
  removeMedRow: (index: number) => void;
  updateMed: (index: number, patch: Partial<MedicationEntry>) => void;
  onSubmit: () => void;
}

export interface DeleteRecordDialogProps {
  target: MedicalRecord | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}
