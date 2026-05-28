import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import { uploadProfileImage } from '../../../../services/files.service';
import {
  getMyProfessionalProfile,
  patchMyProfessionalProfile,
  type ProfessionalProfile,
  type UpdateProfessionalProfilePayload,
} from '../../../../services/professionals.service';
import { getMyProviderSettings, type ProviderSettings } from '../../../../services/providerSettings.service';
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

function normalizePrice(value: ProviderSettings['consultationPrice']): string {
  if (typeof value === 'number' && Number.isFinite(value)) return value.toFixed(2);
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed.toFixed(2);
  }
  return '0.00';
}

function normalizeDepositPercentage(value: ProviderSettings['depositPercentage']): DepositPercentage {
  if (value === 10) return '10';
  if (value === 30) return '30';
  if (value === 100) return '100';
  return '0';
}

function mapProfileFromApi(profile: ProfessionalProfile): ProfileFormData {
  return {
    name: profile.name ?? '',
    phone: profile.phone ?? '',
    cpf: profile.cpf ?? '',
    cnpj: profile.cnpj ?? profile.professionalCnpj ?? '',
    email: profile.email ?? '',
    address: profile.address ?? profile.professionalAddress ?? '',
    registrationNumber: profile.registrationNumber ?? '',
    specialty: profile.specialty ?? '',
    professionalTitle: profile.professionalTitle ?? '',
    biography: profile.biography ?? '',
  };
}

export function useProfessionalSettings() {
  const { user, authReady, patchUser } = useAuth();
  const { professionals, updateProfessional } = useData();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const localAvatarBlobRef = useRef<string | null>(null);
  const pendingAvatarFileRef = useRef<File | null>(null);

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
    if (!authReady || user?.role !== 'professional' || profileHydrated) return;

    let cancelled = false;

    void getMyProfessionalProfile().then((result) => {
      if (cancelled) return;

      if (result.ok) {
        setProfileData(mapProfileFromApi(result.data));
        setAvatarUrl(result.data.avatarUrl ?? '');
        setProfileHydrated(true);
        return;
      }

      if (professional) {
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
      }
    });

    return () => {
      cancelled = true;
    };
  }, [authReady, user?.role, profileHydrated, professional]);

  useEffect(() => {
    if (!authReady || user?.role !== 'professional') return;

    let cancelled = false;

    void getMyProviderSettings().then((result) => {
      if (cancelled || !result.ok) return;

      const settings = result.data;
      setConsultationPrice(normalizePrice(settings.consultationPrice));
      setAcceptsInsurance(settings.acceptsInsurance ?? false);
      setInsurances(Array.isArray(settings.insurances) ? settings.insurances : []);
      setRemarcationEnabled(settings.remarcationEnabled ?? false);
      setRemarcationLimit(String(settings.remarcationLimit ?? 0));
      setDepositPercentage(normalizeDepositPercentage(settings.depositPercentage));
      setWaitingListEnabled(settings.waitingListEnabled ?? false);
    });

    return () => {
      cancelled = true;
    };
  }, [authReady, user?.role]);

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
    pendingAvatarFileRef.current = file;
    setAvatarUrl(url);
    toast.success('Foto atualizada na pré-visualização. Salve para confirmar.');
  };

  const handleClearAvatar = () => {
    if (localAvatarBlobRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(localAvatarBlobRef.current);
      localAvatarBlobRef.current = null;
    }
    pendingAvatarFileRef.current = null;
    setAvatarUrl('');
    toast.info('Foto removida na pré-visualização. Salve para confirmar.');
  };

  const handleSaveProfile = async () => {
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

    const payload: UpdateProfessionalProfilePayload = {
      name: profileData.name.trim(),
      email: profileData.email.trim(),
      cpf: profileData.cpf.trim(),
      phone: profileData.phone.trim(),
      cnpj: profileData.cnpj.trim(),
      address: profileData.address.trim(),
      registrationNumber: profileData.registrationNumber.trim(),
      specialty: profileData.specialty.trim(),
      professionalTitle: profileData.professionalTitle.trim(),
      biography: profileData.biography.trim(),
    };

    let avatarUrlToSave = avatarUrl.trim();

    if (pendingAvatarFileRef.current) {
      const uploadResult = await uploadProfileImage(pendingAvatarFileRef.current);
      if (!uploadResult.ok) {
        if (uploadResult.kind === 'unauthorized') {
          toast.error('Sessão expirada. Faça login novamente.');
        } else if (uploadResult.kind === 'network') {
          toast.error('Não foi possível enviar a foto.');
        } else {
          toast.error(uploadResult.message ?? 'Não foi possível enviar a foto.');
        }
        return;
      }

      avatarUrlToSave = uploadResult.data.url;
      if (localAvatarBlobRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(localAvatarBlobRef.current);
        localAvatarBlobRef.current = null;
      }
      pendingAvatarFileRef.current = null;
      setAvatarUrl(avatarUrlToSave);
    }

    payload.avatarUrl = avatarUrlToSave;

    const result = await patchMyProfessionalProfile(payload);

    if (!result.ok) {
      if (result.kind === 'unauthorized') {
        toast.error('Sessão expirada. Faça login novamente.');
      } else if (result.kind === 'network') {
        toast.error('Não foi possível conectar à API.');
      } else {
        toast.error(result.message ?? 'Não foi possível salvar o perfil.');
      }
      return;
    }

    const saved = result.data;
    setProfileData(mapProfileFromApi(saved));
    setAvatarUrl(saved.avatarUrl ?? '');

    updateProfessional(user.id, {
      name: saved.name,
      phone: saved.phone ?? '',
      cpf: saved.cpf ?? '',
      email: saved.email,
      cnpj: saved.cnpj ?? saved.professionalCnpj ?? undefined,
      address: saved.address ?? saved.professionalAddress ?? '',
      registrationNumber: saved.registrationNumber ?? '',
      specialty: saved.specialty ?? '',
      professionalTitle: saved.professionalTitle ?? undefined,
      biography: saved.biography ?? undefined,
      avatar: saved.avatarUrl || undefined,
    });
    patchUser({
      name: saved.name,
      phone: saved.phone ?? '',
      email: saved.email,
      avatar: saved.avatarUrl || undefined,
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
