import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import {
  APPOINTMENT_TYPE_LABEL,
  PRIMARY_GRADIENT_STYLE,
  SUMMARY_CARD_STYLE,
  TITLE_COLOR,
} from '../constants/book-appointment.constants';
import type { AppointmentSummarySectionProps } from '../types/book-appointment.types';

export function AppointmentSummarySection({
  professional,
  selectedDate,
  selectedTime,
  depositInfo,
  isRescheduling,
  onConfirm,
}: AppointmentSummarySectionProps) {
  const { depositAmount, requiresDeposit } = depositInfo;

  return (
    <Card className="border-2 shadow-md" style={SUMMARY_CARD_STYLE}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="size-6 text-[#FFA500] mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold mb-2" style={{ color: TITLE_COLOR }}>
              Resumo da Consulta
            </h3>
            <div className="space-y-1 text-sm mb-4">
              <p>
                <strong>Profissional:</strong> {professional.name}
              </p>
              <p>
                <strong>Data:</strong>{' '}
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p>
                <strong>Horário:</strong> {selectedTime}
              </p>
              <p>
                <strong>Tipo:</strong> {APPOINTMENT_TYPE_LABEL}
              </p>
              <p>
                <strong>Valor:</strong> R$ {professional.consultationPrice.toFixed(2)}
              </p>
              {requiresDeposit && (
                <p>
                  <strong>Depósito necessário:</strong> R$ {depositAmount.toFixed(2)}
                </p>
              )}
            </div>
            <Button onClick={onConfirm} className="w-full" style={PRIMARY_GRADIENT_STYLE}>
              {isRescheduling ? 'Confirmar Remarcação' : 'Confirmar Agendamento'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
