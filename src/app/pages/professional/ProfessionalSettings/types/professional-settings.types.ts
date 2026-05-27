import type { ChangeEvent, Dispatch, RefObject, SetStateAction } from 'react';
import type { DaySchedule, Professional, User, WeekSchedule } from '../../../../types';

export interface ProfileFormData {
  name: string;
  phone: string;
  cpf: string;
  cnpj: string;
  email: string;
  address: string;
  registrationNumber: string;
  specialty: string;
  professionalTitle: string;
  biography: string;
}

export interface ProfileSectionProps {
  profileData: ProfileFormData;
  setProfileData: Dispatch<SetStateAction<ProfileFormData>>;
  avatarUrl: string;
  avatarInputRef: RefObject<HTMLInputElement | null>;
  onAvatarFile: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearAvatar: () => void;
  onSaveProfile: () => void;
}

export type DepositPercentage = '0' | '10' | '30' | '100';

export interface FinancialSectionProps {
  consultationPrice: string;
  setConsultationPrice: Dispatch<SetStateAction<string>>;
  acceptsInsurance: boolean;
  setAcceptsInsurance: Dispatch<SetStateAction<boolean>>;
  insurances: string[];
  newInsurance: string;
  setNewInsurance: Dispatch<SetStateAction<string>>;
  remarcationEnabled: boolean;
  setRemarcationEnabled: Dispatch<SetStateAction<boolean>>;
  remarcationLimit: string;
  setRemarcationLimit: Dispatch<SetStateAction<string>>;
  depositPercentage: DepositPercentage;
  setDepositPercentage: Dispatch<SetStateAction<DepositPercentage>>;
  waitingListEnabled: boolean;
  setWaitingListEnabled: Dispatch<SetStateAction<boolean>>;
  onAddInsurance: () => void;
  onRemoveInsurance: (index: number) => void;
  onSaveFinancial: () => void;
}

export interface ScheduleSectionProps {
  schedule: WeekSchedule;
  updateSchedule: (day: string, updates: Partial<DaySchedule>) => void;
  onSaveSchedule: () => void;
}

export interface ProfessionalSettingsGuards {
  user: User | null;
  authReady: boolean;
  professional: Professional | undefined;
}
