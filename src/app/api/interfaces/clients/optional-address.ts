/** Endereço adicional do cliente (Brasil) — listagem para OS. */
export type ClientOptionalAddressSummary = {
  id: string;
  cep: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  reference?: string | null;
  city: string;
  state: string;
};
