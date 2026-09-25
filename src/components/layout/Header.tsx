import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  ExternalLink,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    company,
    currentUser,
    setCurrentRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    activeWorkerApprovals,
    setShowSubscriptionModal,
    setShowLanding,
    setCurrentTab,
    currentTab,
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleOptions: { role: UserRole; title: string; desc: string }[] = [
    { role: 'owner', title: 'Hendra Wijaya', desc: 'Owner / Direktur' },
    { role: 'hr', title: 'Maya Safitri', desc: 'HR / HRD Lead' },
    { role: 'manager', title: 'Budi Santoso', desc: 'Engineering Manager' },
    { role: 'finance', title: 'Rina Kusuma', desc: 'Finance & Accounting' },
    { role: 'tax', title: 'Dimas Prasetyo', desc: 'Tax Specialist' },
    { role: 'employee', title: 'Andi Pratama', desc: 'Karyawan (Staff)' },
    { role: 'superadmin', title: 'Super Admin', desc: 'KaryawanMu Platform Admin' },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 md:px-6 backdrop-blur-md">
      {/* Zone 1: Brand & Tenant Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowLanding(true)}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-85"
          title="Buka Landing Page Marketing"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">KaryawanMu</span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                Digital Office
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-xs">{company.name}</p>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Breadcrumb / Context */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
        <span className="text-slate-300 font-medium capitalize">{currentTab.replace('officemap', 'Denah Kantor').replace('digitalteam', 'Tim Digital')}</span>
        <span aria-hidden="true">·</span>
        <span>PT KaryawanMu Digital Indonesia</span>
        <span aria-hidden="true">·</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          6 AI Workers Online
        </span>
      </div>

      {/* Zone 3: Actions (Role Switcher, Notifications, Subscriptions) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Human Approvals Badge Button */}
        {activeWorkerApprovals.length > 0 && (
          <button
            onClick={() => setCurrentTab('digitalteam')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-colors"
            title="Ada tugas AI yang memerlukan konfirmasi Anda"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Persetujuan AI</span>
            <span className="font-mono tabular-nums bg-amber-500 text-slate-950 font-semibold px-1 rounded-sm text-[10px]">
              {activeWorkerApprovals.length}
            </span>
          </button>
        )}

        {/* Subscription Plan Badge */}
        <button
          onClick={() => setShowSubscriptionModal(true)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700/80 text-slate-300 text-xs font-medium hover:border-indigo-500 hover:text-white transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Paket Pro</span>
        </button>

        {/* Landing Page Trigger */}
        <button
          onClick={() => setShowLanding(true)}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900/60 border border-slate-800 text-slate-400 text-xs hover:text-white transition-colors"
          title="Lihat Landing Page Promo"
        >
          <Laptop className="h-3.5 w-3.5" />
          <span>Landing Page</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowRoleDropdown(false);
            }}
            className="relative p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            aria-label="Notifikasi"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl backdrop-blur-xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">Notifikasi Kantor</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>
              <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.linkTab) setCurrentTab(n.linkTab as any);
                      setShowNotifDropdown(false);
                    }}
                    className={`p-2.5 rounded-lg transition-colors cursor-pointer text-left text-xs ${
                      n.read ? 'bg-slate-900/50 hover:bg-slate-800/50 text-slate-400' : 'bg-indigo-950/40 border border-indigo-800/30 text-slate-200 hover:bg-indigo-950/60'
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-indigo-500/50"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-slate-200 leading-tight">{currentUser.name.split(' ')[0]}</p>
              <p className="text-[10px] text-slate-400 leading-tight capitalize">{currentUser.role}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
              <div className="px-2 py-1.5 border-b border-slate-800 text-[11px] text-slate-400">
                Pilih Role untuk Testing Demo:
              </div>
              <div className="mt-1 space-y-1">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.role}
                    onClick={() => {
                      setCurrentRole(opt.role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                      currentUser.role === opt.role
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="leading-tight">{opt.title}</p>
                      <p className="text-[10px] text-slate-500 leading-tight">{opt.desc}</p>
                    </div>
                    {currentUser.role === opt.role && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
