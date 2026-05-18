import type { User } from '../../types';

export type LoginCredentials = {
  /** E-mail ou `login` do utilizador (enviado ao campo `login` do backend). */
  login: string;
  password: string;
};

export type LoginResult =
  | { ok: true; user: User }
  | {
      ok: false;
      reason: 'INVALID_CREDENTIALS' | 'NETWORK_ERROR' | 'WRONG_PORTAL';
      message?: string;
    };
