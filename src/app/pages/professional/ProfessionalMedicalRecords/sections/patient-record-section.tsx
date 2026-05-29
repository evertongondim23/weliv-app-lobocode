import { ClipboardList, FileHeart, Pencil, Trash2, User, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  CARD_BORDER_STYLE,
  FIELD_BORDER_STYLE,
  TEXT_MUTED_COLOR,
} from '../constants/professional-medical-records.constants';
import type { PatientRecordSectionProps } from '../types/professional-medical-records.types';
import { formatBirth, formatDate } from '../utils/professional-medical-records.utils';
import { AttachmentsSection } from './attachments-section';
import { MedicalHistorySection } from './medical-history-section';

export function PatientRecordSection({
  record,
  onEdit,
  onDelete,
  onClose,
  onPdfUpload,
  onPdfRemove,
}: PatientRecordSectionProps) {
  return (
    <Card className="border-2 h-fit xl:sticky xl:top-24" style={CARD_BORDER_STYLE}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#4A3728' }}>
              <FileHeart className="size-5 text-[#FFA500] shrink-0" />
              <span className="truncate">{record.patientName}</span>
            </CardTitle>
            <CardDescription>
              Atualizado em {formatDate(record.updatedAt)} · Última consulta{' '}
              {formatDate(record.lastConsultAt)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-8 border-2"
              style={FIELD_BORDER_STYLE}
              onClick={() => onEdit(record)}
              aria-label="Editar prontuário"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-8 border-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onDelete(record)}
              aria-label="Excluir prontuário"
            >
              <Trash2 className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8"
              onClick={onClose}
              aria-label="Fechar painel"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2" style={{ color: TEXT_MUTED_COLOR }}>
            <User className="size-4 shrink-0" />
            <span>
              Nasc.: {formatBirth(record.patientBirthDate)}
              {record.bloodType ? ` · ${record.bloodType}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2" style={{ color: TEXT_MUTED_COLOR }}>
            <ClipboardList className="size-4 shrink-0" />
            <span>CPF {record.patientCpf}</span>
          </div>
        </div>
        <p className="text-xs" style={{ color: TEXT_MUTED_COLOR }}>
          ID paciente: {record.patientId}
        </p>

        <MedicalHistorySection record={record} />

        <AttachmentsSection
          attachments={record.pdfAttachments ?? []}
          onUpload={onPdfUpload}
          onRemove={onPdfRemove}
        />

        <p
          className="text-[11px] pt-2 border-t"
          style={{ color: TEXT_MUTED_COLOR, borderColor: 'rgba(255, 165, 0, 0.12)' }}
        >
          Dados de demonstração. Em produção, persistir em backend e cumprir LGPD.
        </p>
      </CardContent>
    </Card>
  );
}
