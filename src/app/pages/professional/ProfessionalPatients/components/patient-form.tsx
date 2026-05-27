import { Button } from '../../../../components/ui/button';
import { DialogFooter } from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { FIELD_BORDER_STYLE, PRIMARY_ACTION_STYLE } from '../constants/professional-patients.constants';
import type { PatientFormProps } from '../types/professional-patients.types';

export function PatientForm({ formData, setFormData, onSubmit, onCancel }: PatientFormProps) {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            placeholder="Digite o nome completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-2"
            style={FIELD_BORDER_STYLE}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            placeholder="(00) 00000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="border-2"
            style={FIELD_BORDER_STYLE}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            className="border-2"
            style={FIELD_BORDER_STYLE}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border-2"
            style={FIELD_BORDER_STYLE}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="border-2" style={FIELD_BORDER_STYLE}>
          Cancelar
        </Button>
        <Button onClick={onSubmit} style={PRIMARY_ACTION_STYLE}>
          Salvar
        </Button>
      </DialogFooter>
    </>
  );
}
