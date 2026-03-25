import React from 'react';
import { StatusBadge } from '../components/feedback/StatusBadge';
import { AdminListPageTemplate } from './shared/AdminListPageTemplate';
import { adminAuditLogsRows, type AuditLogRow } from '../mocks/adminEntities';

export function AdminAuditLogsPage() {
  return (
    <AdminListPageTemplate<AuditLogRow>
      title="Logs e auditoria"
      description="Rastreabilidade de eventos críticos e ações administrativas."
      rows={adminAuditLogsRows}
      searchIn={(row) => `${row.id} ${row.event} ${row.actor} ${row.area}`}
      filterLabel="Severidade"
      filterOptions={[
        { label: 'Todos os níveis', value: 'all' },
        { label: 'OK', value: 'ok' },
        { label: 'Alerta', value: 'alerta' },
        { label: 'Crítico', value: 'crítico' },
      ]}
      columns={[
        { key: 'event', header: 'Evento', render: (row) => row.event },
        { key: 'actor', header: 'Ator', render: (row) => row.actor },
        { key: 'area', header: 'Área', render: (row) => row.area },
        { key: 'at', header: 'Data/Hora', render: (row) => row.at },
        { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
      ]}
      drawerTitle={(row) => `${row.event} (${row.id})`}
      drawerDescription={(row) => `${row.actor} • ${row.at}`}
      renderDetails={(row) => (
        <div className="space-y-2 text-sm">
          <p><strong>Área:</strong> {row.area}</p>
          <p><strong>Ator:</strong> {row.actor}</p>
          <p><strong>Nível:</strong> {row.status}</p>
        </div>
      )}
    />
  );
}
