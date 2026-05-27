import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import type { EditPatientDialogProps } from '../types/professional-patients.types';
import { PatientForm } from './patient-form';

export function EditPatientDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: EditPatientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ color: '#4A3728' }}>Editar Paciente</DialogTitle>
          <DialogDescription>Atualize os dados do paciente</DialogDescription>
        </DialogHeader>
        <PatientForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
