import { CreditCard } from 'lucide-react';
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
import type { PaymentDepositDialogProps } from '../types/book-appointment.types';

export function PaymentDepositDialog({
  open,
  onOpenChange,
  professional,
  onConfirm,
}: PaymentDepositDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pagamento do Depósito</DialogTitle>
          <DialogDescription>
            Complete o pagamento do depósito para confirmar sua consulta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="border-2" style={ALERT_BOX_STYLE}>
            <CreditCard className="size-4" />
            <AlertDescription>
              Você será cobrado {professional.depositPercentage}% do valor total agora. O restante
              será pago na consulta.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">Métodos de pagamento disponíveis:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-auto py-3 border-2 hover:bg-[#FFF8E7]"
                style={CARD_BORDER_STYLE}
              >
                <div className="text-center">
                  <CreditCard className="size-5 mx-auto mb-1" />
                  <span className="text-xs">PIX</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 border-2 hover:bg-[#FFF8E7]"
                style={CARD_BORDER_STYLE}
              >
                <div className="text-center">
                  <CreditCard className="size-5 mx-auto mb-1" />
                  <span className="text-xs">Cartão</span>
                </div>
              </Button>
            </div>
          </div>
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
            Pagar e Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
