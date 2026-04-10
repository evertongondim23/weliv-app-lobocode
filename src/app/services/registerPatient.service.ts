import { API_BASE_URL } from '../config/api';

export type RegisterPatientPayload = {
  email: string;
  name: string;
  cpf: string;
  login: string;
  password: string;
  passwordConfirm: string;
};

export type RegisterPatientResult =
  | { ok: true; message: string }
  | {
      ok: false;
      kind: 'network' | 'validation' | 'conflict' | 'unknown';
      message?: string;
      error?: string;
    };

export async function requestPatientRegistration(
  payload: RegisterPatientPayload,
): Promise<RegisterPatientResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: { message?: string; error?: string } = {};
    if (text) {
      try {
        data = JSON.parse(text) as { message?: string; error?: string };
      } catch {
        /* ignore */
      }
    }

    if (res.ok) {
      return {
        ok: true,
        message:
          typeof data.message === 'string'
            ? data.message
            : 'Conta criada com sucesso.',
      };
    }

    if (res.status === 409) {
      return {
        ok: false,
        kind: 'conflict',
        message: data.message,
        error: data.error,
      };
    }

    if (res.status === 400) {
      return {
        ok: false,
        kind: 'validation',
        message: data.message,
        error: data.error,
      };
    }

    return {
      ok: false,
      kind: 'unknown',
      message: data.message,
      error: data.error,
    };
  } catch {
    return { ok: false, kind: 'network' };
  }
}
