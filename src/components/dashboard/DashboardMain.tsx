import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle2,
  Home,
  CalendarDays,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  Sparkles,
  ShieldAlert,
  CreditCard,
  Building2,
  Clock,
  TrendingUp,
  MapPin,
  ChevronRight,
  MessageSquare,
  Lightbulb,
} from 'lucide-react';

export const DashboardMain: React.FC = () => {
  const {
    currentUser,
    employees,
    officeDesks,
    aiWorkers,
    tasks,
    payrollPeriod,
    transactions,
    activeWorkerApprovals,
    forumMessages,
    setCurrentTab,
    setSelectedEmployee,
    performAttendanceCheckIn,
    todayEmployeeAttendance,
  } = useApp();

  // Summary counts
  const totalEmployees = 48; // Full company headcount
  const hadirCount = employees.filter((e) => e.todayStatus === 'hadir').length + 34; // Sample realistic numbers
  const wfhCount = 2;
  const cutiCount = 2;
  const tidakHadirCount = 1;
  const terlambatCount = 2;

  // Active AI workers summary
  const onlineAiWorkers = aiWorkers.filter((w) => w.status === 'online' || w.status === 'processing');

  // Top pending tasks
  const urgentTasks = tasks.slice(0, 4);

  // Quick check-in action
  const handleQuickCheckIn = () => {
    const res = performAttendanceCheckIn();
    alert(res.message);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-400">Pusat Kendali Kantor</span>
              <span className="h-1 w-1 rounded-full bg-slate-600"></span>
              <span className="text-xs text-slate-400">Jumat, 25 September 2026</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Selamat Pagi, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Berikut aktivitas kantor dan tim digital Anda hari ini. Manusia bekerja, AI membantu.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {!todayEmployeeAttendance ? (
              <button
                onClick={handleQuickCheckIn}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
              >
                <Clock className="h-4 w-4" />
                <span>Presensi Masuk Sekarang</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Absen Masuk: {todayEmployeeAttendance.checkIn}</span>
              </div>
            )}
            <button
              onClick={() => setCurrentTab('officemap')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Building2 className="h-4 w-4 text-slate-400" />
              <span>Buka Denah</span>
            </button>
          </div>
        </div>
      </div>

      {/* Human Governance Alert Banner (if any) */}
      {activeWorkerApprovals.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-200">
                ⚠️ {activeWorkerApprovals.length} Tindakan AI Membutuhkan Human Approval
              </p>
              <p className="text-[11px] text-amber-300/80">
                AI Finance Worker mendeteksi kuitansi baru yang membutuhkan persetujuan pencatatan ke buku kas.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('digitalteam')}
            className="self-start sm:self-auto rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
          >
            Review Sekarang
          </button>
        </div>
      )}

      {/* Ringkasan Hari Ini: 6 Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ringkasan Kehadiran Hari Ini</h2>
          <span className="text-[11px] text-slate-400">Radius Kantor: 100 Meter</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Karyawan</span>
              <Users className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">{totalEmployees}</p>
            <span className="text-[10px] text-slate-400">6 Departemen</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex items-center justify-between text-emerald-400 text-xs">
              <span>Hadir di Kantor</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-400 font-mono tabular-nums">{hadirCount}</p>
            <span className="text-[10px] text-slate-400">Dalam Radius 100m</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex items-center justify-between text-amber-400 text-xs">
              <span>Bekerja WFH</span>
              <Home className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-400 font-mono tabular-nums">{wfhCount}</p>
            <span className="text-[10px] text-slate-400">Remote Approved</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex items-center justify-between text-sky-400 text-xs">
              <span>Sedang Cuti</span>
              <CalendarDays className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-sky-400 font-mono tabular-nums">{cutiCount}</p>
            <span className="text-[10px] text-slate-400">Cuti Terjadwal</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex items-center justify-between text-rose-400 text-xs">
              <span>Tidak Hadir</span>
              <XCircle className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-rose-400 font-mono tabular-nums">{tidakHadirCount}</p>
            <span className="text-[10px] text-slate-400">Perlu Konfirmasi</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex items-center justify-between text-orange-400 text-xs">
              <span>Terlambat</span>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-orange-400 font-mono tabular-nums">{terlambatCount}</p>
            <span className="text-[10px] text-slate-400">&gt; 09:15 WIB</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Office Map Preview & Digital Team Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Office Map Preview (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Denah Kantor Interaktif</h3>
                <span className="text-[11px] text-slate-400">· Sahid Sudirman Center Lt. 24</span>
              </div>
              <button
                onClick={() => setCurrentTab('officemap')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Edit Denah</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Status Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Hadir</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500"></span> WFH</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500"></span> Meeting</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400"></span> Cuti</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Tidak Hadir</span>
            </div>

            {/* Interactive Grid Canvas Preview */}
            <div className="mt-4 relative rounded-xl border border-slate-800/90 bg-slate-950 p-4 overflow-x-auto min-h-[220px]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 min-w-[500px]">
                {officeDesks.slice(0, 8).map((desk) => {
                  const assignedEmp = employees.find((e) => e.id === desk.employeeId);
                  const statusColors: Record<string, string> = {
                    hadir: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
                    wfh: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
                    meeting: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
                    cuti: 'border-slate-600 bg-slate-900/40 text-slate-400',
                    terlambat: 'border-orange-500/40 bg-orange-950/20 text-orange-300',
                    tidak_hadir: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
                  };

                  const currentStatus = assignedEmp?.todayStatus || 'hadir';

                  return (
                    <div
                      key={desk.id}
                      onClick={() => {
                        if (assignedEmp) setSelectedEmployee(assignedEmp);
                      }}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] ${
                        assignedEmp ? statusColors[currentStatus] : 'border-slate-800 bg-slate-900/30 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-semibold">{desk.code}</span>
                        <span className="capitalize">{assignedEmp ? currentStatus : 'Kosong'}</span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-white truncate">
                        {assignedEmp ? assignedEmp.name : desk.label}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {assignedEmp ? assignedEmp.jobTitle : desk.department || 'Area Bebas'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
            <span>Klik meja untuk melihat detail profil karyawan</span>
            <span className="font-mono text-indigo-400">Total 30 Meja</span>
          </div>
        </div>

        {/* Digital Team Live Status (1 col) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">AI Digital Team</h3>
              </div>
              <button
                onClick={() => setCurrentTab('digitalteam')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Lihat Semua
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Apa yang sedang dikerjakan tim digital Anda hari ini:
            </p>

            <div className="mt-3 space-y-2.5">
              {aiWorkers.slice(0, 4).map((w) => (
                <div key={w.code} className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{w.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      {w.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 truncate">{w.activeJob}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${w.progressPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{w.progressPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('aiworkspace')}
            className="mt-4 w-full rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Buka AI Workspace Node</span>
          </button>
        </div>
      </div>

      {/* Row 3: Tasks Delegated to Human & AI + Finance Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Delegation Board (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Delegasi Tugas Kantor</h3>
              <p className="text-xs text-slate-400">Pekerjaan dibagi antara Human Team & AI Workers</p>
            </div>
            <button
              onClick={() => setCurrentTab('tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Lihat Kanban
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-800/80">
            {urgentTasks.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                      t.assigneeType === 'ai'
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {t.assigneeType === 'ai' ? <Bot className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{t.title}</p>
                    <p className="text-[11px] text-slate-400">
                      Ditugaskan ke: <span className="text-slate-300 font-medium">{t.assigneeName}</span> · {t.department}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                      t.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : t.status === 'in_progress'
                        ? 'bg-sky-500/10 text-sky-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                  <p className="mt-1 text-[10px] text-slate-500 font-mono">Batas: {t.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finance & Payroll Overview (1 col) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Payroll & Kas Kantor</h3>
              </div>
              <button
                onClick={() => setCurrentTab('payroll')}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Detail
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                <p className="text-[11px] text-slate-400">Payroll Periode September 2026</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-white font-mono tabular-nums">
                    Rp{payrollPeriod.totalNet.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase font-bold">
                    {payrollPeriod.status}
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">48 Karyawan · Dihitung oleh AI Payroll</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                <p className="text-[11px] text-slate-400">Kas Operasional & Laba Rugi Q3</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                    +Rp42.800.000
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Net Flow</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">BCA Operasional & Mandiri Klop</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('finance')}
            className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Scan Kuitansi via AI Finance</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Forum & Ide Terkini Tim Widget */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Forum Diskusi & Gagasan Inovasi
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold border border-indigo-500/30">
                  AI Copilot Live
                </span>
              </h3>
              <p className="text-xs text-slate-400">Diskusi terbuka tim kantor dan pertukaran ide bersama AI</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('forum')}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 text-xs font-semibold transition-all self-start sm:self-auto shadow-sm"
          >
            <span>Buka Forum Chat & Tanya AI</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {forumMessages
            .filter((m) => m.ideaCard || m.isAi)
            .slice(-3)
            .map((msg) => (
              <div
                key={msg.id}
                onClick={() => setCurrentTab('forum')}
                className="cursor-pointer group rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 p-3.5 transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-300">{msg.senderName}</span>
                    {msg.isAi && (
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-semibold">
                        AI
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>

                {msg.ideaCard ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      💡 {msg.ideaCard.category}
                    </span>
                    <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {msg.ideaCard.title}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{msg.ideaCard.summary}</p>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>👍 {msg.ideaCard.votes} Dukungan suara</span>
                      <span className="text-indigo-400 font-medium">Bahas di Forum →</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300 line-clamp-2">{msg.content}</p>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-indigo-400 font-medium">
                      <span>{msg.reactions.length} reaksi</span>
                      <span>Buka thread →</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
