import { buildUserFromAccessToken, isAccessTokenExpired } from '../../lib/auth-token';
import type { User } from '../../types';
import {
  ACCESS_TOKEN_KEY,
  CURRENT_USER_KEY,
  clearAuthStorage,
} from './auth-storage';
import { refreshAccessTokenWithStoredRefresh } from './refresh-access-token';

/**
 * Lê o token atual, renova se expirado, reconstrói o utilizador ou limpa a sessão.
 */
export async function syncSessionFromStorage(): Promise<User | null> {
  let token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!token) {
    clearAuthStorage();
    return null;
  }

  if (isAccessTokenExpired(token)) {
    const refreshed = await refreshAccessTokenWithStoredRefresh();
    if (!refreshed.ok) {
      clearAuthStorage();
      return null;
    }
    token = refreshed.access_token;
  }

  const user = buildUserFromAccessToken(token);
  if (!user) {
    clearAuthStorage();
    return null;
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}
