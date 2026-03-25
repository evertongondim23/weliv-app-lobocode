import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router';
import { Badge } from '../../components/ui/badge';
import { Bell, CheckCircle } from 'lucide-react';
import { NotificationCard } from '../../components/common';
import { EmptyState } from '../../components/EmptyState';
import { resolveNotificationPath } from '../../utils/notificationRoutes';

export function PatientNotifications() {
  const { user } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const navigate = useNavigate();

  const myNotifications = notifications.filter(not => not.userId === user?.id);
  const unread = myNotifications.filter(not => !not.read);
  const read = myNotifications.filter(not => not.read);

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
    const target = resolveNotificationPath(notification, user?.role);
    navigate(target);
  };

  const typeMap: Record<string, 'appointment' | 'payment' | 'reminder' | 'info' | 'success' | 'warning'> = {
    'appointment': 'appointment',
    'payment': 'payment',
    'document': 'info',
    'reminder': 'reminder',
    'waiting-list': 'info',
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-sm border" 
        style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="size-8 text-[#FFA500]" strokeWidth={2.5} />
            {unread.length > 0 && (
              <span 
                className="absolute -top-1 -right-1 size-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
              >
                {unread.length > 9 ? '9+' : unread.length}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#4A3728' }}>
              Notificações
            </h1>
            <p style={{ color: '#6B5D53' }}>
              {unread.length > 0 
                ? `${unread.length} não lida${unread.length > 1 ? 's' : ''}` 
                : 'Todas as notificações lidas'}
            </p>
          </div>
        </div>
      </div>

      {myNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nenhuma notificação ainda"
          description="Você será notificado sobre consultas, pagamentos e documentos"
        />
      ) : (
        <div className="space-y-6">
          {unread.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-semibold" style={{ color: '#4A3728' }}>
                  Não lidas
                </h2>
                <Badge 
                  className="text-xs" 
                  style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', border: 'none' }}
                >
                  {unread.length}
                </Badge>
              </div>
              {unread.map(notification => (
                <NotificationCard
                  key={notification.id}
                  type={typeMap[notification.type] || 'info'}
                  title={notification.title}
                  message={notification.message}
                  date={notification.createdAt}
                  read={false}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))}
            </div>
          )}

          {read.length > 0 && (
            <div className="space-y-3">
              <div 
                className="flex items-center gap-2 mb-3 pt-3 border-t" 
                style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}
              >
                <CheckCircle className="size-5 text-[#FFA500]" />
                <h2 className="text-xl font-semibold" style={{ color: '#4A3728' }}>
                  Anteriores
                </h2>
              </div>
              {read.map(notification => (
                <NotificationCard
                  key={notification.id}
                  type={typeMap[notification.type] || 'info'}
                  title={notification.title}
                  message={notification.message}
                  date={notification.createdAt}
                  read={true}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
