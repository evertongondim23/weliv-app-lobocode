import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentCardProps {
  date: string;
  time: string;
  status: string;
  title: string;
  subtitle: string;
  type?: 'patient' | 'professional';
  onDetailsClick?: () => void;
}

export function AppointmentCard({ 
  date, 
  time, 
  status, 
  title, 
  subtitle,
  type = 'patient',
  onDetailsClick 
}: AppointmentCardProps) {
  const Icon = type === 'patient' ? Calendar : Users;
  
  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    'confirmed': { label: '✓ Confirmada', variant: 'default' },
    'scheduled': { label: 'Agendada', variant: 'secondary' },
    'completed': { label: 'Concluída', variant: 'default' },
    'cancelled': { label: 'Cancelada', variant: 'destructive' },
    'no-show': { label: 'Faltou', variant: 'destructive' },
  };

  const statusInfo = statusMap[status] || { label: status, variant: 'secondary' as const };

  return (
    <div 
      className="flex items-center justify-between p-5 border-2 rounded-xl hover:shadow-md transition-shadow"
      style={{ borderColor: 'rgba(255, 165, 0, 0.2)', background: '#FAFAFA' }}
    >
      <div className="flex items-center gap-4">
        <div 
          className={`${type === 'patient' ? 'p-4 rounded-2xl' : 'p-3 rounded-xl'}`}
          style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
        >
          <Icon className={`${type === 'patient' ? 'size-6' : 'size-5'} text-white`} />
        </div>
        <div>
          <p className={`font-semibold ${type === 'patient' ? 'text-lg' : ''}`} style={{ color: '#4A3728' }}>
            {title}
          </p>
          <p className="text-sm" style={{ color: '#6B5D53' }}>
            {subtitle}
          </p>
          <p className="text-sm font-medium mt-1" style={{ color: '#FFA500' }}>
            {format(new Date(date), "dd 'de' MMMM", { locale: ptBR })} às {time}
          </p>
        </div>
      </div>
      
      {type === 'patient' ? (
        <Badge 
          variant={statusInfo.variant}
          className="text-sm px-4 py-1"
        >
          {statusInfo.label}
        </Badge>
      ) : (
        onDetailsClick && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={onDetailsClick}
            style={{ borderColor: '#FFA500', color: '#FFA500' }}
          >
            Detalhes
          </Button>
        )
      )}
    </div>
  );
}
