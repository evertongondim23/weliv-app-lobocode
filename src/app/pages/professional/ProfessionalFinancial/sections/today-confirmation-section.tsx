import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  CARD_BORDER_STYLE,
  CONFIRMATION_CARD_STYLE,
  TEXT_MUTED_COLOR,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-financial.constants';
import type { TodayConfirmationSectionProps } from '../types/professional-financial.types';

export function TodayConfirmationSection({ appointments, onConfirm }: TodayConfirmationSectionProps) {
  return (
    <Card className="border-2" style={CONFIRMATION_CARD_STYLE}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: TEXT_PRIMARY_COLOR }}>
          <Clock className="size-5" style={{ color: '#FFA500' }} />
          Confirmar Atendimentos de Hoje
        </CardTitle>
        <CardDescription>
          {appointments.length} consulta{appointments.length !== 1 ? 's' : ''} aguardando confirmação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border-2"
            style={CARD_BORDER_STYLE}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="size-4" style={{ color: TEXT_MUTED_COLOR }} />
                <span className="font-medium" style={{ color: TEXT_PRIMARY_COLOR }}>
                  {apt.time}
                </span>
                <Badge variant="outline" style={{ borderColor: '#FFA500', color: '#FFA500' }}>
                  {apt.status === 'confirmed' ? 'Confirmada' : 'Agendada'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Paciente ID: {apt.patientId}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onConfirm(apt.id, 'completed')}
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                <CheckCircle2 className="size-4 mr-1" />
                Realizada
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onConfirm(apt.id, 'no-show')}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <XCircle className="size-4 mr-1" />
                Falta
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
