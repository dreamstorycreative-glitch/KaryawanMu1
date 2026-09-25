import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardMain } from './components/dashboard/DashboardMain';
import { OfficeMap } from './components/officemap/OfficeMap';
import { EmployeesView } from './components/employees/EmployeesView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { LeaveView } from './components/leave/LeaveView';
import { PayrollView } from './components/payroll/PayrollView';
import { FinanceView } from './components/finance/FinanceView';
import { TaxView } from './components/tax/TaxView';
import { TasksView } from './components/tasks/TasksView';
import { ForumChatView } from './components/forum/ForumChatView';
import { DigitalTeamView } from './components/digitalteam/DigitalTeamView';
import { AiWorkspaceView } from './components/digitalteam/AiWorkspaceView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { SuperAdminView } from './components/superadmin/SuperAdminView';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { SubscriptionModal } from './components/subscription/SubscriptionModal';

const MainAppContent: React.FC = () => {
  const { currentTab, showLanding } = useApp();

  if (showLanding) {
    return (
      <>
        <LandingPage />
        <AuthModal />
        <OnboardingWizard />
        <SubscriptionModal />
      </>
    );
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardMain />;
      case 'officemap':
        return <OfficeMap />;
      case 'employees':
        return <EmployeesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'leave':
        return <LeaveView />;
      case 'payroll':
        return <PayrollView />;
      case 'finance':
        return <FinanceView />;
      case 'tax':
        return <TaxView />;
      case 'tasks':
        return <TasksView />;
      case 'forum':
        return <ForumChatView />;
      case 'digitalteam':
        return <DigitalTeamView />;
      case 'aiworkspace':
        return <AiWorkspaceView />;
      case 'documents':
        return <DocumentsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'superadmin':
        return <SuperAdminView />;
      default:
        return <DashboardMain />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        {/* Scrollable Viewport with padding math & mobile safe spacing */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            {renderActiveView()}
          </div>
        </main>

        {/* Mobile Sticky Navigation */}
        <MobileNav />
      </div>

      {/* Global Interactive Modals */}
      <AuthModal />
      <OnboardingWizard />
      <SubscriptionModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
