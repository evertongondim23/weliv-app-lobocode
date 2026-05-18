import { buildUserFromAccessToken } from '../../lib/auth-token';
import type { LoginPortal } from '../../lib/auth-routes';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  CURRENT_USER_KEY,
  clearAuthStorage,
} from './auth-storage';
import type { LoginCredentials, LoginResult } from './login-types';
import { requestAuthLogin } from './request-auth-login';

/**
 * Chama a API, persiste tokens e utilizador derivado do JWT em `localStorage`.
 * Não atualiza estado React — o `AuthProvider` deve chamar `setUser` em caso de sucesso.
 */
export async function persistSessionFromLogin(
  { login: loginValue, password }: LoginCredentials,
  portal: LoginPortal,
): Promise<LoginResult> {
  const data = await requestAuthLogin(loginValue, password, portal);

  if (data.kind === 'offline') {
    return { ok: false, reason: 'NETWORK_ERROR' };
  }

  if (data.kind !== 'success') {
    if (data.status === 403 && data.error === 'LOGIN_PORTAL_MISMATCH') {
      return {
        ok: false,
        reason: 'WRONG_PORTAL',
        message: data.message,
      };
    }
    return {
      ok: false,
      reason: 'INVALID_CREDENTIALS',
      message: data.message,
    };
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  }

  const fromJwt = buildUserFromAccessToken(data.access_token);
  if (!fromJwt) {
    clearAuthStorage();
    return { ok: false, reason: 'INVALID_CREDENTIALS' };
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(fromJwt));
  return { ok: true, user: fromJwt };
}
