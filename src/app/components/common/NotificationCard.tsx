import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Bell, Calendar, DollarSign, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationCardProps {
  type: 'appointment' | 'payment' | 'reminder' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  date: string;
  read: boolean;
  onClick?: () => void;
}

const notificationConfig = {
  appointment: {
    icon: Calendar,
    color: '#FFA500',
    bgColor: '#FFF8E7',
  },
  payment: {
    icon: DollarSign,
    color: '#10B981',
    bgColor: '#ECFDF5',
  },
  reminder: {
    icon: Bell,
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
  },
  info: {
    icon: Info,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
  },
  success: {
    icon: CheckCircle,
    color: '#10B981',
    bgColor: '#ECFDF5',
  },
  warning: {
    icon: AlertCircle,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
};

export function NotificationCard({ 
  type, 
  title, 
  message, 
  date, 
  read,
  onClick 
}: NotificationCardProps) {
  const config = notificationConfig[type];
  const Icon = config.icon;

  const interactive = Boolean(onClick);

  return (
    <Card
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={`border-0 shadow-sm overflow-hidden ${
        interactive ? 'cursor-pointer hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2' : ''
      } ${!read ? 'ring-2' : ''}`}
      style={!read ? { ringColor: config.color } : {}}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div className="h-2 w-full" style={{ background: config.color }} />
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div 
            className="p-3 rounded-xl flex-shrink-0"
            style={{ background: config.bgColor }}
          >
            <Icon className="size-6" style={{ color: config.color }} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-base" style={{ color: '#4A3728' }}>
                {title}
              </h3>
              {!read && (
                <Badge 
                  className="flex-shrink-0"
                  style={{ background: config.color }}
                >
                  Nova
                </Badge>
              )}
            </div>

            {/* Message */}
            <p className="text-sm mb-2" style={{ color: '#6B5D53' }}>
              {message}
            </p>

            {/* Date */}
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              {format(new Date(date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
