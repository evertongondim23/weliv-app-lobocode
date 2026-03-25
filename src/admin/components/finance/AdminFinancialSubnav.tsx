import React from 'react';
import { NavLink } from 'react-router';
import { financeBorderStyle } from '../../utils/financeUi';

const LINKS = [
  { to: '/admin/financial/charges', label: 'Cobranças e Inadimplência' },
  { to: '/admin/financial/payments', label: 'Pagamentos' },
  { to: '/admin/financial/reports', label: 'Relatórios' },
] as const;

/**
 * Navegação local do módulo Financeiro — reduz dependência só da sidebar
 * e deixa explícito o fluxo Cobrança → Pagamento → Risco → Consolidado.
 */
export function AdminFinancialSubnav() {
  return (
    <nav
      aria-label="Seções do financeiro"
      className="flex flex-wrap gap-1 rounded-xl border-2 bg-[#FFFBF0] p-1"
      style={financeBorderStyle}
    >
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
              isActive
                ? 'bg-white text-[#4A3728] shadow-sm border border-[rgba(255,165,0,0.28)]'
                : 'text-[#6B5D53] hover:bg-white/70 border border-transparent',
            ].join(' ')
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
