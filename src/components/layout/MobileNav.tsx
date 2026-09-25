import React, { useState } from 'react';
import { useApp, AppTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Clock,
  CheckSquare,
  Bot,
  Menu,
  X,
  CreditCard,
  CircleDollarSign,
  FileCheck2,
  FolderClosed,
  BarChart3,
  CalendarDays,
  Users,
  Settings,
  MessageSquare,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentTab, setCurrentTab, currentUser } = useApp();
  const [showDrawer, setShowDrawer] = useState(false);

  const primaryMobileTabs: { id: AppTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dasbor', icon: LayoutDashboard },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'attendance', label: 'Absen', icon: Clock },
    { id: 'tasks', label: 'Tugas', icon: CheckSquare },
    { id: 'digitalteam', label: 'AI Team', icon: Bot },
  ];

  const drawerTabs: { id: AppTab; label: string; icon: React.ElementType }[] = [
    { id: 'officemap', label: 'Denah Kantor', icon: Building2 },
    { id: 'employees', label: 'Data Karyawan', icon: Users },
    { id: 'leave', label: 'Cuti & Izin', icon: CalendarDays },
    { id: 'payroll', label: 'Payroll & Gaji', icon: CreditCard },
    { id: 'finance', label: 'Finance & Kas', icon: CircleDollarSign },
    { id: 'tax', label: 'Tax Center', icon: FileCheck2 },
    { id: 'documents', label: 'Pusat Dokumen', icon: FolderClosed },
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Bottom Sticky Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg px-2">
        {primaryMobileTabs.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 transition-colors ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setShowDrawer(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 text-slate-400 hover:text-slate-200"
        >
          <Menu className="h-4 w-4" />
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex bg-slate-950/80 backdrop-blur-sm lg:hidden">
          <div className="ml-auto w-4/5 max-w-sm h-full bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Menu KaryawanMu</h3>
                  <p className="text-xs text-slate-400 capitalize">{currentUser.role} View</p>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {drawerTabs.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setShowDrawer(false);
                      }}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-4 w-4 text-slate-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              KaryawanMu Digital Office v2.4
            </div>
          </div>
        </div>
      )}
    </>
  );
};
