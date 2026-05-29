import type { Patient } from '../../../../types';
import type { PatientFormData } from '../types/professional-patients.types';

export const CARD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const FIELD_BORDER_STYLE = { borderColor: 'rgba(255, 165, 0, 0.2)' } as const;

export const PRIMARY_ACTION_STYLE = { background: 'linear-gradient(135deg, #FFA500, #FF8C00)' } as const;

export const AVATAR_BORDER_STYLE = { borderColor: '#FFA500' } as const;

export const AVATAR_FALLBACK_STYLE = {
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
  color: 'white',
} as const;

export const DELETE_CONFIRM_MESSAGE = 'Tem certeza que deseja excluir este paciente?';

export const EMPTY_PATIENT_FORM: PatientFormData = {
  name: '',
  phone: '',
  cpf: '',
  email: '',
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    role: 'patient',
    appointments: ['apt1', 'apt2'],
    documents: ['doc1'],
  },
  {
    id: 'p2',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    phone: '(11) 91234-5678',
    cpf: '987.654.321-00',
    role: 'patient',
    appointments: ['apt3'],
    documents: [],
  },
];
