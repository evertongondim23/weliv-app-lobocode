import React from 'react';
import { StatusBadge } from '../components/feedback/StatusBadge';
import { AdminListPageTemplate } from './shared/AdminListPageTemplate';
import { adminUsersRows, type UserRow } from '../mocks/adminEntities';

export function AdminUsersPage() {
  return (
    <AdminListPageTemplate<UserRow>
      title="Usuários"
      description="Gestão de usuários com visão de acesso, função e unidade."
      rows={adminUsersRows}
      searchIn={(row) => `${row.id} ${row.name} ${row.role} ${row.unit}`}
      filterLabel="Status do usuário"
      filterOptions={[
        { label: 'Todos os status', value: 'all' },
        { label: 'Ativo', value: 'ativo' },
        { label: 'Pendente', value: 'pendente' },
        { label: 'Bloqueado', value: 'bloqueado' },
      ]}
      columns={[
        { key: 'name', header: 'Nome', render: (row) => row.name },
        { key: 'role', header: 'Perfil', render: (row) => row.role },
        { key: 'unit', header: 'Unidade', render: (row) => row.unit },
        { key: 'lastAccess', header: 'Último acesso', render: (row) => row.lastAccess },
        { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
      ]}
      drawerTitle={(row) => `${row.name} (${row.id})`}
      drawerDescription={(row) => `${row.role} • ${row.unit}`}
      renderDetails={(row) => (
        <div className="space-y-2 text-sm">
          <p><strong>Perfil:</strong> {row.role}</p>
          <p><strong>Unidade:</strong> {row.unit}</p>
          <p><strong>Último acesso:</strong> {row.lastAccess}</p>
          <p><strong>Status:</strong> {row.status}</p>
        </div>
      )}
    />
  );
}
