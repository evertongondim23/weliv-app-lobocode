import { api } from './api.service';
import type { ApiResponse } from '../types';
import type {
  NotificationItem,
  NotificationMutationResult,
  NotificationsListResponse,
} from '../types';

function toMutationResult(res: ApiResponse<unknown>): NotificationMutationResult {
  if (res.success) return { success: true };
  return { success: false, error: res.error ?? 'Erro ao processar' };
}

export const notificationsService = {
  async getList(params?: { page?: number; limit?: number; isRead?: boolean }): Promise<ApiResponse<NotificationsListResponse>> {
    return api.get<NotificationsListResponse>('/notifications', {
      params: params ?? {},
      useCache: false,
    });
  },

  async getUnreadCount(): Promise<ApiResponse<number>> {
    // ✅ Corrigido: endpoint correto é /notifications/my/unread-count
    const res = await api.get<number>('/notifications/my/unread-count', { useCache: false });
    return res;
  },

  async markAsRead(isRead: boolean, id: string): Promise<NotificationMutationResult> {
    if (isRead) return { success: true };
    // ✅ Corrigido: endpoint correto é /notifications/my/:recipientId/read
    const res = await api.put(`/notifications/my/${id}/read`);
    return toMutationResult(res);
  },

  async markAllAsRead(): Promise<NotificationMutationResult> {
    // ✅ Corrigido: endpoint correto é /notifications/my/mark-all-read
    const res = await api.put('/notifications/my/mark-all-read');
    return toMutationResult(res);
  },

  async delete(id: string): Promise<ApiResponse<unknown>> {
    return api.delete(`/notifications/${id}`);
  },
};
