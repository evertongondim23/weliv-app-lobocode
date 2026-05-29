import type { CompanyInfo } from '../../app/types';

export interface ClinicProfessionalMock {
  id: string;
  name: string;
  professionalTitle?: string;
  specialty: string;
  registrationNumber: string;
  cnpj?: string;
  phone: string;
  email: string;
  address?: string;
  avatar?: string;
  status: 'attending' | 'available' | 'absent' | 'day_off';
  todayAppointments: number;
  weekAppointments: number;
  consultationPrice: number;
  acceptsInsurance: boolean;
  insurances?: string;
  biography?: string;
}

export interface ClinicAppointmentSlot {
  professionalId: string;
  hour: string;
  patientName?: string;
  status: 'booked' | 'available' | 'blocked';
}

export interface ClinicPatientMock {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  birthDate?: string;
  healthPlan?: string;
  lastVisit?: string;
  status: 'active' | 'inactive' | 'needs_attention';
  primaryProfessionalId?: string;
  primaryProfessionalName?: string;
  notes?: string;
}

export interface ClinicKpi {
  id: string;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
  gradient: string;
}

export interface ClinicAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface ClinicChargeMock {
  id: string;
  patientName: string;
  amount: number;
  dueDate: string;
  method: 'pix' | 'card' | 'boleto';
  status: 'pending' | 'paid' | 'overdue';
  professionalName: string;
}

// ─── Empresa demo ─────────────────────────────────────────────────────────────

export const MOCK_CLINIC: CompanyInfo = {
  id: 'company-weliv-demo',
  name: 'Clínica Weliv Demo',
  units: [
    { id: 'unit-centro', name: 'Filial Centro', code: 'CTR', address: 'Av. Paulista, 1000 — São Paulo, SP', isActive: true },
    { id: 'unit-norte', name: 'Filial Norte', code: 'NTE', address: 'R. das Flores, 250 — São Paulo, SP', isActive: true },
    { id: 'unit-sul', name: 'Filial Sul', code: 'SUL', address: 'Av. Brasil, 500 — São Paulo, SP', isActive: true },
  ],
};

/** Profissionais vinculados a cada unidade (unitId → professionalIds[]). */
export const MOCK_UNIT_PROFESSIONALS: Record<string, string[]> = {
  'unit-centro': ['prof-1', 'prof-2', 'prof-3'],
  'unit-norte': ['prof-4', 'prof-5'],
  'unit-sul': ['prof-6'],
};

// ─── Profissionais ─────────────────────────────────────────────────────────────

export const MOCK_PROFESSIONALS: ClinicProfessionalMock[] = [
  {
    id: 'prof-1',
    name: 'Dra. Ana Silva',
    professionalTitle: 'Dra.',
    specialty: 'Cardiologia',
    registrationNumber: 'CRM 123456/SP',
    phone: '(11) 99999-0001',
    email: 'ana.silva@clinica.com',
    address: 'Av. Paulista, 1000 — São Paulo, SP',
    status: 'attending',
    todayAppointments: 8,
    weekAppointments: 32,
    consultationPrice: 350,
    acceptsInsurance: true,
    insurances: 'Unimed, Bradesco Saúde, SulAmérica',
    biography: 'Cardiologista com 12 anos de experiência, especializada em cardiologia intervencionista e prevenção cardiovascular.',
  },
  {
    id: 'prof-2',
    name: 'Dr. Bruno Costa',
    professionalTitle: 'Dr.',
    specialty: 'Psicologia',
    registrationNumber: 'CRP 07/12345',
    phone: '(11) 99999-0002',
    email: 'bruno.costa@clinica.com',
    status: 'available',
    todayAppointments: 4,
    weekAppointments: 20,
    consultationPrice: 280,
    acceptsInsurance: false,
    biography: 'Psicólogo clínico com abordagem cognitivo-comportamental, atendimento a adultos e adolescentes.',
  },
  {
    id: 'prof-3',
    name: 'Dra. Carla Melo',
    professionalTitle: 'Dra.',
    specialty: 'Dermatologia',
    registrationNumber: 'CRM 654321/SP',
    phone: '(11) 99999-0003',
    email: 'carla.melo@clinica.com',
    status: 'available',
    todayAppointments: 6,
    weekAppointments: 24,
    consultationPrice: 400,
    acceptsInsurance: true,
    insurances: 'Amil, Hapvida',
  },
  {
    id: 'prof-4',
    name: 'Dr. Diego Ramos',
    professionalTitle: 'Dr.',
    specialty: 'Ortopedia',
    registrationNumber: 'CRM 789012/SP',
    phone: '(11) 99999-0004',
    email: 'diego.ramos@clinica.com',
    status: 'day_off',
    todayAppointments: 0,
    weekAppointments: 18,
    consultationPrice: 420,
    acceptsInsurance: true,
    insurances: 'Unimed',
  },
  {
    id: 'prof-5',
    name: 'Dra. Elena Ferreira',
    professionalTitle: 'Dra.',
    specialty: 'Ginecologia',
    registrationNumber: 'CRM 345678/SP',
    phone: '(11) 99999-0005',
    email: 'elena.ferreira@clinica.com',
    status: 'absent',
    todayAppointments: 0,
    weekAppointments: 15,
    consultationPrice: 380,
    acceptsInsurance: false,
  },
  {
    id: 'prof-6',
    name: 'Dr. Felipe Souza',
    professionalTitle: 'Dr.',
    specialty: 'Neurologia',
    registrationNumber: 'CRM 901234/SP',
    phone: '(11) 99999-0006',
    email: 'felipe.souza@clinica.com',
    status: 'attending',
    todayAppointments: 5,
    weekAppointments: 22,
    consultationPrice: 450,
    acceptsInsurance: true,
    insurances: 'Bradesco Saúde, Porto Seguro',
    biography: 'Neurologista com foco em cefaléias, epilepsia e doenças neurodegenerativas.',
  },
];

// ─── Slots de hoje (agenda-strip) ─────────────────────────────────────────────

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

function makeSlots(professionalId: string, bookedHours: string[]): ClinicAppointmentSlot[] {
  const PATIENT_NAMES = ['João Santos', 'Maria Oliveira', 'Pedro Lima', 'Ana Carvalho', 'Carlos Neves', 'Lucia Ferraz', 'Ricardo Alves', 'Juliana Costa'];
  let nameIdx = 0;
  return HOURS.map((hour) => {
    if (bookedHours.includes(hour)) {
      return { professionalId, hour, patientName: PATIENT_NAMES[nameIdx++ % PATIENT_NAMES.length], status: 'booked' };
    }
    if (hour === '12:00') return { professionalId, hour, status: 'blocked' };
    return { professionalId, hour, status: 'available' };
  });
}

export const MOCK_TODAY_SLOTS: ClinicAppointmentSlot[] = [
  ...makeSlots('prof-1', ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']),
  ...makeSlots('prof-2', ['09:00', '10:00', '14:00', '15:00']),
  ...makeSlots('prof-3', ['08:00', '10:00', '11:00', '14:00', '15:00', '16:00']),
  ...makeSlots('prof-6', ['08:00', '09:00', '11:00', '14:00', '17:00']),
];

// ─── KPIs do dashboard ────────────────────────────────────────────────────────

export const MOCK_CLINIC_KPIS: ClinicKpi[] = [
  {
    id: 'consultations_today',
    label: 'Consultas hoje',
    value: 23,
    trend: 'up',
    trendLabel: '+3 vs ontem',
    gradient: 'linear-gradient(135deg, #FFA500, #FF8C00)',
  },
  {
    id: 'active_professionals',
    label: 'Profissionais ativos',
    value: 4,
    trend: 'stable',
    trendLabel: '2 ausentes',
    gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
  },
  {
    id: 'patients_today',
    label: 'Pacientes do dia',
    value: 18,
    trend: 'up',
    trendLabel: '+5 vs ontem',
    gradient: 'linear-gradient(135deg, #FFC700, #FF8C00)',
  },
  {
    id: 'revenue_week',
    label: 'Receita na semana',
    value: 'R$ 12.400',
    trend: 'up',
    trendLabel: '+12% vs semana anterior',
    gradient: 'linear-gradient(135deg, #34d399, #10b981)',
  },
];

// ─── Alertas ──────────────────────────────────────────────────────────────────

export const MOCK_CLINIC_ALERTS: ClinicAlert[] = [
  {
    id: 'alert-1',
    title: '3 consultas sem confirmação',
    description: 'Dr. Bruno Costa — horários das 14h, 15h e 16h',
    severity: 'warning',
  },
  {
    id: 'alert-2',
    title: '5 pacientes na fila de espera',
    description: 'Cardiologia — Dra. Ana Silva está com agenda lotada',
    severity: 'info',
  },
  {
    id: 'alert-3',
    title: '2 documentos pendentes de upload',
    description: 'Laudos sem arquivo anexo — ação necessária',
    severity: 'critical',
  },
];

// ─── Pacientes ────────────────────────────────────────────────────────────────

export const MOCK_CLINIC_PATIENTS: ClinicPatientMock[] = [
  { id: 'pat-1', name: 'João Santos', cpf: '111.222.333-44', phone: '(11) 98888-0001', email: 'joao.santos@email.com', healthPlan: 'Unimed', lastVisit: '2026-05-20', status: 'active', primaryProfessionalName: 'Dra. Ana Silva' },
  { id: 'pat-2', name: 'Maria Oliveira', cpf: '222.333.444-55', phone: '(11) 98888-0002', email: 'maria.oliveira@email.com', healthPlan: 'Bradesco Saúde', lastVisit: '2026-05-22', status: 'active', primaryProfessionalName: 'Dr. Bruno Costa' },
  { id: 'pat-3', name: 'Pedro Lima', cpf: '333.444.555-66', phone: '(11) 98888-0003', email: 'pedro.lima@email.com', lastVisit: '2026-04-10', status: 'needs_attention', primaryProfessionalName: 'Dra. Carla Melo' },
  { id: 'pat-4', name: 'Ana Carvalho', cpf: '444.555.666-77', phone: '(11) 98888-0004', email: 'ana.carvalho@email.com', healthPlan: 'SulAmérica', lastVisit: '2026-05-25', status: 'active', primaryProfessionalName: 'Dra. Elena Ferreira' },
  { id: 'pat-5', name: 'Carlos Neves', cpf: '555.666.777-88', phone: '(11) 98888-0005', email: 'carlos.neves@email.com', lastVisit: '2026-03-15', status: 'inactive', primaryProfessionalName: 'Dr. Felipe Souza' },
  { id: 'pat-6', name: 'Lúcia Ferraz', cpf: '666.777.888-99', phone: '(11) 98888-0006', email: 'lucia.ferraz@email.com', healthPlan: 'Amil', lastVisit: '2026-05-28', status: 'active', primaryProfessionalName: 'Dr. Diego Ramos' },
];

// ─── Cobranças ────────────────────────────────────────────────────────────────

export const MOCK_CLINIC_CHARGES: ClinicChargeMock[] = [
  { id: 'chr-1', patientName: 'João Santos', amount: 350, dueDate: '2026-05-30', method: 'pix', status: 'pending', professionalName: 'Dra. Ana Silva' },
  { id: 'chr-2', patientName: 'Maria Oliveira', amount: 280, dueDate: '2026-05-28', method: 'card', status: 'paid', professionalName: 'Dr. Bruno Costa' },
  { id: 'chr-3', patientName: 'Pedro Lima', amount: 400, dueDate: '2026-05-15', method: 'boleto', status: 'overdue', professionalName: 'Dra. Carla Melo' },
  { id: 'chr-4', patientName: 'Ana Carvalho', amount: 380, dueDate: '2026-06-02', method: 'pix', status: 'pending', professionalName: 'Dra. Elena Ferreira' },
  { id: 'chr-5', patientName: 'Carlos Neves', amount: 450, dueDate: '2026-06-05', method: 'card', status: 'pending', professionalName: 'Dr. Felipe Souza' },
];
