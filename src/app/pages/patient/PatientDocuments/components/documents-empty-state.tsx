import { FolderOpen, Upload } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { EmptyState } from '../../../../components/EmptyState';
import { PRIMARY_ACTION_STYLE } from '../constants/patient-documents.constants';
import type { DocumentsEmptyStateProps } from '../types/patient-documents.types';

export function DocumentsEmptyState({ onUpload }: DocumentsEmptyStateProps) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="Nenhum documento encontrado"
      description="Envie receitas, exames ou laudos e organize tudo por categoria nesta página."
      action={
        <Button type="button" style={PRIMARY_ACTION_STYLE} onClick={onUpload}>
          <Upload className="size-4 mr-2" />
          Enviar primeiro documento
        </Button>
      }
    />
  );
}
