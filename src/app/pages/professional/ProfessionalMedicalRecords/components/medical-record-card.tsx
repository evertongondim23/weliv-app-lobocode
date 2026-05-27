import { AlertTriangle, Calendar, Pill } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import {
  CARD_BORDER_STYLE,
  SELECTED_CARD_BACKGROUND,
  SELECTED_CARD_BORDER,
  TEXT_MUTED_COLOR,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-medical-records.constants';
import type { MedicalRecordCardProps } from '../types/professional-medical-records.types';
import { formatDate } from '../utils/professional-medical-records.utils';

export function MedicalRecordCard({ record, isSelected, onSelect }: MedicalRecordCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(record)}
      className="w-full text-left rounded-xl border-2 transition-all hover:shadow-md"
      style={{
        borderColor: isSelected ? SELECTED_CARD_BORDER : CARD_BORDER_STYLE.borderColor,
        background: isSelected ? SELECTED_CARD_BACKGROUND : 'white',
      }}
    >
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold" style={{ color: TEXT_PRIMARY_COLOR }}>
              {record.patientName}
            </p>
            <p className="text-xs" style={{ color: TEXT_MUTED_COLOR }}>
              {record.patientCpf} · {record.id}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 gap-1 text-[10px]">
            <Calendar className="size-3" />
            {formatDate(record.lastConsultAt)}
          </Badge>
        </div>
        <p className="text-sm line-clamp-2" style={{ color: TEXT_PRIMARY_COLOR }}>
          {record.chiefComplaint}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {record.allergies.length > 0 ? (
            <Badge variant="secondary" className="gap-1 bg-amber-50 text-amber-900 border-amber-200/80">
              <AlertTriangle className="size-3" />
              Alergia
            </Badge>
          ) : null}
          {record.currentMedications.length > 0 ? (
            <Badge variant="outline" className="gap-1">
              <Pill className="size-3" />
              {record.currentMedications.length} med.
            </Badge>
          ) : null}
        </div>
      </div>
    </button>
  );
}
