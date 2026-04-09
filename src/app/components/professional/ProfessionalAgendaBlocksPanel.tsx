import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Ban, Bell, CalendarPlus, Trash2 } from 'lucide-react';
import { format, isFuture, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 23; h++) {
  for (const m of [0, 30]) {
    if (h === 23 && m === 30) break;
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
}
TIME_OPTIONS.push('23:30');

type ProfessionalAgendaBlocksPanelProps = {
  professionalId: string;
};

export function ProfessionalAgendaBlocksPanel({ professionalId }: ProfessionalAgendaBlocksPanelProps) {
  const {
    scheduleReminders,
    addProfessionalBlock,
    removeProfessionalBlock,
    addScheduleReminder,
    removeScheduleReminder,
    professionals,
  } = useData();

  const professional = professionals.find((p) => p.id === professionalId);
  const myBlocks = professional?.blockedTimes ?? [];
  const myReminders = useMemo(
    () =>
      scheduleReminders
        .filter((r) => r.professionalId === professionalId)
        .sort((a, b) => parseISO(a.remindAt).getTime() - parseISO(b.remindAt).getTime()),
    [scheduleReminders, professionalId],
  );

  const [blockDate, setBlockDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [fullDayBlock, setFullDayBlock] = useState(false);
  const [blockStart, setBlockStart] = useState('09:00');
  const [blockEnd, setBlockEnd] = useState('12:00');
  const [blockReason, setBlockReason] = useState('');

  const [remTitle, setRemTitle] = useState('');
  const [remAt, setRemAt] = useState('');
  const [remNote, setRemNote] = useState('');

  const sortedBlocks = useMemo(
    () => [...myBlocks].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start)),
    [myBlocks],
  );

  const upcomingReminders = useMemo(
    () => myReminders.filter((r) => isFuture(parseISO(r.remindAt)) || format(parseISO(r.remindAt), 'yyyy-MM-dd') >= format(new Date(), 'yyyy-MM-dd')),
    [myReminders],
  );

  const handleAddBlock = () => {
    if (!professionalId || !blockDate) return;
    const start = fullDayBlock ? '00:00' : blockStart;
    const end = fullDayBlock ? '24:00' : blockEnd;

    if (!fullDayBlock) {
      const [sh, sm] = blockStart.split(':').map(Number);
      const [eh, em] = blockEnd.split(':').map(Number);
      if (eh * 60 + em <= sh * 60 + sm) {
        toast.error('O horário final precisa ser depois do inicial.');
        return;
      }
    }

    addProfessionalBlock(professionalId, {
      date: blockDate,
      start,
      end,
      reason: blockReason.trim() || (fullDayBlock ? 'Dia indisponível' : 'Horário bloqueado'),
    });
    toast.success(fullDayBlock ? 'Dia bloqueado na sua agenda.' : 'Faixa de horário bloqueada.');
    setBlockReason('');
  };

  const handleAddReminder = () => {
    if (!professionalId || !remTitle.trim() || !remAt) {
      toast.error('Preencha título e data/hora do lembrete.');
      return;
    }
    const iso = new Date(remAt).toISOString();
    if (Number.isNaN(new Date(remAt).getTime())) {
      toast.error('Data ou hora inválida.');
      return;
    }
    addScheduleReminder({
      professionalId,
      title: remTitle.trim(),
      remindAt: iso,
      note: remNote.trim() || undefined,
    });
    toast.success('Lembrete criado.');
    setRemTitle('');
    setRemNote('');
  };

  if (!professional) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
        <CardHeader className="border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.1)', background: '#FFFCF5' }}>
          <div className="flex items-center gap-2">
            <Ban className="size-5 text-[#DC2626]" />
            <CardTitle className="text-base md:text-lg" style={{ color: '#4A3728' }}>
              Bloquear agenda
            </CardTitle>
          </div>
          <CardDescription>
            Horários bloqueados ficam <strong>indisponíveis</strong> para pacientes ao agendar — igual aos horários já reservados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between gap-4 rounded-xl border px-3 py-2.5 bg-white">
            <div>
              <p className="text-sm font-medium" style={{ color: '#4A3728' }}>
                Bloquear o dia inteiro
              </p>
              <p className="text-xs" style={{ color: '#6B5D53' }}>
                Nenhum horário desta data aparecerá como livre para o paciente.
              </p>
            </div>
            <Switch checked={fullDayBlock} onCheckedChange={setFullDayBlock} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="block-date">Data</Label>
              <div className="flex items-center gap-2">
                <CalendarPlus className="size-4 shrink-0 text-[#6B5D53]" />
                <Input
                  id="block-date"
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="border-2"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                />
              </div>
            </div>

            {!fullDayBlock ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="block-start">Início</Label>
                  <select
                    id="block-start"
                    value={blockStart}
                    onChange={(e) => setBlockStart(e.target.value)}
                    className="flex h-9 w-full rounded-md border-2 bg-white px-3 py-1 text-sm outline-none"
                    style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-end">Fim</Label>
                  <select
                    id="block-end"
                    value={blockEnd}
                    onChange={(e) => setBlockEnd(e.target.value)}
                    className="flex h-9 w-full rounded-md border-2 bg-white px-3 py-1 text-sm outline-none"
                    style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : null}

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="block-reason">Motivo (opcional)</Label>
              <Input
                id="block-reason"
                placeholder="Ex.: Treinamento, férias, compromisso pessoal"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="border-2"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              />
            </div>
          </div>

          <Button
            type="button"
            className="w-full sm:w-auto"
            style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}
            onClick={handleAddBlock}
          >
            <Ban className="size-4 mr-2" />
            Aplicar bloqueio
          </Button>

          <Separator style={{ background: 'rgba(255, 165, 0, 0.15)' }} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B5D53' }}>
              Bloqueios ativos ({sortedBlocks.length})
            </p>
            {sortedBlocks.length === 0 ? (
              <p className="text-sm py-4 text-center rounded-lg border border-dashed" style={{ color: '#6B5D53', borderColor: 'rgba(255, 165, 0, 0.25)' }}>
                Nenhum bloqueio cadastrado.
              </p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {sortedBlocks.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-start justify-between gap-2 rounded-lg border p-3 bg-white"
                    style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>
                        {format(parseISO(`${b.date}T12:00:00`), "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>
                        {b.start === '00:00' && b.end === '24:00'
                          ? 'Dia inteiro'
                          : `${b.start} – ${b.end}`}{' '}
                        · {b.reason}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="shrink-0 text-red-600 hover:bg-red-50"
                      aria-label="Remover bloqueio"
                      onClick={() => {
                        removeProfessionalBlock(professionalId, b.id);
                        toast.success('Bloqueio removido.');
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
        <CardHeader className="border-b" style={{ borderColor: 'rgba(255, 165, 0, 0.1)', background: '#FFFCF5' }}>
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-[#FFA500]" />
            <CardTitle className="text-base md:text-lg" style={{ color: '#4A3728' }}>
              Lembretes
            </CardTitle>
          </div>
          <CardDescription>
            Compromissos ou tarefas que você quer enxergar na agenda (armazenados neste dispositivo).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="rem-title">Título</Label>
              <Input
                id="rem-title"
                placeholder="Ex.: Revisar exames do paciente X"
                value={remTitle}
                onChange={(e) => setRemTitle(e.target.value)}
                className="border-2"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rem-at">Quando lembrar</Label>
              <Input
                id="rem-at"
                type="datetime-local"
                value={remAt}
                onChange={(e) => setRemAt(e.target.value)}
                className="border-2"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rem-note">Observação (opcional)</Label>
              <Textarea
                id="rem-note"
                rows={2}
                value={remNote}
                onChange={(e) => setRemNote(e.target.value)}
                className="border-2 resize-none"
                style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
              />
            </div>
            <Button
              type="button"
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
              onClick={handleAddReminder}
            >
              <Bell className="size-4 mr-2" />
              Salvar lembrete
            </Button>
          </div>

          <Separator style={{ background: 'rgba(255, 165, 0, 0.15)' }} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B5D53' }}>
              Próximos lembretes
            </p>
            {upcomingReminders.length === 0 ? (
              <p className="text-sm py-4 text-center rounded-lg border border-dashed" style={{ color: '#6B5D53', borderColor: 'rgba(255, 165, 0, 0.25)' }}>
                Nenhum lembrete futuro.
              </p>
            ) : (
              <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {upcomingReminders.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-lg border p-3 bg-white flex justify-between gap-2"
                    style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>
                        {r.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B5D53' }}>
                        {format(parseISO(r.remindAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                      {r.note ? (
                        <p className="text-xs mt-1 line-clamp-2" style={{ color: '#6B5D53' }}>
                          {r.note}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="shrink-0"
                      aria-label="Excluir lembrete"
                      onClick={() => {
                        removeScheduleReminder(r.id);
                        toast.success('Lembrete removido.');
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
