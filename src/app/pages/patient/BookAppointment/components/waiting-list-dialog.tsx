import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { ALERT_BOX_STYLE, CARD_BORDER_STYLE, PRIMARY_GRADIENT_STYLE } from '../constants/book-appointment.constants';
import type { WaitingListDialogProps } from '../types/book-appointment.types';

export function WaitingListDialog({
  open,
  onOpenChange,
  selectedDate,
  selectedTime,
  onConfirm,
}: WaitingListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fila de Espera</DialogTitle>
          <DialogDescription>
            Entre na fila de espera para ser notificado quando houver disponibilidade.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Alert className="border-2" style={ALERT_BOX_STYLE}>
            <AlertCircle className="size-4" />
            <AlertDescription>
              Data desejada:{' '}
              {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} às{' '}
              {selectedTime}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-2"
            style={CARD_BORDER_STYLE}
          >
            Cancelar
          </Button>
          <Button onClick={onConfirm} style={PRIMARY_GRADIENT_STYLE}>
            Confirmar Interesse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
