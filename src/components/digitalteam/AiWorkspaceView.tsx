import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Bot,
  Sparkles,
  Activity,
  Terminal,
  Server,
  Zap,
  RefreshCw,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const AiWorkspaceView: React.FC = () => {
  const { aiWorkers, setCurrentTab } = useApp();
  const [pulseTick, setPulseTick] = useState(0);

  // Live telemetry pulse animation simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">AI Workspace — Server Node Digital</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Pusat pemrosesan komputasi otonom para AI Workers yang menangani arsip dokumen, kalkulasi gaji, dan audit kuitansi secara paralel.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('digitalteam')}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 text-xs font-semibold transition-colors"
        >
          <Bot className="h-4 w-4" />
          <span>Kelola Digital Team</span>
        </button>
      </div>

      {/* Futuristic Server Room Hero Visual */}
      <div className="relative rounded-2xl border border-indigo-500/30 bg-slate-950 p-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 items-center">
          {/* Visual Canvas (1 col) */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-indigo-500/40 shadow-2xl">
            <img
              src="/src/assets/images/ai_worker_core_visual_1790356939039.jpg"
              alt="AI Workspace Node"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-4">
              <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
                Node Cluster: KARYAWANMU-CORE-01
              </span>
            </div>
          </div>

          {/* Realtime Live Terminal Telemetry (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  LIVE WORKSPACE CONDUIT
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Uptime: 99.98% · latency: 12ms · AI Load: 44%
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Seluruh 6 AI Workers beroperasi di dalam cluster terisolasi tenant PT KaryawanMu Digital Indonesia.
              Data payroll dan transaksi tersimpan aman dan hanya dapat diakses melalui otorisasi role perusahaan.
            </p>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 font-mono text-[11px] text-slate-300 space-y-1.5">
              <p className="text-emerald-400">&gt; [OK] AI Finance: OCR model pipeline ready.</p>
              <p className="text-sky-300">&gt; [RUN] AI HR: Verifikasi saldo cuti 48 karyawan selesai.</p>
              <p className="text-indigo-300">&gt; [OK] AI Payroll: Draf PPh 21 TER 58/2023 synchronized.</p>
              <p className="text-amber-400">&gt; [PENDING] 1 Human Approval required on finance kuitansi.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Autonomous Worker Terminal Cards with Animated Progress Bars */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Proses Komputasi Berjalan Saat Ini
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiWorkers.map((w, index) => {
            // Slight visual jitter for animated feeling
            const displayProgress = Math.min(100, w.progressPercent + ((pulseTick + index) % 4));

            return (
              <div
                key={w.code}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3 font-mono shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {w.name.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-indigo-400 uppercase tracking-wider">
                    {w.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300">
                  <p className="text-slate-500 text-[10px]">JOB STREAM:</p>
                  <p className="truncate mt-0.5 font-sans font-medium text-slate-200">{w.activeJob}</p>
                </div>

                {/* Futuristic ASCII & Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>PROCESSING</span>
                    <span className="text-emerald-400 font-bold">{displayProgress}%</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${displayProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>QUEUE: {w.activeTasksCount} TASK</span>
                  <span>COMPLETED: {w.completedTasksCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
