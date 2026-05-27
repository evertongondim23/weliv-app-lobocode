import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ban, Clock } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  CARD_BORDER_STYLE,
  CARD_HEADER_STYLE,
  MUTED_COLOR,
  OUTLINE_BUTTON_STYLE,
  PRIMARY_GRADIENT_STYLE,
  SLOT_LEGEND,
  TITLE_COLOR,
} from '../constants/book-appointment.constants';
import type { AvailableSlotsSectionProps } from '../types/book-appointment.types';

export function AvailableSlotsSection({
  professional,
  selectedDate,
  selectedTime,
  slotRows,
  availableSlots,
  onSelectTime,
  onOpenWaitingList,
}: AvailableSlotsSectionProps) {
  return (
    <Card className="border-2 shadow-sm" style={CARD_BORDER_STYLE}>
      <CardHeader className="border-b" style={CARD_HEADER_STYLE}>
        <CardTitle style={{ color: TITLE_COLOR }}>Horários Disponíveis</CardTitle>
        <CardDescription>
          {selectedDate
            ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
            : 'Selecione uma data'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedDate ? (
          <div className="text-center py-10 text-muted-foreground">
            <div
              className="inline-flex p-3 rounded-full mb-3"
              style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
            >
              <Clock className="size-8 text-[#FFA500]" />
            </div>
            <p>Selecione uma data para ver os horários disponíveis</p>
          </div>
        ) : slotRows.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Nenhum horário neste dia (agenda fechada ou sem expediente).
            </p>
            {professional.waitingListEnabled && (
              <Button
                variant="outline"
                className="border-2 hover:bg-[#FFF8E7]"
                style={OUTLINE_BUTTON_STYLE}
                onClick={onOpenWaitingList}
              >
                Entrar na fila de espera
              </Button>
            )}
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="inline-flex items-center justify-center rounded-full bg-[#F3F4F6] p-3">
              <Ban className="size-6 text-[#6B7280]" />
            </div>
            <p className="font-medium" style={{ color: TITLE_COLOR }}>
              Todos os horários indisponíveis nesta data
            </p>
            <p className="text-sm text-muted-foreground" style={{ color: MUTED_COLOR }}>
              Pode ser bloqueio do profissional ou horários já reservados. Escolha outro dia.
            </p>
            {professional.waitingListEnabled && (
              <Button
                variant="outline"
                className="border-2 hover:bg-[#FFF8E7]"
                style={OUTLINE_BUTTON_STYLE}
                onClick={onOpenWaitingList}
              >
                Entrar na fila de espera
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 text-xs" style={{ color: MUTED_COLOR }}>
              {SLOT_LEGEND.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5">
                  <span className={`size-2.5 rounded-sm ${item.colorClass}`} />
                  {item.label}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {slotRows.map(({ slot, status }) => {
                if (status === 'available') {
                  return (
                    <Button
                      key={slot}
                      type="button"
                      variant={selectedTime === slot ? 'default' : 'outline'}
                      className="w-full border-2 h-auto py-2.5"
                      style={
                        selectedTime === slot
                          ? {
                              ...PRIMARY_GRADIENT_STYLE,
                              borderColor: 'transparent',
                              color: 'white',
                            }
                          : OUTLINE_BUTTON_STYLE
                      }
                      onClick={() => onSelectTime(slot)}
                    >
                      {slot}
                    </Button>
                  );
                }
                if (status === 'blocked') {
                  return (
                    <div
                      key={slot}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-dashed py-2.5 px-1 min-h-[42px] bg-[#F9FAFB]"
                      style={{ borderColor: '#E5E7EB', color: '#9CA3AF' }}
                      title="Indisponível — profissional bloqueou este horário"
                    >
                      <span className="text-xs font-medium line-through decoration-[#9CA3AF]">
                        {slot}
                      </span>
                      <span className="text-[10px] font-medium mt-0.5">Indisp.</span>
                    </div>
                  );
                }
                return (
                  <div
                    key={slot}
                    className="flex flex-col items-center justify-center rounded-md border-2 py-2.5 px-1 min-h-[42px] bg-[#F3F4F6]"
                    style={{ borderColor: 'rgba(74, 55, 40, 0.12)', color: MUTED_COLOR }}
                    title="Horário já reservado"
                  >
                    <span className="text-xs font-medium opacity-70">{slot}</span>
                    <span className="text-[10px] font-medium mt-0.5">Ocupado</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
