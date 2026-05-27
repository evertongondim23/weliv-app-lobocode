import { Bell } from 'lucide-react';
import { EmptyState } from '../../../../components/EmptyState';

export function NotificationsEmptyState() {
  return (
    <EmptyState
      icon={Bell}
      title="Nenhuma notificação ainda"
      description="Você será notificado sobre consultas, pagamentos e documentos"
    />
  );
}
