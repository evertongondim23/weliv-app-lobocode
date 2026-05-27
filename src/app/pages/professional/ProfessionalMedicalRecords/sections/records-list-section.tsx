import { MedicalRecordCard } from '../components/medical-record-card';
import type { RecordsListSectionProps } from '../types/professional-medical-records.types';

export function RecordsListSection({ records, selectedId, onSelect }: RecordsListSectionProps) {
  return (
    <div className="space-y-3">
      {records.map((record) => (
        <MedicalRecordCard
          key={record.id}
          record={record}
          isSelected={selectedId === record.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
