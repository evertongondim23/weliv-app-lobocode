import React, { useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../app/components/ui/card';
import { useClinic } from '../../contexts/ClinicContext';
import type { ClinicChargeMock } from '../../mocks/clinicData';

const METHOD_LABELS: Record<ClinicChargeMock['method'], string> = {
  pix: 'PIX',
  card: 'Cartão',
  boleto: 'Boleto',
};

const STATUS_CONFIG: Record<
  ClinicChargeMock['status'],
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pendente',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    icon: <DollarSign className="size-3.5" />,
  },
  paid: {
    label: 'Pago',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    icon: <CheckCircle2 className="size-3.5" />,
  },
  overdue: {
    label: 'Atrasado',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.1)',
    icon: <AlertCircle className="size-3.5" />,
  },
};

export function ClinicFinancial() {
  const { charges } = useClinic();
  const [statusFilter, setStatusFilter] = useState<ClinicChargeMock['status'] | 'all'>('all');

  const totalPaid = charges.filter((c) => c.status === 'paid').reduce((acc, c) => acc + c.amount, 0);
  const totalPending = charges.filter((c) => c.status === 'pending').reduce((acc, c) => acc + c.amount, 0);
  const totalOverdue = charges.filter((c) => c.status === 'overdue').reduce((acc, c) => acc + c.amount, 0);

  const filtered = charges.filter((c) => statusFilter === 'all' || c.status === statusFilter);

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#4A3728' }}>Financeiro</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B5D53' }}>Resumo de cobranças e receita da clínica</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Recebido', value: totalPaid, gradient: 'linear-gradient(135deg, #34d399, #10b981)', icon: <CheckCircle2 className="size-5 text-white" /> },
          { label: 'A receber', value: totalPending, gradient: 'linear-gradient(135deg, #FFA500, #FF8C00)', icon: <DollarSign className="size-5 text-white" /> },
          { label: 'Em atraso', value: totalOverdue, gradient: 'linear-gradient(135deg, #f87171, #ef4444)', icon: <AlertCircle className="size-5 text-white" /> },
        ].map(({ label, value, gradient, icon }) => (
          <Card key={label} className="border-0 shadow-md overflow-hidden">
            <div className="h-1 w-full" style={{ background: gradient }} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ background: gradient }}>
                {icon}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#6B5D53' }}>{label}</p>
                <p className="text-xl font-bold" style={{ color: '#4A3728' }}>{fmt(value)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue trend placeholder */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(255,165,0,0.12)' }}>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[#FFA500]" />
            <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>Receita — últimos 7 dias</p>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-end gap-2 h-24">
            {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: 'linear-gradient(to top, #FFA500, #FFD700)' }} />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
              <span key={d} className="flex-1 text-center text-[10px]" style={{ color: '#6B5D53' }}>{d}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charges list */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(255,165,0,0.12)' }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>Cobranças</p>
            <div className="flex gap-2">
              {(['all', 'pending', 'paid', 'overdue'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className="rounded-full px-3 py-1 text-xs font-medium border-2 transition-all"
                  style={
                    statusFilter === s
                      ? { background: 'rgba(255,165,0,0.12)', borderColor: '#FFA500', color: '#4A3728' }
                      : { borderColor: 'rgba(74,55,40,0.12)', color: '#6B5D53', background: 'white' }
                  }
                >
                  {s === 'all' ? 'Todos' : STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(74,55,40,0.06)', background: '#FFFDF9' }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Paciente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Profissional</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Vencimento</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Valor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Método</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B5D53' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const sc = STATUS_CONFIG[c.status];
                  return (
                    <tr key={c.id} className="border-b hover:bg-[#FFF8E7] transition-colors" style={{ borderColor: 'rgba(74,55,40,0.06)' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#4A3728' }}>{c.patientName}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#6B5D53' }}>{c.professionalName}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#6B5D53' }}>
                        {new Intl.DateTimeFormat('pt-BR').format(new Date(c.dueDate))}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: '#4A3728' }}>{fmt(c.amount)}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#6B5D53' }}>{METHOD_LABELS[c.method]}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          {sc.icon}
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
