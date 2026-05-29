import { FolderOpen, Upload } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { UploadDocumentDialog } from '../components/upload-document-dialog';
import {
  HEADER_BORDER_STYLE,
  PRIMARY_ACTION_STYLE,
  TITLE_COLOR,
  MUTED_COLOR,
} from '../constants/patient-documents.constants';
import type { UploadDocumentDialogProps } from '../types/patient-documents.types';

type DocumentsHeaderSectionProps = UploadDocumentDialogProps;

export function DocumentsHeaderSection(props: DocumentsHeaderSectionProps) {
  return (
    <div
      className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between"
      style={HEADER_BORDER_STYLE}
    >
      <div className="flex items-center gap-3">
        <FolderOpen className="size-8 text-[#FFA500]" strokeWidth={2.5} />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: TITLE_COLOR }}>
            Meus Documentos
          </h1>
          <p className="text-sm md:text-base" style={{ color: MUTED_COLOR }}>
            Exames, laudos e receitas
          </p>
        </div>
      </div>

      <UploadDocumentDialog
        {...props}
        trigger={
          <Button className="w-full sm:w-auto whitespace-nowrap" style={PRIMARY_ACTION_STYLE}>
            <Upload className="size-4 mr-2" />
            <span className="hidden xs:inline">Enviar Documento</span>
            <span className="xs:hidden">Enviar</span>
          </Button>
        }
      />
    </div>
  );
}
