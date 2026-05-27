import type { Notification } from '../../../../types';
import { NOTIFICATION_TYPE_MAP } from '../constants/patient-notifications.constants';
import type {
  NotificationCardType,
  PatientNotificationsPartition,
} from '../types/patient-notifications.types';

export function partitionPatientNotifications(
  notifications: Notification[],
  userId: string | undefined,
): PatientNotificationsPartition {
  const myNotifications = notifications.filter((not) => not.userId === userId);
  const unread = myNotifications.filter((not) => !not.read);
  const read = myNotifications.filter((not) => !not.read);

  return { myNotifications, unread, read };
}

export function mapNotificationCardType(type: Notification['type']): NotificationCardType {
  return NOTIFICATION_TYPE_MAP[type] || 'info';
}

export function formatUnreadSubtitle(unreadCount: number): string {
  if (unreadCount > 0) {
    return `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}`;
  }
  return 'Todas as notificações lidas';
}
