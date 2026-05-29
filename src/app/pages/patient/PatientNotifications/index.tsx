import { NotificationsEmptyState } from './components/notifications-empty-state';
import { usePatientNotifications } from './hooks/use-patient-notifications';
import { NotificationsHeaderSection } from './sections/notifications-header-section';
import { ReadNotificationsSection } from './sections/read-notifications-section';
import { UnreadNotificationsSection } from './sections/unread-notifications-section';

export function PatientNotifications() {
  const { header, isEmpty, unread, read } = usePatientNotifications();

  return (
    <div className="space-y-6 pb-6">
      <NotificationsHeaderSection {...header} />

      {isEmpty ? (
        <NotificationsEmptyState />
      ) : (
        <div className="space-y-6">
          <UnreadNotificationsSection {...unread} />
          <ReadNotificationsSection {...read} />
        </div>
      )}
    </div>
  );
}
