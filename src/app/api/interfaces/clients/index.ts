import type {
  ClientOptionalTelephoneCountry,
  ClientOptionalTelephoneForm,
  OptionalClientTelephonePayload,
} from './optional-telephone';

/**
 * Cliente no app após `clients.service` (endereços JSON normalizados para objeto com rua/cidade/etc.;
 * escalares com os mesmos nomes do backend / Prisma).
 */
export type BrazilOptionalAddressForm = {
  /** Id do registro `OptionalClientAddresses` no servidor (quando já persistido). */
  addressId?: string;
  /**
   * Identidade estável no formulário para linhas ainda sem `addressId` (novo bloco).
   * Não é enviado à API.
   */
  draftId?: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  referencia: string;
  cidade: string;
  estado: string;
};

/** Payload enviado à API (nomes alinhados ao DTO Nest). */
export type OptionalClientAddressPayload = {
  /** Id existente — no PATCH o backend atualiza o registro em vez de criar outro. */
  id?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  reference?: string;
  city: string;
  state: string;
};

export interface Client {
  id: string;
  usaName: string;
  usaCpf: string;
  usaPhone: string;
  usaAddress: Record<string, unknown>;
  brazilName: string;
  brazilCpf: string;
  brazilPhone: string;
  brazilAddress: Record<string, unknown>;
  optionalBrazilAddresses?: BrazilOptionalAddressForm[];
  optionalClientTelephones?: ClientOptionalTelephoneForm[];
  user?: {
    id: string;
    name: string;
  };
  createdAt: string;
  status: "ACTIVE" | "INACTIVE";
}

/** Obrigatórios: `usaName` e `userId` (atendente); os restantes campos são opcionais. */
export interface CreateClientsDTO {
  companyId?: string;
  usaName: string;
  usaCpf?: string;
  usaPhone?: string;
  usaAddress?: {
    rua: string;
    cidade: string;
    estado: string;
    zipCode: string;
    complemento: string;
  };
  brazilName?: string;
  brazilCpf?: string;
  brazilPhone?: string;
  brazilAddress?: {
    rua: string;
    numero: string;
    bairro: string;
    referencia?: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento: string;
  };
  userId: string;
  status?: 'ACTIVE' | 'INACTIVE';
  optionalClientAddresses?: OptionalClientAddressPayload[];
  optionalClientTelephones?: OptionalClientTelephonePayload[];
}

export interface ClientHistoryItem {
  id: string;
  clientId: string;
  entityId: string | null;
  entityType: string | null;
  actionType: string | null;
  message: string;
  owner: { id: string; name: string };
  createdAt: string;
}

export interface HistoryPagination {
  data: ClientHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Resposta de `POST /clients/import` (planilha Controle de Entregas). */
export interface ClientsImportResult {
  created: number;
  skipped: number;
  failed: number;
  totalRows: number;
  errors: Array<{ sheet: string; row: number; message: string }>;
}

export interface ClientBackend {
  id: string;
  companyId: string;
  usaName: string;
  usaCpf: string | null;
  usaPhone: string;
  usaAddress: Record<string, unknown>;
  brazilName: string;
  brazilCpf: string | null;
  brazilPhone: string;
  brazilAddress: Record<string, unknown>;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  user?: { id: string; name: string };
  optionalClientAddresses?: Array<{
    id: string;
    cep: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    reference: string | null;
    city: string;
    state: string;
    clientId?: string;
    companyId?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  optionalClientTelephones?: Array<{
    id: string;
    name: string;
    phone: string;
    country: 'BRAZIL' | 'USA';
    clientId?: string;
    companyId?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
}

export type { ClientOptionalAddressSummary } from './optional-address';
export type {
  ClientOptionalTelephoneForm,
  ClientOptionalTelephoneCountry,
  OptionalClientTelephonePayload,
} from './optional-telephone';
