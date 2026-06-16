/** Telefone adicional do cliente (USA ou Brasil). */
export type ClientOptionalTelephoneCountry = 'BRAZIL' | 'USA';

export type ClientOptionalTelephoneForm = {
  /** Id do registro `OptionalClientTelephone` no servidor (quando já persistido). */
  telephoneId?: string;
  /**
   * Identidade estável no formulário para linhas ainda sem `telephoneId` (novo bloco).
   * Não é enviado à API.
   */
  draftId?: string;
  name: string;
  phone: string;
  country: ClientOptionalTelephoneCountry;
};

/** Payload enviado à API (nomes alinhados ao DTO Nest). */
export type OptionalClientTelephonePayload = {
  id?: string;
  name: string;
  phone: string;
  country: ClientOptionalTelephoneCountry;
};
