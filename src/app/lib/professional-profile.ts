import type { Professional, User, WeekSchedule } from '../types';

/** Grade horária padrão para novo perfil profissional (API sem dados locais ainda). */
export const DEFAULT_PROFESSIONAL_WEEK_SCHEDULE: WeekSchedule = {
  monday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  tuesday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  wednesday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  thursday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  friday: { enabled: true, start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  saturday: { enabled: false, start: '08:00', end: '12:00' },
  sunday: { enabled: false, start: '08:00', end: '12:00' },
};

/** Cria entrada de `Professional` alinhada ao utilizador autenticado (JWT / API). */
export function createProfessionalFromUser(
  user: User,
  partial?: Partial<Professional>,
): Professional {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    cpf: user.cpf || '',
    role: 'professional',
    address: partial?.address ?? '',
    registrationNumber: partial?.registrationNumber ?? '',
    specialty: partial?.specialty ?? '',
    consultationPrice: partial?.consultationPrice ?? 250,
    acceptsInsurance: partial?.acceptsInsurance ?? true,
    insurances: partial?.insurances ?? [],
    availableSchedule: partial?.availableSchedule ?? DEFAULT_PROFESSIONAL_WEEK_SCHEDULE,
    blockedTimes: partial?.blockedTimes ?? [],
    remarcationEnabled: partial?.remarcationEnabled ?? true,
    remarcationLimit: partial?.remarcationLimit ?? 3,
    waitingListEnabled: partial?.waitingListEnabled ?? true,
    depositPercentage: partial?.depositPercentage ?? 30,
    avatar: user.avatar ?? partial?.avatar,
    professionalTitle: partial?.professionalTitle,
    biography: partial?.biography,
    cnpj: partial?.cnpj,
  };
}

/** Atualiza nome/contato do perfil local quando o JWT traz dados mais recentes. */
export function mergeProfessionalWithAuthUser(
  professional: Professional,
  user: User,
): Professional {
  return {
    ...professional,
    name: user.name || professional.name,
    email: user.email || professional.email,
    phone: user.phone || professional.phone,
    cpf: user.cpf || professional.cpf,
    avatar: user.avatar ?? professional.avatar,
  };
}
