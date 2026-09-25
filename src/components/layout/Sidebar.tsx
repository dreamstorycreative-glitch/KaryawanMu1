import React from 'react';
import { useApp, AppTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  CircleDollarSign,
  FileCheck2,
  CheckSquare,
  FolderClosed,
  Bot,
  Cpu,
  BarChart3,
  Settings,
  ShieldAlert,
  Sparkles,
  Zap,
  MessageSquare,
} from 'lucide-react';

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  roles?: string[]; // If specified, only visible to these roles
}

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, currentUser, activeWorkerApprovals, setShowSubscriptionModal } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forum', label: 'Forum & Diskusi Tim', icon: MessageSquare, badge: 'AI Copilot', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'officemap', label: 'Denah Kantor', icon: Building2, badge: 'Interaktif' },
    { id: 'digitalteam', label: 'Digital Team (AI)', icon: Bot, badge: activeWorkerApprovals.length > 0 ? `${activeWorkerApprovals.length} Butuh Review` : '6 AI', badgeColor: activeWorkerApprovals.length > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300' },
    { id: 'aiworkspace', label: 'AI Workspace Node', icon: Cpu },
    { id: 'employees', label: 'Karyawan', icon: Users },
    { id: 'attendance', label: 'Presensi & GPS', icon: Clock },
    { id: 'leave', label: 'Cuti & Izin', icon: CalendarDays },
    { id: 'payroll', label: 'Payroll & Gaji', icon: CreditCard, roles: ['owner', 'hr', 'finance', 'employee'] },
    { id: 'finance', label: 'Finance & Kas', icon: CircleDollarSign, roles: ['owner', 'finance'] },
    { id: 'tax', label: 'Tax Center', icon: FileCheck2, roles: ['owner', 'finance', 'tax'] },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare },
    { id: 'documents', label: 'Pusat Dokumen', icon: FolderClosed },
    { id: 'reports', label: 'Laporan Kantor', icon: BarChart3, roles: ['owner', 'hr', 'finance', 'manager'] },
    { id: 'settings', label: 'Pengaturan Kantor', icon: Settings, roles: ['owner', 'hr'] },
  ];

  // If superadmin, add link
  if (currentUser.role === 'superadmin') {
    navItems.unshift({
      id: 'superadmin',
      label: 'Super Admin Portal',
      icon: ShieldAlert,
      badge: 'Platform Root',
      badgeColor: 'bg-rose-500/20 text-rose-300',
    });
  }

  // Filter based on user role
  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser.role);
  });

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-800 bg-slate-950 p-4 shrink-0">
      <div className="space-y-6">
        {/* Office Mini Badge */}
        <div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Digital Office OS</p>
              <p className="text-[11px] text-slate-400">Human + AI Workforce</p>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400">MENU KANTOR</p>
          <nav className="mt-2 space-y-0.5">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* AI Assistant Worker Status Callout in Footer */}
      <div className="pt-4 border-t border-slate-900">
        <div className="rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 p-3.5 border border-indigo-900/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Digital Team Aktif
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">100% Siap</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
            AI Finance & AI HR sedang memproses berkas otomatis hari ini.
          </p>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="mt-2.5 w-full rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 py-1.5 text-center text-[11px] font-medium text-indigo-200 transition-colors"
          >
            Upgrade Kuota AI
          </button>
        </div>
      </div>
    </aside>
  );
};
