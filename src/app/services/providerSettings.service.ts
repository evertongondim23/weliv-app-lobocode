import { API_BASE_URL } from '../config/api';
import { ACCESS_TOKEN_KEY } from '../components/auth/auth-storage';

export type ProviderSettings = {
  id: string;
  remarcationEnabled: boolean | null;
  remarcationLimit: number | null;
  waitingListEnabled: boolean | null;
  depositPercentage: number | null;
  availableSchedule: Record<string, unknown> | null;
  consultationPrice: number | string | null;
  acceptsInsurance: boolean | null;
  insurances: string[] | null;
};

export type UpdateProviderSettingsPayload = Partial<{
  remarcationEnabled: boolean;
  remarcationLimit: number;
  waitingListEnabled: boolean;
  depositPercentage: 0 | 10 | 30 | 100;
  availableSchedule: Record<string, unknown>;
  consultationPrice: number;
  acceptsInsurance: boolean;
  insurances: string[];
}>;

export type ProviderSettingsApiResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      kind: 'unauthorized' | 'network' | 'unknown';
      status?: number;
      message?: string;
    };

type ProviderSettingsApiEnvelope<T> = {
  data?: T;
  message?: string;
};

async function authorizedFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
}

async function parseApiEnvelope<T>(res: Response): Promise<ProviderSettingsApiEnvelope<T>> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as ProviderSettingsApiEnvelope<T>;
  } catch {
    return {};
  }
}

export async function getMyProviderSettings(): Promise<ProviderSettingsApiResult<ProviderSettings>> {
  try {
    const res = await authorizedFetch('/provider-settings/me', { method: 'GET' });
    const payload = await parseApiEnvelope<ProviderSettings>(res);

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return {
          ok: false,
          kind: 'unauthorized',
          status: res.status,
          message: payload.message,
        };
      }
      return {
        ok: false,
        kind: 'unknown',
        status: res.status,
        message: payload.message,
      };
    }

    if (!payload.data) {
      return { ok: false, kind: 'unknown', status: res.status };
    }

    return { ok: true, data: payload.data };
  } catch {
    return { ok: false, kind: 'network' };
  }
}

export async function patchMyProviderSettings(
  updates: UpdateProviderSettingsPayload
): Promise<ProviderSettingsApiResult<ProviderSettings>> {
  try {
    const res = await authorizedFetch('/provider-settings/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    const payload = await parseApiEnvelope<ProviderSettings>(res);

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return {
          ok: false,
          kind: 'unauthorized',
          status: res.status,
          message: payload.message,
        };
      }
      return {
        ok: false,
        kind: 'unknown',
        status: res.status,
        message: payload.message,
      };
    }

    if (!payload.data) {
      return { ok: false, kind: 'unknown', status: res.status };
    }

    return { ok: true, data: payload.data };
  } catch {
    return { ok: false, kind: 'network' };
  }
}
