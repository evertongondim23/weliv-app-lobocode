import type { ComponentType } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserRound,
  Wallet,
  Building2,
  Settings2,
} from 'lucide-react';

export type ClinicNavItem = {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
};

export type ClinicNavGroup = {
  label: string;
  basePath: string;
  icon: ComponentType<{ className?: string }>;
  children: ClinicNavItem[];
};

export const clinicNavGroups: ClinicNavGroup[] = [
  {
    label: 'Visão Geral',
    basePath: '/clinic/dashboard',
    icon: LayoutDashboard,
    children: [
      { label: 'Dashboard', path: '/clinic/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Equipe e Agenda',
    basePath: '/clinic/professionals',
    icon: Users,
    children: [
      { label: 'Profissionais', path: '/clinic/professionals', icon: Users },
      { label: 'Agenda Consolidada', path: '/clinic/schedule', icon: CalendarDays },
    ],
  },
  {
    label: 'Pacientes',
    basePath: '/clinic/patients',
    icon: UserRound,
    children: [
      { label: 'Base de Pacientes', path: '/clinic/patients', icon: UserRound },
    ],
  },
  {
    label: 'Financeiro',
    basePath: '/clinic/financial',
    icon: Wallet,
    children: [
      { label: 'Resumo Financeiro', path: '/clinic/financial', icon: Wallet },
    ],
  },
  {
    label: 'Unidades',
    basePath: '/clinic/units',
    icon: Building2,
    children: [
      { label: 'Gestão de Unidades', path: '/clinic/units', icon: Building2 },
    ],
  },
  {
    label: 'Configurações',
    basePath: '/clinic/settings',
    icon: Settings2,
    children: [
      { label: 'Perfil e Parâmetros', path: '/clinic/settings', icon: Settings2 },
    ],
  },
];

export const clinicRouteTitles = clinicNavGroups
  .flatMap((group) => group.children)
  .reduce<Record<string, string>>((acc, item) => {
    acc[item.path] = item.label;
    return acc;
  }, {});
