import { format } from 'date-fns';
import {
  User,
  Professional,
  Patient,
  Appointment,
  Document,
  Notification,
  Payment,
  BlockedTime,
  PatientSlotStatus,
} from '../types';

export const mockProfessionals: Professional[] = [
  {
    id: 'prof1',
    name: 'Dra. Ana Silva',
    email: 'ana.silva@clinica.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    role: 'professional',
    professionalTitle: 'Dra. — CRM 123456 · Cardiologia clínica e preventiva',
    biography:
      'Cardiologista focada em prevenção e manejo de fatores de risco. Atendimento humanizado com explicação clara do plano terapêutico.',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    registrationNumber: 'CRM 123456',
    specialty: 'Cardiologia',
    consultationPrice: 350,
    acceptsInsurance: true,
    insurances: ['Unimed', 'SulAmérica', 'Bradesco Saúde'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    availableSchedule: {
      monday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      tuesday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      wednesday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      thursday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      friday: { enabled: true, start: '08:00', end: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      saturday: { enabled: false, start: '', end: '' },
      sunday: { enabled: false, start: '', end: '' },
    },
    blockedTimes: [],
    remarcationEnabled: true,
    remarcationLimit: 3,
    waitingListEnabled: true,
    depositPercentage: 30,
  },
  {
    id: 'prof2',
    name: 'Dr. Carlos Mendes',
    email: 'carlos.mendes@clinica.com',
    phone: '(11) 98765-4322',
    cpf: '987.654.321-00',
    role: 'professional',
    address: 'Rua Augusta, 500 - São Paulo, SP',
    registrationNumber: 'CRM 654321',
    specialty: 'Ortopedia',
    consultationPrice: 400,
    acceptsInsurance: true,
    insurances: ['Unimed', 'Amil'],
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    availableSchedule: {
      monday: { enabled: true, start: '09:00', end: '17:00' },
      tuesday: { enabled: true, start: '09:00', end: '17:00' },
      wednesday: { enabled: true, start: '09:00', end: '17:00' },
      thursday: { enabled: true, start: '09:00', end: '17:00' },
      friday: { enabled: true, start: '09:00', end: '16:00' },
      saturday: { enabled: true, start: '09:00', end: '13:00' },
      sunday: { enabled: false, start: '', end: '' },
    },
    blockedTimes: [],
    remarcationEnabled: true,
    remarcationLimit: 2,
    waitingListEnabled: false,
    depositPercentage: 10,
  },
  {
    id: 'prof3',
    name: 'Dra. Beatriz Costa',
    email: 'beatriz.costa@clinica.com',
    phone: '(11) 98765-4323',
    cpf: '456.789.123-00',
    role: 'professional',
    address: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
    registrationNumber: 'CRM 789123',
    specialty: 'Dermatologia',
    consultationPrice: 300,
    acceptsInsurance: false,
    insurances: [],
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    availableSchedule: {
      monday: { enabled: true, start: '10:00', end: '19:00', lunchStart: '13:00', lunchEnd: '14:00' },
      tuesday: { enabled: true, start: '10:00', end: '19:00', lunchStart: '13:00', lunchEnd: '14:00' },
      wednesday: { enabled: false, start: '', end: '' },
      thursday: { enabled: true, start: '10:00', end: '19:00', lunchStart: '13:00', lunchEnd: '14:00' },
      friday: { enabled: true, start: '10:00', end: '19:00', lunchStart: '13:00', lunchEnd: '14:00' },
      saturday: { enabled: true, start: '09:00', end: '14:00' },
      sunday: { enabled: false, start: '', end: '' },
    },
    blockedTimes: [],
    remarcationEnabled: false,
    remarcationLimit: 0,
    waitingListEnabled: true,
    depositPercentage: 100,
  },
];

export const mockPatients: Patient[] = [
  {
    id: 'patient1',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    phone: '(11) 91234-5678',
    cpf: '111.222.333-44',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    appointments: [],
    documents: [],
  },
];

export const mockAdmins: User[] = [
  {
    id: 'admin1',
    name: 'Admin Weliv',
    email: 'admin@weliv.com',
    phone: '(11) 90000-0000',
    cpf: '000.000.000-00',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    patientId: 'patient1',
    professionalId: 'prof1',
    date: '2026-03-25',
    time: '09:00',
    type: 'presencial',
    status: 'scheduled',
    remarcationCount: 0,
    depositPaid: true,
    depositAmount: 105,
    createdAt: '2026-03-20T10:30:00Z',
  },
  {
    id: 'apt2',
    patientId: 'patient1',
    professionalId: 'prof2',
    date: '2026-03-22',
    time: '14:00',
    type: 'presencial',
    status: 'confirmed',
    remarcationCount: 1,
    depositPaid: true,
    depositAmount: 40,
    createdAt: '2026-03-15T14:20:00Z',
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'doc1',
    patientId: 'patient1',
    professionalId: 'prof1',
    appointmentId: 'apt1',
    type: 'exam',
    name: 'Eletrocardiograma.pdf',
    url: '#',
    uploadedAt: '2026-03-18T10:00:00Z',
    status: 'ready',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'not1',
    userId: 'patient1',
    title: 'Consulta confirmada',
    message: 'Sua consulta com Dra. Ana Silva foi confirmada para 25/03/2026 às 09:00',
    type: 'appointment',
    read: true,
    createdAt: '2026-03-20T10:30:00Z',
    actionUrl: '/patient/appointments',
  },
  {
    id: 'not2',
    userId: 'patient1',
    title: 'Exame disponível',
    message: 'Seu eletrocardiograma está disponível para visualização',
    type: 'document',
    read: false,
    createdAt: '2026-03-18T10:00:00Z',
    actionUrl: '/patient/documents',
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'pay1',
    appointmentId: 'apt1',
    patientId: 'patient1',
    professionalId: 'prof1',
    amount: 105,
    method: 'pix',
    status: 'paid',
    paidAt: '2026-03-20T10:32:00Z',
  },
];

function parseTimeToMinutes(t: string): number {
  if (t === '24:00') return 24 * 60;
  const [h, m] = t.split(':').map(Number);
  if (Number.isNaN(h)) return 0;
  return h * 60 + (Number.isNaN(m) ? 0 : m);
}

/** Verifica se o intervalo do slot (30 min a partir de slotStart) sobrepõe um bloqueio. */
export function isSlotBlocked(dateStr: string, slotStart: string, blocks: BlockedTime[]): boolean {
  return blocks.some((b) => {
    if (b.date !== dateStr) return false;
    const slotStartM = parseTimeToMinutes(slotStart);
    const slotEndM = slotStartM + 30;
    const blockStartM = parseTimeToMinutes(b.start);
    let blockEndM = parseTimeToMinutes(b.end);
    if (blockEndM <= blockStartM && b.end !== '00:00') {
      blockEndM += 24 * 60;
    }
    return slotStartM < blockEndM && slotEndM > blockStartM;
  });
}

/** Todos os slots da grade do profissional na data (sem considerar bloqueios nem reservas). */
export function getSlotsFromWeeklySchedule(professional: Professional, date: Date): string[] {
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
  const schedule = professional.availableSchedule[dayOfWeek];

  if (!schedule?.enabled) return [];

  const slots: string[] = [];
  const [startHour, startMin] = schedule.start.split(':').map(Number);
  const [endHour, endMin] = schedule.end.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

    if (schedule.lunchStart && schedule.lunchEnd) {
      const [lunchStartH, lunchStartM] = schedule.lunchStart.split(':').map(Number);
      const [lunchEndH, lunchEndM] = schedule.lunchEnd.split(':').map(Number);

      const isLunchTime =
        (currentHour > lunchStartH || (currentHour === lunchStartH && currentMin >= lunchStartM)) &&
        (currentHour < lunchEndH || (currentHour === lunchEndH && currentMin < lunchEndM));

      if (!isLunchTime) {
        slots.push(timeStr);
      }
    } else {
      slots.push(timeStr);
    }

    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour++;
    }
  }

  return slots;
}

/** Horários em que o paciente pode marcar (exclui bloqueios do profissional; reservas tratadas na tela). */
export function generateAvailableSlots(professional: Professional, date: Date): string[] {
  const dateStr = format(date, 'yyyy-MM-dd');
  return getSlotsFromWeeklySchedule(professional, date).filter(
    (s) => !isSlotBlocked(dateStr, s, professional.blockedTimes),
  );
}

/** Grade completa para o fluxo do paciente: disponível, bloqueado pelo profissional ou já reservado. */
export function getPatientSlotAvailability(
  professional: Professional,
  date: Date,
  bookedTimes: string[],
): { slot: string; status: PatientSlotStatus }[] {
  const dateStr = format(date, 'yyyy-MM-dd');
  return getSlotsFromWeeklySchedule(professional, date).map((slot) => {
    if (isSlotBlocked(dateStr, slot, professional.blockedTimes)) {
      return { slot, status: 'blocked' };
    }
    if (bookedTimes.includes(slot)) {
      return { slot, status: 'booked' };
    }
    return { slot, status: 'available' };
  });
}
