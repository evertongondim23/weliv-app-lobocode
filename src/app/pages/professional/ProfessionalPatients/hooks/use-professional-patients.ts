import { useState } from 'react';
import { toast } from 'sonner';
import { useData } from '../../../../contexts/DataContext';
import type { Patient } from '../../../../types';
import {
  DELETE_CONFIRM_MESSAGE,
  EMPTY_PATIENT_FORM,
  MOCK_PATIENTS,
} from '../constants/professional-patients.constants';
import type { PatientFormData } from '../types/professional-patients.types';

export function useProfessionalPatients() {
  const { appointments } = useData();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [formData, setFormData] = useState<PatientFormData>(EMPTY_PATIENT_FORM);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm),
  );

  const resetForm = () => {
    setFormData(EMPTY_PATIENT_FORM);
    setSelectedPatient(null);
  };

  const handleEditPatient = () => {
    if (!selectedPatient || !formData.name || !formData.phone || !formData.cpf || !formData.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setPatients(
      patients.map((p) => (p.id === selectedPatient.id ? { ...p, ...formData } : p)),
    );

    setShowEditDialog(false);
    setSelectedPatient(null);
    setFormData(EMPTY_PATIENT_FORM);
    toast.success('Paciente atualizado com sucesso!');
  };

  const handleDeletePatient = (patientId: string) => {
    if (confirm(DELETE_CONFIRM_MESSAGE)) {
      setPatients(patients.filter((p) => p.id !== patientId));
      toast.success('Paciente excluído com sucesso');
    }
  };

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      phone: patient.phone,
      cpf: patient.cpf,
      email: patient.email,
    });
    setShowEditDialog(true);
  };

  const getPatientStats = (patient: Patient) => {
    const patientAppointments = appointments.filter((apt) => apt.patientId === patient.id);
    return {
      total: patientAppointments.length,
      upcoming: patientAppointments.filter(
        (apt) => apt.status === 'scheduled' || apt.status === 'confirmed',
      ).length,
    };
  };

  const handleDialogOpenChange = (open: boolean) => {
    setShowEditDialog(open);
    if (!open) resetForm();
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
    resetForm();
  };

  return {
    search: {
      searchTerm,
      onSearchChange: setSearchTerm,
    },
    list: {
      patients: filteredPatients,
      searchTerm,
      getPatientStats,
      onEdit: openEditDialog,
      onDelete: handleDeletePatient,
    },
    editDialog: {
      open: showEditDialog,
      onOpenChange: handleDialogOpenChange,
      formData,
      setFormData,
      onSubmit: handleEditPatient,
      onCancel: handleCancelEdit,
    },
  };
}
