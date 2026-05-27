import { Bell } from 'lucide-react';
import {
  HEADER_BORDER_STYLE,
  PRIMARY_BADGE_GRADIENT,
  TEXT_MUTED_COLOR,
  TEXT_PRIMARY_COLOR,
} from '../constants/patient-notifications.constants';
import type { NotificationsHeaderSectionProps } from '../types/patient-notifications.types';
import { formatUnreadSubtitle } from '../utils/patient-notifications.utils';

export function NotificationsHeaderSection({ unreadCount }: NotificationsHeaderSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border" style={HEADER_BORDER_STYLE}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell className="size-8 text-[#FFA500]" strokeWidth={2.5} />
          {unreadCount > 0 ? (
            <span
              className="absolute -top-1 -right-1 size-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: PRIMARY_BADGE_GRADIENT }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </div>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: TEXT_PRIMARY_COLOR }}>
            Notificações
          </h1>
          <p style={{ color: TEXT_MUTED_COLOR }}>{formatUnreadSubtitle(unreadCount)}</p>
        </div>
      </div>
    </div>
  );
}
