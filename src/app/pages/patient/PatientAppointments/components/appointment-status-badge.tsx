import { Badge } from '../../../../components/ui/badge';
import {
  APPOINTMENT_STATUS_CONFIG,
  CONFIRMED_BADGE_STYLE,
} from '../constants/patient-appointments.constants';
import type { AppointmentStatusBadgeProps } from '../types/patient-appointments.types';

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const config = APPOINTMENT_STATUS_CONFIG[status];

  return (
    <Badge
      variant={config.variant}
      style={status === 'confirmed' ? CONFIRMED_BADGE_STYLE : {}}
    >
      {config.label}
    </Badge>
  );
}
