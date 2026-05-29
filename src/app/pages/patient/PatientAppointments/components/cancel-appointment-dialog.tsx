import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import {
  DEPOSIT_BADGE_STYLE,
  OUTLINE_BUTTON_STYLE,
  TITLE_COLOR,
} from '../constants/patient-appointments.constants';
import type { CancelAppointmentDialogProps } from '../types/patient-appointments.types';

export function CancelAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onConfirm,
}: CancelAppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ color: TITLE_COLOR }}>Cancelar Consulta</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {appointment?.depositPaid && (
          <div className="py-4">
            <Badge variant="outline" className="mb-2 border-2" style={DEPOSIT_BADGE_STYLE}>
              Atenção
            </Badge>
            <p className="text-sm text-muted-foreground">
              O depósito pago (R$ {appointment.depositAmount.toFixed(2)}) poderá não ser
              reembolsado conforme política do profissional.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-2"
            style={OUTLINE_BUTTON_STYLE}
          >
            Voltar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
