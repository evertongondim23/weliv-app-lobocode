import React from 'react';
import { Banknote, CreditCard, QrCode } from 'lucide-react';

/** Meio de pagamento alinhado entre Cobranças, Pagamentos e mocks. */
export type FinancePaymentMethod = 'pix' | 'cartão' | 'boleto';

export function PaymentMethodCell({ method }: { method: FinancePaymentMethod }) {
  const Icon = method === 'pix' ? QrCode : method === 'boleto' ? Banknote : CreditCard;
  const label = method === 'pix' ? 'PIX' : method === 'boleto' ? 'Boleto' : 'Cartão';
  return (
    <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: '#4A3728' }}>
      <Icon className="size-4 text-[#6B5D53]" aria-hidden />
      {label}
    </span>
  );
}

export function financeMethodLabel(method: FinancePaymentMethod): string {
  return method === 'pix' ? 'PIX' : method === 'boleto' ? 'Boleto' : 'Cartão';
}
