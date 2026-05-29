import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import {
  FIELD_BORDER_STYLE,
  MUTED_COLOR,
  PRIMARY_ACTION_STYLE,
  TITLE_COLOR,
  UPLOAD_TYPE_OPTIONS,
} from '../constants/patient-documents.constants';
import type { UploadDocumentDialogProps, UploadDocumentType } from '../types/patient-documents.types';

export function UploadDocumentDialog({
  open,
  onOpenChange,
  trigger,
  uploadType,
  uploadName,
  selectedFile,
  onUploadTypeChange,
  onUploadNameChange,
  onFileSelect,
  onUpload,
}: UploadDocumentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ color: TITLE_COLOR }}>Enviar Documento</DialogTitle>
          <DialogDescription>
            Faça upload de exames, receitas ou outros documentos médicos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="docType">Tipo de Documento</Label>
            <Select value={uploadType} onValueChange={(val) => onUploadTypeChange(val as UploadDocumentType)}>
              <SelectTrigger id="docType" className="border-2" style={FIELD_BORDER_STYLE}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UPLOAD_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="docName">Nome do Documento</Label>
            <Input
              id="docName"
              placeholder="Ex: Hemograma Completo"
              value={uploadName}
              onChange={(e) => onUploadNameChange(e.target.value)}
              className="border-2"
              style={FIELD_BORDER_STYLE}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Arquivo</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onFileSelect}
              className="border-2"
              style={FIELD_BORDER_STYLE}
            />
            <p className="text-xs" style={{ color: MUTED_COLOR }}>
              Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-2"
            style={FIELD_BORDER_STYLE}
          >
            Cancelar
          </Button>
          <Button
            onClick={onUpload}
            disabled={!selectedFile || !uploadName}
            style={PRIMARY_ACTION_STYLE}
          >
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
