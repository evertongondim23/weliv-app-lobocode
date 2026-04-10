import { API_BASE_URL } from '../../config/api';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './auth-storage';

export type RefreshAccessResult =
  | { ok: true; access_token: string; refresh_token?: string }
  | { ok: false };

/**
 * Renova o access token com o refresh guardado. Atualiza `localStorage` em caso de sucesso.
 */
export async function refreshAccessTokenWithStoredRefresh(): Promise<RefreshAccessResult> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return { ok: false };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const text = await res.text();
    if (!res.ok) return { ok: false };

    let data: Record<string, unknown> = {};
    if (text) {
      try {
        data = JSON.parse(text) as Record<string, unknown>;
      } catch {
        return { ok: false };
      }
    }

    const access_token = data.access_token;
    const refresh_token = data.refresh_token;
    if (typeof access_token !== 'string') return { ok: false };

    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    if (typeof refresh_token === 'string') {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    }

    return {
      ok: true,
      access_token,
      refresh_token: typeof refresh_token === 'string' ? refresh_token : undefined,
    };
  } catch {
    return { ok: false };
  }
}
