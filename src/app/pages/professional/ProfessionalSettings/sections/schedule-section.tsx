import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Switch } from '../../../../components/ui/switch';
import { TabsContent } from '../../../../components/ui/tabs';
import {
  CARD_BORDER_STYLE,
  DAY_NAMES,
  FIELD_CLASS_NAME,
  FIELD_STYLE,
  PRIMARY_ACTION_STYLE,
} from '../constants/professional-settings.constants';
import type { ScheduleSectionProps } from '../types/professional-settings.types';

export function ScheduleSection({ schedule, updateSchedule, onSaveSchedule }: ScheduleSectionProps) {
  return (
    <TabsContent value="schedule" className="space-y-4 mt-6">
      <Card className="border-2 shadow-sm" style={CARD_BORDER_STYLE}>
        <CardHeader className="border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}>
          <CardTitle style={{ color: '#4A3728' }}>Horários de Atendimento</CardTitle>
          <CardDescription>Configure sua agenda semanal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {Object.entries(schedule).map(([day, daySchedule]) => (
            <div
              key={day}
              className="p-4 rounded-xl border-2 space-y-3 bg-white/80"
              style={{ borderColor: daySchedule.enabled ? 'rgba(255, 165, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)' }}
            >
              <div className="flex items-center justify-between">
                <Label className="text-base" style={{ color: '#4A3728' }}>
                  {DAY_NAMES[day]}
                </Label>
                <Switch
                  checked={daySchedule.enabled}
                  onCheckedChange={(enabled) => updateSchedule(day, { enabled })}
                />
              </div>

              {daySchedule.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Início</Label>
                    <Input
                      type="time"
                      value={daySchedule.start}
                      onChange={(e) => updateSchedule(day, { start: e.target.value })}
                      className={FIELD_CLASS_NAME}
                      style={FIELD_STYLE}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Término</Label>
                    <Input
                      type="time"
                      value={daySchedule.end}
                      onChange={(e) => updateSchedule(day, { end: e.target.value })}
                      className={FIELD_CLASS_NAME}
                      style={FIELD_STYLE}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Início Almoço (opcional)</Label>
                    <Input
                      type="time"
                      value={daySchedule.lunchStart || ''}
                      onChange={(e) => updateSchedule(day, { lunchStart: e.target.value })}
                      placeholder="Ex: 12:00"
                      className={FIELD_CLASS_NAME}
                      style={FIELD_STYLE}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Fim Almoço (opcional)</Label>
                    <Input
                      type="time"
                      value={daySchedule.lunchEnd || ''}
                      onChange={(e) => updateSchedule(day, { lunchEnd: e.target.value })}
                      placeholder="Ex: 13:00"
                      className={FIELD_CLASS_NAME}
                      style={FIELD_STYLE}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button onClick={onSaveSchedule} style={PRIMARY_ACTION_STYLE}>
              Salvar Horários
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
