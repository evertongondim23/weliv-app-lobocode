import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog';
import {
  DIALOG_BORDER_STYLE,
  FIELD_BORDER_STYLE,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-medical-records.constants';
import type { DeleteRecordDialogProps } from '../types/professional-medical-records.types';

export function DeleteRecordDialog({ target, onOpenChange, onConfirm }: DeleteRecordDialogProps) {
  return (
    <AlertDialog open={!!target} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2" style={DIALOG_BORDER_STYLE}>
        <AlertDialogHeader>
          <AlertDialogTitle style={{ color: TEXT_PRIMARY_COLOR }}>Excluir prontuário?</AlertDialogTitle>
          <AlertDialogDescription>
            {target
              ? `Isso remove o prontuário de ${target.patientName} (${target.id}). Esta ação não pode ser desfeita na demo.`
              : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-2" style={FIELD_BORDER_STYLE}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white border-0" onClick={onConfirm}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
