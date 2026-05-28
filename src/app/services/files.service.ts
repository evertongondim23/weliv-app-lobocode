import { API_BASE_URL } from '../config/api';
import { ACCESS_TOKEN_KEY } from '../components/auth/auth-storage';

export type UploadedFileInfo = {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export type FilesApiResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      kind: 'unauthorized' | 'network' | 'unknown';
      status?: number;
      message?: string;
    };

export async function uploadProfileImage(file: File): Promise<FilesApiResult<UploadedFileInfo>> {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const formData = new FormData();
    formData.append('file', file);

    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(`${API_BASE_URL}/files/upload?type=PROFILE_IMAGE`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const text = await res.text();
    let payload: { url?: string; message?: string; id?: string; originalName?: string; mimeType?: string; size?: number } =
      {};
    if (text) {
      try {
        payload = JSON.parse(text) as typeof payload;
      } catch {
        /* ignore */
      }
    }

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

    if (!payload.url || !payload.id) {
      return { ok: false, kind: 'unknown', status: res.status };
    }

    return {
      ok: true,
      data: {
        id: payload.id,
        url: payload.url,
        originalName: payload.originalName ?? file.name,
        mimeType: payload.mimeType ?? file.type,
        size: payload.size ?? file.size,
      },
    };
  } catch {
    return { ok: false, kind: 'network' };
  }
}
