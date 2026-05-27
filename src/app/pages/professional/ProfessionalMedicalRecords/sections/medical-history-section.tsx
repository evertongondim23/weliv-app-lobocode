import { Badge } from '../../../../components/ui/badge';
import {
  COMPLAINT_PANEL_STYLE,
  TEXT_MUTED_COLOR,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-medical-records.constants';
import type { MedicalHistorySectionProps } from '../types/professional-medical-records.types';
import { formatBirth } from '../utils/professional-medical-records.utils';

export function MedicalHistorySection({ record }: MedicalHistorySectionProps) {
  return (
    <>
      <div className="rounded-lg border p-3" style={COMPLAINT_PANEL_STYLE}>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: TEXT_MUTED_COLOR }}>
          Queixa principal
        </p>
        <p className="mt-1 font-medium" style={{ color: TEXT_PRIMARY_COLOR }}>
          {record.chiefComplaint}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: TEXT_MUTED_COLOR }}>
          Evolução / resumo
        </p>
        <p className="leading-relaxed" style={{ color: TEXT_PRIMARY_COLOR }}>
          {record.clinicalSummary}
        </p>
      </div>

      {record.allergies.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: TEXT_MUTED_COLOR }}>
            Alergias
          </p>
          <div className="flex flex-wrap gap-2">
            {record.allergies.map((a) => (
              <Badge key={a} variant="secondary" className="bg-red-50 text-red-800 border-red-200/80">
                {a}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {record.chronicConditions.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: TEXT_MUTED_COLOR }}>
            Condições crônicas
          </p>
          <ul className="list-disc pl-5 space-y-1" style={{ color: TEXT_PRIMARY_COLOR }}>
            {record.chronicConditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {record.currentMedications.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: TEXT_MUTED_COLOR }}>
            Medicações em uso
          </p>
          <ul className="space-y-2">
            {record.currentMedications.map((m) => (
              <li
                key={`${m.name}-${m.since}`}
                className="rounded-lg border px-3 py-2"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              >
                <span className="font-medium" style={{ color: TEXT_PRIMARY_COLOR }}>
                  {m.name}
                </span>
                <span className="block text-xs mt-0.5" style={{ color: TEXT_MUTED_COLOR }}>
                  {m.dosage} · desde {formatBirth(m.since)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
