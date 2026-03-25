import type { ComponentType } from 'react';
import {
  BellRing,
  FolderKanban,
  HandCoins,
  LayoutDashboard,
  Receipt,
  Settings2,
  Stethoscope,
  UserCog,
  Wallet,
  Landmark,
  ScrollText,
} from 'lucide-react';

export type AdminNavItem = {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
};

export type AdminNavGroup = {
  label: string;
  basePath: string;
  icon: ComponentType<{ className?: string }>;
  children: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: 'Visão Geral',
    basePath: '/admin/dashboard',
    icon: LayoutDashboard,
    children: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Pendências', path: '/admin/overview/pending', icon: BellRing },
    ],
  },
  {
    label: 'Operação',
    basePath: '/admin/operation',
    icon: Stethoscope,
    children: [
      { label: 'Atendimentos', path: '/admin/operation/appointments', icon: FolderKanban },
    ],
  },
  {
    label: 'Financeiro',
    basePath: '/admin/financial',
    icon: Wallet,
    children: [
      { label: 'Cobranças e Inadimplência', path: '/admin/financial/charges', icon: Receipt },
      { label: 'Pagamentos', path: '/admin/financial/payments', icon: HandCoins },
      { label: 'Relatórios financeiros', path: '/admin/financial/reports', icon: Landmark },
    ],
  },
  {
    label: 'Administração',
    basePath: '/admin/users',
    icon: Settings2,
    children: [
      { label: 'Usuários', path: '/admin/users', icon: UserCog },
      { label: 'Logs e auditoria', path: '/admin/logs-audit', icon: ScrollText },
      { label: 'Parâmetros do sistema', path: '/admin/settings', icon: Settings2 },
    ],
  },
];

export const adminRouteTitles = adminNavGroups
  .flatMap((group) => group.children)
  .reduce<Record<string, string>>((acc, item) => {
    acc[item.path] = item.label;
    return acc;
  }, {});
