import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { CadastroPage } from './pages/CadastroPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RouteErrorPage } from './pages/RouteErrorPage';
import { Layout } from './components/Layout';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { SearchProfessionals } from './pages/patient/SearchProfessionals';
import { BookAppointment } from './pages/patient/BookAppointment';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { PatientDocuments } from './pages/patient/PatientDocuments';
import { PatientNotifications } from './pages/patient/PatientNotifications';
import { ProfessionalDashboard } from './pages/professional/ProfessionalDashboard';
import { ProfessionalSchedule } from './pages/professional/ProfessionalSchedule';
import { ProfessionalFinancial } from './pages/professional/ProfessionalFinancial';
import { ProfessionalPatients } from './pages/professional/ProfessionalPatients';
import { ProfessionalMedicalRecords } from './pages/professional/ProfessionalMedicalRecords';
import { ProfessionalSettings } from './pages/professional/ProfessionalSettings';
import { AdminAppShell } from '../admin/components/layout/AdminAppShell';
import { AdminRouteGuard } from '../admin/components/layout/AdminRouteGuard';
import { AdminOverviewDashboardPage } from '../admin/pages/AdminOverviewDashboardPage';
import { AdminFinancialReportsPage } from '../admin/pages/AdminFinancialReportsPage';
import { AdminModuleLandingPage } from '../admin/pages/AdminModuleLandingPage';
import { AdminAreaOverviewPage } from '../admin/pages/AdminAreaOverviewPage';
import { AdminChargesPage } from '../admin/pages/AdminChargesPage';
import { AdminPaymentsPage } from '../admin/pages/AdminPaymentsPage';
import { AdminUsersPage } from '../admin/pages/AdminUsersPage';
import { AdminAuditLogsPage } from '../admin/pages/AdminAuditLogsPage';
import { AdminAppointmentsPage } from '../admin/pages/AdminAppointmentsPage';
import { AdminPendingPage } from '../admin/pages/AdminPendingPage';
import { AdminUnitsServicesPage } from '../admin/pages/AdminUnitsServicesPage';
import { AdminSystemSettingsPage } from '../admin/pages/AdminSystemSettingsPage';
import { GuestOnlyRoute } from './components/auth/guest-only-route';
import { HomeRoleRedirect } from './components/auth/home-role-redirect';
import { adminNavGroups } from '../admin/config/navigation';
import {
  adminAdministrationQuickMetrics,
  adminAdministrationTasks,
  adminFinancialQuickMetrics,
  adminFinancialTasks,
  adminOperationQuickMetrics,
  adminOperationTasks,
} from '../admin/mocks/adminData';

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <AdminRouteGuard>
        <AdminAppShell />
      </AdminRouteGuard>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <AdminOverviewDashboardPage />
        ),
      },
      {
        path: 'overview/pending',
        element: <AdminPendingPage />,
      },
      {
        path: 'operation',
        element: (
          <AdminAreaOverviewPage
            title="Operação"
            description="Monitoramento tático da rotina assistencial e intervenção rápida em gargalos."
            quickMetrics={adminOperationQuickMetrics}
            tasks={adminOperationTasks}
            links={adminNavGroups.find((group) => group.basePath === '/admin/operation')?.children ?? []}
          />
        ),
      },
      {
        path: 'operation/appointments',
        element: <AdminAppointmentsPage />,
      },
      {
        path: 'financial',
        element: (
          <AdminAreaOverviewPage
            title="Financeiro"
            description="Controle de receita, cobrança, inadimplência e previsibilidade de caixa."
            quickMetrics={adminFinancialQuickMetrics}
            tasks={adminFinancialTasks}
            links={adminNavGroups.find((group) => group.basePath === '/admin/financial')?.children ?? []}
          />
        ),
      },
      {
        path: 'financial/charges',
        element: <AdminChargesPage />,
      },
      {
        path: 'financial/payments',
        element: <AdminPaymentsPage />,
      },
      {
        path: 'financial/defaults',
        element: <Navigate to="/admin/financial/charges" replace />,
      },
      {
        path: 'financial/reports',
        element: <AdminFinancialReportsPage />,
      },
      {
        path: 'administration',
        element: (
          <AdminAreaOverviewPage
            title="Administração"
            description="Governança da plataforma: acessos, integrações, auditoria e parâmetros."
            quickMetrics={adminAdministrationQuickMetrics}
            tasks={adminAdministrationTasks}
            links={adminNavGroups.find((group) => group.basePath === '/admin/users')?.children ?? []}
          />
        ),
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'units-services',
        element: <AdminUnitsServicesPage />,
      },
      {
        path: 'logs-audit',
        element: <AdminAuditLogsPage />,
      },
      {
        path: 'settings',
        element: <AdminSystemSettingsPage />,
      },
    ],
  },
  {
    path: '/cadastro',
    element: (
      <GuestOnlyRoute>
        <CadastroPage />
      </GuestOnlyRoute>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/login',
    element: (
      <GuestOnlyRoute>
        <LoginPage portal="patient" />
      </GuestOnlyRoute>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/login/profissional',
    element: (
      <GuestOnlyRoute>
        <LoginPage portal="professional" />
      </GuestOnlyRoute>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/login/admin',
    element: (
      <GuestOnlyRoute>
        <LoginPage portal="admin" />
      </GuestOnlyRoute>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorPage />,
    children: [
           {
        index: true,
        element: <HomeRoleRedirect />,
      },
      // Patient Routes
      {
        path: 'patient/dashboard',
        element: <PatientDashboard />,
      },
      {
        path: 'patient/search',
        element: <SearchProfessionals />,
      },
      {
        path: 'patient/book/:professionalId',
        element: <BookAppointment />,
      },
      {
        path: 'patient/appointments',
        element: <PatientAppointments />,
      },
      {
        path: 'patient/documents',
        element: <PatientDocuments />,
      },
      {
        path: 'patient/notifications',
        element: <PatientNotifications />,
      },
      // Professional Routes
      {
        path: 'professional/dashboard',
        element: <ProfessionalDashboard />,
      },
      {
        path: 'professional/schedule',
        element: <ProfessionalSchedule />,
      },
      {
        path: 'professional/financial',
        element: <ProfessionalFinancial />,
      },
      {
        path: 'professional/patients',
        element: <ProfessionalPatients />,
      },
      {
        path: 'professional/medical-records',
        element: <ProfessionalMedicalRecords />,
      },
      {
        path: 'professional/settings',
        element: <ProfessionalSettings />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);