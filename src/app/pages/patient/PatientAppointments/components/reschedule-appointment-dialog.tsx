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
  PRIMARY_ACTION_STYLE,
  RESCHEDULE_INFO_BOX_STYLE,
  TITLE_COLOR,
} from '../constants/patient-appointments.constants';
import type { RescheduleAppointmentDialogProps } from '../types/patient-appointments.types';

export function RescheduleAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  professionals,
  onContinue,
}: RescheduleAppointmentDialogProps) {
  const professional = appointment
    ? professionals.find((p) => p.id === appointment.professionalId)
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ color: TITLE_COLOR }}>Remarcar Consulta</DialogTitle>
          <DialogDescription>
            Selecione uma nova data e horário para sua consulta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {appointment && (
            <>
              <div className="p-4 rounded-lg border-2" style={RESCHEDULE_INFO_BOX_STYLE}>
                <p className="text-sm">
                  <strong>Remarcações restantes:</strong>{' '}
                  {professional!.remarcationLimit - appointment.remarcationCount}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Como remarcar:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Cancele esta consulta atual</li>
                  <li>Busque o profissional novamente</li>
                  <li>Selecione uma nova data e horário</li>
                </ol>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onContinue} style={PRIMARY_ACTION_STYLE}>
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
