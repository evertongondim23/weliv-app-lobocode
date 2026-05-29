import type {
  PaymentConciliationStatus,
  PaymentGateway,
  PaymentMethod,
} from '../../../services/paymentReconciliation.service';

export const statusConfig: Record<
  PaymentConciliationStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  pending_gateway: {
    label: 'Aguardando conciliação',
    color: '#a16207',
    bg: 'rgba(161, 98, 7, 0.1)',
    border: 'rgba(161, 98, 7, 0.35)',
  },
  reconciled: {
    label: 'Conciliado',
    color: '#047857',
    bg: 'rgba(4, 120, 87, 0.1)',
    border: 'rgba(4, 120, 87, 0.35)',
  },
  dispute: {
    label: 'Em disputa',
    color: '#c2410c',
    bg: 'rgba(194, 65, 12, 0.12)',
    border: 'rgba(194, 65, 12, 0.4)',
  },
  refunded: {
    label: 'Estornado',
    color: '#64748b',
    bg: 'rgba(71, 85, 105, 0.12)',
    border: 'rgba(71, 85, 105, 0.35)',
  },
};

export const sortRank: Record<PaymentConciliationStatus, number> = {
  pending_gateway: 0,
  dispute: 1,
  refunded: 2,
  reconciled: 3,
};

export const GATEWAY_FILTER_OPTIONS: { value: 'all' | PaymentGateway; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'Stone', label: 'Stone' },
  { value: 'PagSeguro', label: 'PagSeguro' },
  { value: 'Cielo', label: 'Cielo' },
];

export const METHOD_FILTER_OPTIONS: { value: 'all' | PaymentMethod; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pix', label: 'PIX' },
  { value: 'cartão', label: 'Cartão' },
  { value: 'boleto', label: 'Boleto' },
];
