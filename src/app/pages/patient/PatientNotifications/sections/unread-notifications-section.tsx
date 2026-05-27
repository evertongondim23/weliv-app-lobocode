import { Badge } from '../../../../components/ui/badge';
import { NotificationCard } from '../../../../components/common';
import {
  PRIMARY_BADGE_GRADIENT,
  TEXT_PRIMARY_COLOR,
} from '../constants/patient-notifications.constants';
import type { UnreadNotificationsSectionProps } from '../types/patient-notifications.types';
import { mapNotificationCardType } from '../utils/patient-notifications.utils';

export function UnreadNotificationsSection({
  notifications,
  onNotificationClick,
}: UnreadNotificationsSectionProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-xl font-semibold" style={{ color: TEXT_PRIMARY_COLOR }}>
          Não lidas
        </h2>
        <Badge className="text-xs" style={{ background: PRIMARY_BADGE_GRADIENT, border: 'none' }}>
          {notifications.length}
        </Badge>
      </div>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          type={mapNotificationCardType(notification.type)}
          title={notification.title}
          message={notification.message}
          date={notification.createdAt}
          read={false}
          onClick={() => onNotificationClick(notification)}
        />
      ))}
    </div>
  );
}
