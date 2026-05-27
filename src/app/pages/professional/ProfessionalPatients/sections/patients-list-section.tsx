import { Calendar, Edit, FileText, Mail, Phone, Trash2, Users } from 'lucide-react';
import { EmptyState } from '../../../../components/EmptyState';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  AVATAR_BORDER_STYLE,
  AVATAR_FALLBACK_STYLE,
  CARD_BORDER_STYLE,
} from '../constants/professional-patients.constants';
import type { PatientsListSectionProps } from '../types/professional-patients.types';

export function PatientsListSection({
  patients,
  searchTerm,
  getPatientStats,
  onEdit,
  onDelete,
}: PatientsListSectionProps) {
  if (patients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
        description={
          searchTerm ? 'Tente ajustar sua busca' : 'Os pacientes atendidos aparecerão nesta lista.'
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {patients.map((patient) => {
        const stats = getPatientStats(patient);

        return (
          <Card key={patient.id} className="border-2 hover:shadow-md transition-shadow" style={CARD_BORDER_STYLE}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="border-2" style={AVATAR_BORDER_STYLE}>
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback style={AVATAR_FALLBACK_STYLE}>
                      {patient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg" style={{ color: '#4A3728' }}>
                      {patient.name}
                    </CardTitle>
                    <CardDescription>CPF: {patient.cpf}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(patient)} className="size-8">
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(patient.id)}
                    className="size-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
                  <Phone className="size-4" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#6B5D53' }}>
                  <Mail className="size-4" />
                  <span>{patient.email}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
                <Badge variant="outline" className="gap-1">
                  <Calendar className="size-3" />
                  {stats.upcoming} próxima{stats.upcoming !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <FileText className="size-3" />
                  {patient.documents.length} doc{patient.documents.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
