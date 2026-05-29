import { CheckCircle } from 'lucide-react';
import { NotificationCard } from '../../../../components/common';
import {
  SECTION_DIVIDER_BORDER,
  TEXT_PRIMARY_COLOR,
} from '../constants/patient-notifications.constants';
import type { ReadNotificationsSectionProps } from '../types/patient-notifications.types';
import { mapNotificationCardType } from '../utils/patient-notifications.utils';

export function ReadNotificationsSection({
  notifications,
  onNotificationClick,
}: ReadNotificationsSectionProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-2 mb-3 pt-3 border-t"
        style={{ borderColor: SECTION_DIVIDER_BORDER }}
      >
        <CheckCircle className="size-5 text-[#FFA500]" />
        <h2 className="text-xl font-semibold" style={{ color: TEXT_PRIMARY_COLOR }}>
          Anteriores
        </h2>
      </div>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          type={mapNotificationCardType(notification.type)}
          title={notification.title}
          message={notification.message}
          date={notification.createdAt}
          read={true}
          onClick={() => onNotificationClick(notification)}
        />
      ))}
    </div>
  );
}
