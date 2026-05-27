import { useRef } from 'react';
import { FileText, Trash2, Upload } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import {
  ATTACHMENTS_PANEL_STYLE,
  FIELD_BORDER_STYLE,
  TEXT_MUTED_COLOR,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-medical-records.constants';
import type { AttachmentsSectionProps } from '../types/professional-medical-records.types';
import { formatDate } from '../utils/professional-medical-records.utils';

export function AttachmentsSection({ attachments, onUpload, onRemove }: AttachmentsSectionProps) {
  const pdfInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-lg border p-3 space-y-3" style={ATTACHMENTS_PANEL_STYLE}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p
          className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2"
          style={{ color: TEXT_MUTED_COLOR }}
        >
          <FileText className="size-4 text-[#FFA500]" />
          Documentos PDF (prontuário)
        </p>
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={onUpload}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-2 shrink-0"
          style={FIELD_BORDER_STYLE}
          onClick={() => pdfInputRef.current?.click()}
        >
          <Upload className="size-3.5 mr-1.5" />
          Enviar PDF
        </Button>
      </div>
      <p className="text-[11px] leading-snug" style={{ color: TEXT_MUTED_COLOR }}>
        Arquivos ficam ligados a este prontuário. O mesmo arquivo é registrado em{' '}
        <strong>Meus documentos</strong> do paciente (categoria Outros, nesta demo).
      </p>
      {attachments.length === 0 ? (
        <p
          className="text-sm py-2 text-center border border-dashed rounded-md"
          style={{ color: TEXT_MUTED_COLOR, borderColor: 'rgba(255, 165, 0, 0.25)' }}
        >
          Nenhum PDF anexado ainda.
        </p>
      ) : (
        <ul className="space-y-2">
          {attachments.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-2 rounded-md border bg-white px-3 py-2"
              style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
            >
              <div className="min-w-0 flex items-center gap-2">
                <FileText className="size-4 shrink-0 text-red-600" />
                <div className="min-w-0">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium truncate block hover:underline"
                    style={{ color: TEXT_PRIMARY_COLOR }}
                  >
                    {doc.name}
                  </a>
                  <span className="text-[10px]" style={{ color: TEXT_MUTED_COLOR }}>
                    {formatDate(doc.uploadedAt)}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 shrink-0 text-red-600 hover:bg-red-50"
                aria-label="Remover PDF"
                onClick={() => onRemove(doc.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
