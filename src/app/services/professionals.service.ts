import { API_BASE_URL } from '../config/api';
import { ACCESS_TOKEN_KEY } from '../components/auth/auth-storage';

/** Perfil do profissional logado (`GET/PATCH /professionals/me`). */
export type ProfessionalProfile = {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  phone: string | null;
  avatarUrl: string | null;
  professionalTitle: string | null;
  biography: string | null;
  registrationNumber: string | null;
  specialty: string | null;
  cnpj: string | null;
  address: string | null;
  professionalCnpj?: string | null;
  professionalAddress?: string | null;
};

export type UpdateProfessionalProfilePayload = Partial<{
  name: string;
  email: string;
  cpf: string;
  phone: string;
  professionalTitle: string;
  biography: string;
  registrationNumber: string;
  specialty: string;
  cnpj: string;
  address: string;
  avatarUrl: string;
}>;

export type ProfessionalsApiResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      kind: 'unauthorized' | 'network' | 'unknown';
      status?: number;
      message?: string;
    };

type ProfessionalsApiEnvelope<T> = {
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

async function parseApiEnvelope<T>(res: Response): Promise<ProfessionalsApiEnvelope<T>> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as ProfessionalsApiEnvelope<T>;
  } catch {
    return {};
  }
}

export async function getMyProfessionalProfile(): Promise<ProfessionalsApiResult<ProfessionalProfile>> {
  try {
    const res = await authorizedFetch('/professionals/me', { method: 'GET' });
    const payload = await parseApiEnvelope<ProfessionalProfile>(res);

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

export async function patchMyProfessionalProfile(
  updates: UpdateProfessionalProfilePayload,
): Promise<ProfessionalsApiResult<ProfessionalProfile>> {
  try {
    const res = await authorizedFetch('/professionals/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    const payload = await parseApiEnvelope<ProfessionalProfile>(res);

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
