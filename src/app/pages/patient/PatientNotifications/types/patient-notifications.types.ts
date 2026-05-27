import type { Notification } from '../../../../types';

export type NotificationCardType =
  | 'appointment'
  | 'payment'
  | 'reminder'
  | 'info'
  | 'success'
  | 'warning';

export interface PatientNotificationsPartition {
  myNotifications: Notification[];
  unread: Notification[];
  read: Notification[];
}

export interface NotificationsHeaderSectionProps {
  unreadCount: number;
}

export interface UnreadNotificationsSectionProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export interface ReadNotificationsSectionProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}
