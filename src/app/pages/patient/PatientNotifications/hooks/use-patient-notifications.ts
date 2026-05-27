import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import type { Notification } from '../../../../types';
import { resolveNotificationPath } from '../../../../utils/notificationRoutes';
import { partitionPatientNotifications } from '../utils/patient-notifications.utils';

export function usePatientNotifications() {
  const { user } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const navigate = useNavigate();

  const { myNotifications, unread, read } = useMemo(
    () => partitionPatientNotifications(notifications, user?.id),
    [notifications, user?.id],
  );

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
    const target = resolveNotificationPath(notification, user?.role);
    navigate(target);
  };

  return {
    header: { unreadCount: unread.length },
    isEmpty: myNotifications.length === 0,
    unread: {
      notifications: unread,
      onNotificationClick: handleNotificationClick,
    },
    read: {
      notifications: read,
      onNotificationClick: handleNotificationClick,
    },
  };
}
