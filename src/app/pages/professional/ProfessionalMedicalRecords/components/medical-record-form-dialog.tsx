import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import {
  DIALOG_BORDER_STYLE,
  FIELD_BORDER_STYLE,
  FIELD_CLASS_NAME,
  PRIMARY_ACTION_STYLE,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-medical-records.constants';
import type { MedicalRecordFormDialogProps } from '../types/professional-medical-records.types';

export function MedicalRecordFormDialog({
  open,
  onOpenChange,
  editingId,
  form,
  setForm,
  addMedRow,
  removeMedRow,
  updateMed,
  onSubmit,
}: MedicalRecordFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg max-h-[min(90vh,720px)] overflow-y-auto gap-0 p-0"
        style={DIALOG_BORDER_STYLE}
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle style={{ color: TEXT_PRIMARY_COLOR }}>
            {editingId ? 'Editar prontuário' : 'Novo prontuário'}
          </DialogTitle>
          <DialogDescription>
            {editingId
              ? 'Alterações são salvas apenas nesta sessão do navegador (demo).'
              : 'Preencha os dados do paciente e o resumo clínico.'}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mr-name">Nome completo *</Label>
              <Input
                id="mr-name"
                className={FIELD_CLASS_NAME}
                style={FIELD_BORDER_STYLE}
                value={form.patientName}
                onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mr-cpf">CPF *</Label>
              <Input
                id="mr-cpf"
                className={FIELD_CLASS_NAME}
                style={FIELD_BORDER_STYLE}
                value={form.patientCpf}
                onChange={(e) => setForm((f) => ({ ...f, patientCpf: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mr-birth">Nascimento *</Label>
              <Input
                id="mr-birth"
                type="date"
                className={FIELD_CLASS_NAME}
                style={FIELD_BORDER_STYLE}
                value={form.patientBirthDate}
                onChange={(e) => setForm((f) => ({ ...f, patientBirthDate: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mr-blood">Tipo sanguíneo</Label>
              <Input
                id="mr-blood"
                placeholder="ex.: O+"
                className={FIELD_CLASS_NAME}
                style={FIELD_BORDER_STYLE}
                value={form.bloodType}
                onChange={(e) => setForm((f) => ({ ...f, bloodType: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mr-pid">ID do paciente</Label>
              <Input
                id="mr-pid"
                placeholder="Gerado se vazio"
                className={FIELD_CLASS_NAME}
                style={FIELD_BORDER_STYLE}
                value={form.patientId}
                onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
                disabled={!!editingId}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mr-consult">Última consulta</Label>
              <Input
                id="mr-consult"
                type="datetime-local"
                className={FIELD_CLASS_NAME}
                style={FIELD_BORDER_STYLE}
                value={form.lastConsultLocal}
                onChange={(e) => setForm((f) => ({ ...f, lastConsultLocal: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mr-allergies">Alergias (separar por vírgula)</Label>
              <Input
                id="mr-allergies"
                className={FIELD_CLASS_NAME}
                style={FIELD_BORDER_STYLE}
                value={form.allergiesText}
                onChange={(e) => setForm((f) => ({ ...f, allergiesText: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mr-chronic">Condições crônicas (separar por vírgula)</Label>
              <Input
                id="mr-chronic"
                className={FIELD_CLASS_NAME}
                style={FIELD_BORDER_STYLE}
                value={form.chronicText}
                onChange={(e) => setForm((f) => ({ ...f, chronicText: e.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <Label>Medicações em uso</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-2 h-8"
                  style={FIELD_BORDER_STYLE}
                  onClick={addMedRow}
                >
                  <Plus className="size-3.5 mr-1" />
                  Linha
                </Button>
              </div>
              <div className="space-y-2">
                {form.meds.map((m, i) => (
                  <div
                    key={i}
                    className="grid gap-2 sm:grid-cols-[1fr_1fr_100px_auto] items-end rounded-lg border p-2"
                    style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase" style={{ color: '#6B5D53' }}>
                        Nome
                      </span>
                      <Input
                        className={`h-9 ${FIELD_CLASS_NAME}`}
                        style={FIELD_BORDER_STYLE}
                        value={m.name}
                        onChange={(e) => updateMed(i, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase" style={{ color: '#6B5D53' }}>
                        Posologia
                      </span>
                      <Input
                        className={`h-9 ${FIELD_CLASS_NAME}`}
                        style={FIELD_BORDER_STYLE}
                        value={m.dosage}
                        onChange={(e) => updateMed(i, { dosage: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase" style={{ color: '#6B5D53' }}>
                        Desde
                      </span>
                      <Input
                        type="date"
                        className={`h-9 ${FIELD_CLASS_NAME}`}
                        style={FIELD_BORDER_STYLE}
                        value={m.since.slice(0, 10)}
                        onChange={(e) => updateMed(i, { since: e.target.value })}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9 text-red-600"
                      onClick={() => removeMedRow(i)}
                      aria-label="Remover medicação"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mr-complaint">Queixa principal *</Label>
              <Textarea
                id="mr-complaint"
                className={`min-h-[72px] ${FIELD_CLASS_NAME}`}
                style={FIELD_BORDER_STYLE}
                value={form.chiefComplaint}
                onChange={(e) => setForm((f) => ({ ...f, chiefComplaint: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mr-summary">Evolução / resumo clínico *</Label>
              <Textarea
                id="mr-summary"
                className={`min-h-[100px] ${FIELD_CLASS_NAME}`}
                style={FIELD_BORDER_STYLE}
                value={form.clinicalSummary}
                onChange={(e) => setForm((f) => ({ ...f, clinicalSummary: e.target.value }))}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 pt-0 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="border-2"
            style={FIELD_BORDER_STYLE}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="button" className="text-white border-0" style={PRIMARY_ACTION_STYLE} onClick={onSubmit}>
            {editingId ? 'Salvar alterações' : 'Criar prontuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
