import { API_BASE_URL } from '../../config/api';
import type { LoginPortal } from '../../lib/auth-routes';

const AUTH_LOGIN_PATHS: Record<LoginPortal, string> = {
  patient: '/auth/login',
  professional: '/auth/login/profissional',
  admin: '/auth/login/admin',
};

export type AuthLoginApiResult =
  | { kind: 'success'; access_token: string; refresh_token?: string }
  | {
      kind: 'rejected';
      status: number;
      error?: string;
      message?: string;
    }
  | { kind: 'offline' };

/**
 * Autenticação por portal: cada URL só aceita o perfil correspondente na API.
 */
export async function requestAuthLogin(
  login: string,
  password: string,
  portal: LoginPortal,
): Promise<AuthLoginApiResult> {
  const path = AUTH_LOGIN_PATHS[portal];
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: login.trim(), password }),
    });

    const text = await res.text();
    let data: Record<string, unknown> = {};
    if (text) {
      try {
        data = JSON.parse(text) as Record<string, unknown>;
      } catch {
        if (!res.ok) {
          return { kind: 'rejected', status: res.status };
        }
        return { kind: 'rejected', status: res.status || 500 };
      }
    }

    if (!res.ok) {
      return {
        kind: 'rejected',
        status: res.status,
        error: typeof data.error === 'string' ? data.error : undefined,
        message: typeof data.message === 'string' ? data.message : undefined,
      };
    }

    const access_token = data.access_token;
    const refresh_token = data.refresh_token;
    if (typeof access_token !== 'string') {
      return { kind: 'rejected', status: res.status || 500 };
    }

    return {
      kind: 'success',
      access_token,
      refresh_token: typeof refresh_token === 'string' ? refresh_token : undefined,
    };
  } catch {
    return { kind: 'offline' };
  }
}
