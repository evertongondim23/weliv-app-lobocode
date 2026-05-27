import { Button } from '../../../../components/ui/button';
import type { BookAppointmentNotFoundProps } from '../types/book-appointment.types';

export function BookAppointmentNotFound({ onBack }: BookAppointmentNotFoundProps) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Profissional não encontrado</p>
      <Button onClick={onBack} className="mt-4">
        Voltar para busca
      </Button>
    </div>
  );
}
