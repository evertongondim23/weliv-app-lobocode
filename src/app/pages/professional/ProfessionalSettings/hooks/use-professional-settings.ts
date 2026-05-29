import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import type { DaySchedule } from '../../../../types';
import {
  AVATAR_MAX_BYTES,
  DEFAULT_INSURANCES,
  DEFAULT_WEEK_SCHEDULE,
  MAX_BIOGRAPHY,
  MAX_PROFESSIONAL_TITLE,
} from '../constants/professional-settings.constants';
import type {
  DepositPercentage,
  ProfileFormData,
  ProfessionalSettingsGuards,
} from '../types/professional-settings.types';

const EMPTY_PROFILE: ProfileFormData = {
  name: '',
  phone: '',
  cpf: '',
  cnpj: '',
  email: '',
  address: '',
  registrationNumber: '',
  specialty: '',
  professionalTitle: '',
  biography: '',
};

export function useProfessionalSettings() {
  const { user, authReady, patchUser } = useAuth();
  const { professionals, updateProfessional } = useData();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const localAvatarBlobRef = useRef<string | null>(null);

  const professional = professionals.find((p) => p.id === user?.id);

  const [profileHydrated, setProfileHydrated] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData>(EMPTY_PROFILE);
  const [avatarUrl, setAvatarUrl] = useState('');

  const [consultationPrice, setConsultationPrice] = useState('250.00');
  const [acceptsInsurance, setAcceptsInsurance] = useState(true);
  const [insurances, setInsurances] = useState<string[]>([...DEFAULT_INSURANCES]);
  const [newInsurance, setNewInsurance] = useState('');

  const [remarcationEnabled, setRemarcationEnabled] = useState(true);
  const [remarcationLimit, setRemarcationLimit] = useState('3');
  const [depositPercentage, setDepositPercentage] = useState<DepositPercentage>('30');
  const [waitingListEnabled, setWaitingListEnabled] = useState(true);

  const [schedule, setSchedule] = useState({ ...DEFAULT_WEEK_SCHEDULE });

  useEffect(() => {
    setProfileHydrated(false);
  }, [user?.id]);

  useEffect(() => {
    if (!professional || profileHydrated) return;
    setProfileData({
      name: professional.name,
      phone: professional.phone,
      cpf: professional.cpf,
      cnpj: professional.cnpj ?? '',
      email: professional.email,
      address: professional.address,
      registrationNumber: professional.registrationNumber,
      specialty: professional.specialty,
      professionalTitle: professional.professionalTitle ?? '',
      biography: professional.biography ?? '',
    });
    setAvatarUrl(professional.avatar ?? '');
    setProfileHydrated(true);
  }, [professional, profileHydrated]);

  const handleAvatarFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Envie uma imagem (JPG, PNG ou WebP).');
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      toast.error('A imagem deve ter no máximo 2 MB.');
      return;
    }
    if (localAvatarBlobRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(localAvatarBlobRef.current);
    }
    const url = URL.createObjectURL(file);
    localAvatarBlobRef.current = url;
    setAvatarUrl(url);
    toast.success('Foto atualizada na pré-visualização. Salve para confirmar.');
  };

  const handleClearAvatar = () => {
    if (localAvatarBlobRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(localAvatarBlobRef.current);
      localAvatarBlobRef.current = null;
    }
    setAvatarUrl('');
    toast.info('Foto removida na pré-visualização. Salve para confirmar.');
  };

  const handleSaveProfile = () => {
    if (!user || user.role !== 'professional') {
      toast.error('Faça login como profissional.');
      return;
    }
    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast.error('Preencha nome e e-mail.');
      return;
    }
    if (profileData.professionalTitle.length > MAX_PROFESSIONAL_TITLE) {
      toast.error(`Título: no máximo ${MAX_PROFESSIONAL_TITLE} caracteres.`);
      return;
    }
    if (profileData.biography.length > MAX_BIOGRAPHY) {
      toast.error(`Biografia: no máximo ${MAX_BIOGRAPHY} caracteres.`);
      return;
    }

    updateProfessional(user.id, {
      name: profileData.name.trim(),
      phone: profileData.phone.trim(),
      cpf: profileData.cpf.trim(),
      email: profileData.email.trim(),
      cnpj: profileData.cnpj.trim() || undefined,
      address: profileData.address.trim(),
      registrationNumber: profileData.registrationNumber.trim(),
      specialty: profileData.specialty.trim(),
      professionalTitle: profileData.professionalTitle.trim() || undefined,
      biography: profileData.biography.trim() || undefined,
      avatar: avatarUrl || undefined,
    });
    patchUser({
      name: profileData.name.trim(),
      phone: profileData.phone.trim(),
      email: profileData.email.trim(),
      avatar: avatarUrl || undefined,
    });
    toast.success('Perfil público e dados cadastrais salvos.');
  };

  const handleSaveFinancial = () => {
    toast.success('Configurações financeiras atualizadas!');
  };

  const handleSaveSchedule = () => {
    toast.success('Horários atualizados com sucesso!');
  };

  const handleAddInsurance = () => {
    if (newInsurance.trim()) {
      setInsurances([...insurances, newInsurance.trim()]);
      setNewInsurance('');
      toast.success('Convênio adicionado');
    }
  };

  const handleRemoveInsurance = (index: number) => {
    setInsurances(insurances.filter((_, i) => i !== index));
    toast.success('Convênio removido');
  };

  const updateSchedule = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }));
  };

  useEffect(() => {
    return () => {
      if (localAvatarBlobRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(localAvatarBlobRef.current);
      }
    };
  }, []);

  const guards: ProfessionalSettingsGuards = { user, authReady, professional };

  return {
    guards,
    profile: {
      profileData,
      setProfileData,
      avatarUrl,
      avatarInputRef,
      onAvatarFile: handleAvatarFile,
      onClearAvatar: handleClearAvatar,
      onSaveProfile: handleSaveProfile,
    },
    financial: {
      consultationPrice,
      setConsultationPrice,
      acceptsInsurance,
      setAcceptsInsurance,
      insurances,
      newInsurance,
      setNewInsurance,
      remarcationEnabled,
      setRemarcationEnabled,
      remarcationLimit,
      setRemarcationLimit,
      depositPercentage,
      setDepositPercentage,
      waitingListEnabled,
      setWaitingListEnabled,
      onAddInsurance: handleAddInsurance,
      onRemoveInsurance: handleRemoveInsurance,
      onSaveFinancial: handleSaveFinancial,
    },
    schedule: {
      schedule,
      updateSchedule,
      onSaveSchedule: handleSaveSchedule,
    },
  };
}
