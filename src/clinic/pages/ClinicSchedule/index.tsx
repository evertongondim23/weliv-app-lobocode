import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { useClinic } from '../../contexts/ClinicContext';

const PROFESSIONAL_COLORS = [
  '#FFA500', '#3B82F6', '#10B981', '#8B5CF6', '#F43F5E', '#F59E0B',
];

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

type ViewMode = 'day' | 'week';

export function ClinicSchedule() {
  const { professionals, todaySlots } = useClinic();
  const [viewMode] = useState<ViewMode>('day');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todos');

  const specialties = ['Todos', ...Array.from(new Set(professionals.map((p) => p.specialty)))];

  const visibleProfessionals = professionals.filter((p) => {
    if (selectedSpecialty !== 'Todos' && p.specialty !== selectedSpecialty) return false;
    return p.status === 'attending' || p.status === 'available';
  });

  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#4A3728' }}>Agenda Consolidada</h1>
        <p className="text-sm mt-0.5 capitalize" style={{ color: '#6B5D53' }}>{today}</p>
      </div>

      {/* Controls */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="border-2 size-8" style={{ borderColor: 'rgba(255,165,0,0.25)' }}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium px-2" style={{ color: '#4A3728' }}>Hoje</span>
            <Button variant="outline" size="icon" className="border-2 size-8" style={{ borderColor: 'rgba(255,165,0,0.25)' }}>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {specialties.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSpecialty(s)}
                className="rounded-full px-3 py-1 text-xs font-medium border-2 transition-all"
                style={
                  selectedSpecialty === s
                    ? { background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white', borderColor: 'transparent' }
                    : { borderColor: 'rgba(255,165,0,0.25)', color: '#4A3728', background: 'white' }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {visibleProfessionals.map((prof, idx) => (
          <div key={prof.id} className="flex items-center gap-1.5 text-xs" style={{ color: '#4A3728' }}>
            <span
              className="size-3 rounded-sm shrink-0"
              style={{ background: PROFESSIONAL_COLORS[idx % PROFESSIONAL_COLORS.length] }}
            />
            {prof.name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <Card className="border-0 shadow-md overflow-hidden">
        <CardHeader
          className="py-3 px-4 border-b"
          style={{ borderColor: 'rgba(255,165,0,0.12)', background: 'linear-gradient(135deg, #FFF8E7, #FFFDF9)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-16 shrink-0" />
            {visibleProfessionals.map((prof, idx) => (
              <div key={prof.id} className="flex-1 min-w-0 text-center">
                <div
                  className="text-xs font-semibold truncate px-1 py-0.5 rounded"
                  style={{ background: PROFESSIONAL_COLORS[idx % PROFESSIONAL_COLORS.length] + '22', color: PROFESSIONAL_COLORS[idx % PROFESSIONAL_COLORS.length] }}
                >
                  {prof.name.split(' ').slice(-1)[0]}
                </div>
                <p className="text-[10px] truncate mt-0.5" style={{ color: '#6B5D53' }}>{prof.specialty}</p>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              {HOURS.map((hour, hIdx) => (
                <div
                  key={hour}
                  className="flex items-stretch border-b"
                  style={{ borderColor: 'rgba(74,55,40,0.06)' }}
                >
                  <div
                    className="w-16 shrink-0 flex items-center justify-end pr-3 py-2 text-xs font-medium"
                    style={{ color: '#6B5D53' }}
                  >
                    {hour}
                  </div>
                  {visibleProfessionals.map((prof, idx) => {
                    const slot = todaySlots.find(
                      (s) => s.professionalId === prof.id && s.hour === hour,
                    );
                    const color = PROFESSIONAL_COLORS[idx % PROFESSIONAL_COLORS.length];
                    return (
                      <div
                        key={prof.id}
                        className="flex-1 min-w-0 px-1 py-1"
                      >
                        {slot?.status === 'booked' ? (
                          <div
                            className="h-10 rounded-lg flex flex-col items-start justify-center px-2 cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ background: color }}
                          >
                            <span className="text-[10px] font-semibold text-white leading-tight truncate w-full">
                              {slot.patientName}
                            </span>
                            <span className="text-[9px] text-white/80">{hour}</span>
                          </div>
                        ) : slot?.status === 'blocked' ? (
                          <div
                            className="h-10 rounded-lg flex items-center justify-center"
                            style={{ background: 'rgba(74,55,40,0.06)' }}
                          >
                            <span className="text-[9px]" style={{ color: '#6B5D53' }}>Bloq.</span>
                          </div>
                        ) : (
                          <div
                            className="h-10 rounded-lg border border-dashed flex items-center justify-center cursor-pointer hover:bg-[#FFF8E7] transition-colors"
                            style={{ borderColor: 'rgba(255,165,0,0.2)' }}
                          >
                            <span className="text-[9px]" style={{ color: '#FFA500' }}>livre</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
