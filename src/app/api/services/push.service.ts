/**
 * Push Notifications: permissão nativa do navegador, registro de subscription e envio ao backend.
 * WebSocket só é conectado se o usuário aceitar as notificações.
 */

import { api } from './api.service';
import type { NotificationPermission } from '../types';

/** Usa o service worker registrado pelo vite-plugin-pwa (public/sw.ts → build/sw.js). */
async function getOrRegisterServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service worker não suportado neste navegador.');
  }
  const reg = await navigator.serviceWorker.ready;
  try {
    await reg.update();
  } catch {
    // update opcional; push pode usar o registro atual
  }
  return reg;
}

export const pushService = {
  /** Verifica se Push e Service Worker são suportados */
  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  },

  /** Retorna o estado atual da permissão */
  getPermission(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window))
      return 'default';
    return (Notification.permission as NotificationPermission) ?? 'default';
  },

  /**
   * Mostra o prompt nativo do navegador para permitir notificações.
   * Resolve com 'granted' ou 'denied' (ou 'default' se já tiver sido dispensado).
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    if (Notification.permission !== 'default') {
      return Notification.permission as NotificationPermission;
    }
    const result = await Notification.requestPermission();
    return result as NotificationPermission;
  },

  /** Busca a chave pública VAPID no backend (requer usuário logado). */
  async getVapidPublicKey(): Promise<string | null> {
    const res = await api.get<{ publicKey?: string }>(
      '/notifications/push/vapid-public-key',
    );
    const key = (res.data as { publicKey?: string } | undefined)?.publicKey;
    return key && key.length > 0 ? key : null;
  },

  /** Converte VAPID public key (base64url) para Uint8Array para o PushManager */
  urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  /** ArrayBuffer para base64url (para chaves p256dh e auth) */
  arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },

  /**
   * Registra o Service Worker e inscreve no Push; envia a subscription ao backend.
   * Só chamar após permissão 'granted'.
   * Inclui retry: "push service error" costuma ser intermitente (FCM/navegador).
   */
  async registerAndSubscribe(): Promise<boolean> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }
    const maxAttempts = 3;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const reg = await getOrRegisterServiceWorker();
        const vapidKey = await this.getVapidPublicKey();
        if (!vapidKey) {
          console.warn('[Push] VAPID public key não disponível no backend.');
          return false;
        }
        const applicationServerKey = this.urlBase64ToUint8Array(vapidKey);
        const existingSubscription = await reg.pushManager.getSubscription();
        if (existingSubscription) {
          const p256dh = existingSubscription.getKey('p256dh');
          const auth = existingSubscription.getKey('auth');
          if (p256dh && auth) {
            await api.post('/notifications/push/subscribe', {
              endpoint: existingSubscription.endpoint,
              keys: {
                p256dh: this.arrayBufferToBase64Url(p256dh),
                auth: this.arrayBufferToBase64Url(auth),
              },
            });
            return true;
          }
          await existingSubscription.unsubscribe();
        }
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });
        const p256dh = sub.getKey('p256dh');
        const auth = sub.getKey('auth');
        if (!p256dh || !auth) {
          console.warn('[Push] Subscription sem chaves.');
          return false;
        }
        const payload = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: this.arrayBufferToBase64Url(p256dh),
            auth: this.arrayBufferToBase64Url(auth),
          },
        };
        await api.post('/notifications/push/subscribe', payload);
        return true;
      } catch (e) {
        lastError = e;
        const isPushServiceError =
          e instanceof Error &&
          (e.name === 'AbortError' ||
            e.message?.includes('push service') ||
            e.message?.includes('Registration failed') ||
            e.message?.includes('Failed to update a ServiceWorker') ||
            e.message?.includes('Failed to register a ServiceWorker'));
        if (isPushServiceError && attempt < maxAttempts) {
          console.warn(`[Push] Tentativa ${attempt}/${maxAttempts} falhou (push service). Nova tentativa em 1.5s...`, e);
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        console.error('[Push] Erro ao registrar/subscribir:', e);
        if (isPushServiceError) {
          console.warn(
            '[Push] Dica: esse erro costuma ser intermitente (navegador/serviço). Tente recarregar a página ou desativar extensões que bloqueiam notificações.'
          );
        }
        return false;
      }
    }
    console.error('[Push] Erro ao registrar/subscribir após', maxAttempts, 'tentativas:', lastError);
    return false;
  },
};
