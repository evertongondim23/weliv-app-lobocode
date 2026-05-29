import { ArrowRight, Calendar, Plus } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { AppointmentPreviewCard } from '../components/appointment-preview-card';
import {
  CARD_BORDER_STYLE,
  EMPTY_STATE_ICON_STYLE,
  PRIMARY_GRADIENT,
  TEXT_MUTED_COLOR,
  TEXT_PRIMARY_COLOR,
} from '../constants/patient-dashboard.constants';
import type { UpcomingAppointmentsSectionProps } from '../types/patient-dashboard.types';

export function UpcomingAppointmentsSection({
  preview,
  totalCount,
  professionals,
  onNavigateAppointments,
  onNavigateSearch,
}: UpcomingAppointmentsSectionProps) {
  return (
    <Card className="border-2" style={CARD_BORDER_STYLE}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg" style={{ color: TEXT_PRIMARY_COLOR }}>
              <div className="p-2 rounded-lg" style={{ background: PRIMARY_GRADIENT }}>
                <Calendar className="size-4 lg:size-5 text-white" />
              </div>
              Próximas Consultas
            </CardTitle>
            <CardDescription className="mt-2 text-xs lg:text-sm">Seus próximos agendamentos</CardDescription>
          </div>
          {totalCount > 0 ? (
            <Badge style={{ background: PRIMARY_GRADIENT, color: 'white' }}>{totalCount}</Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        {preview.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <div className="inline-flex p-3 lg:p-4 rounded-full mb-3 lg:mb-4" style={EMPTY_STATE_ICON_STYLE}>
              <Calendar className="size-8 lg:size-12" style={{ color: '#FFA500' }} />
            </div>
            <p className="text-base lg:text-lg mb-2" style={{ color: TEXT_PRIMARY_COLOR }}>
              Nenhuma consulta agendada
            </p>
            <p className="text-xs lg:text-sm mb-4" style={{ color: TEXT_MUTED_COLOR }}>
              Que tal encontrar um profissional de saúde?
            </p>
            <Button
              onClick={onNavigateSearch}
              style={{ background: PRIMARY_GRADIENT }}
              size="sm"
              className="lg:text-base"
            >
              <Plus className="size-4 mr-2" />
              Buscar Profissionais
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2 lg:space-y-3 mb-4">
              {preview.map((apt) => (
                <AppointmentPreviewCard
                  key={apt.id}
                  appointment={apt}
                  professional={professionals.find((p) => p.id === apt.professionalId)}
                  onNavigate={onNavigateAppointments}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={onNavigateAppointments}
              className="w-full border-2 text-xs lg:text-sm"
              style={{ borderColor: 'rgba(255, 165, 0, 0.2)', color: '#FFA500' }}
              size="sm"
            >
              Ver todas
              <ArrowRight className="size-3 lg:size-4 ml-2" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
