import type { Dispatch, SetStateAction } from 'react';
import type { Patient } from '../../../../types';

export interface PatientFormData {
  name: string;
  phone: string;
  cpf: string;
  email: string;
}

export interface PatientStats {
  total: number;
  upcoming: number;
}

export interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export interface PatientsListSectionProps {
  patients: Patient[];
  searchTerm: string;
  getPatientStats: (patient: Patient) => PatientStats;
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
}

export interface PatientFormProps {
  formData: PatientFormData;
  setFormData: Dispatch<SetStateAction<PatientFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
}

export interface EditPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PatientFormData;
  setFormData: Dispatch<SetStateAction<PatientFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
}
