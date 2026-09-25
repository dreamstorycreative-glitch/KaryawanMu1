import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AiWorker } from '../../types';
import { askAiWorker } from '../../services/geminiService';
import {
  Bot,
  Users,
  CreditCard,
  CircleDollarSign,
  FileCheck2,
  FolderClosed,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
  Send,
} from 'lucide-react';

export const DigitalTeamView: React.FC = () => {
  const { aiWorkers, activeWorkerApprovals, resolveAiApproval, triggerAiWorkerTask } = useApp();
  const [selectedWorkerCode, setSelectedWorkerCode] = useState<string>('ai_hr');
  const [interactivePrompt, setInteractivePrompt] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const [aiLiveReply, setAiLiveReply] = useState<string | null>(null);

  const selectedWorker = aiWorkers.find((w) => w.code === selectedWorkerCode) || aiWorkers[0];

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactivePrompt.trim()) return;

    setIsAsking(true);
    setAiLiveReply(null);

    const res = await askAiWorker({
      workerCode: selectedWorker.code,
      userPrompt: interactivePrompt,
      context: { currentTask: selectedWorker.activeJob, status: selectedWorker.status },
    });

    setIsAsking(false);
    setAiLiveReply(res.response);
    triggerAiWorkerTask(selectedWorker.code, interactivePrompt);
    setInteractivePrompt('');
  };

  const getWorkerIcon = (code: string) => {
    switch (code) {
      case 'ai_hr': return <Users className="h-5 w-5" />;
      case 'ai_finance': return <CircleDollarSign className="h-5 w-5" />;
      case 'ai_payroll': return <CreditCard className="h-5 w-5" />;
      case 'ai_tax': return <FileCheck2 className="h-5 w-5" />;
      case 'ai_document': return <FolderClosed className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Digital Team — Tim AI Kantor Anda</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            6 AI Digital Workers yang beroperasi otonom, siap didelegasikan tugas operasional dan mematuhi prinsip Human Governance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            6 Workers Ready
          </span>
        </div>
      </div>

      {/* Human Approvals Gate Banner (if any) */}
      {activeWorkerApprovals.length > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-200 text-xs font-bold">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span>Persetujuan Manusia Diperlukan ({activeWorkerApprovals.length} Menunggu)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeWorkerApprovals.map(({ workerId, approval }) => (
              <div
                key={approval.id}
                className="p-3.5 rounded-xl border border-amber-500/30 bg-slate-950/80 flex flex-col justify-between space-y-2 text-xs"
              >
                <div>
                  <span className="text-[10px] font-mono text-amber-400 block">{approval.timestamp}</span>
                  <h4 className="font-bold text-white mt-0.5">{approval.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{approval.detail}</p>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => resolveAiApproval(workerId, approval.id, 'approve')}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                  >
                    Setujui (Approve)
                  </button>
                  <button
                    onClick={() => resolveAiApproval(workerId, approval.id, 'reject')}
                    className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-[11px]"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6 AI Workers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiWorkers.map((worker) => {
          const isSelected = selectedWorker.code === worker.code;
          return (
            <div
              key={worker.code}
              onClick={() => setSelectedWorkerCode(worker.code)}
              className={`rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 bg-slate-900 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                      {getWorkerIcon(worker.code)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{worker.name}</h3>
                      <p className="text-[11px] text-slate-400">{worker.roleTitle}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded ${
                      worker.status === 'processing'
                        ? 'bg-sky-500/20 text-sky-300'
                        : worker.status === 'ready'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {worker.status}
                  </span>
                </div>

                <div className="mt-4 p-2.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <p className="text-[10px] text-slate-500">Pekerjaan Aktif:</p>
                  <p className="text-xs text-slate-200 mt-0.5 font-medium line-clamp-2">{worker.activeJob}</p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Tugas Berjalan: <strong className="text-white font-mono">{worker.activeTasksCount}</strong></span>
                  <span>Selesai: <strong className="text-emerald-400 font-mono">{worker.completedTasksCount}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400">
                <span>Interaksi & Log</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected AI Worker Detail & Interactive Command Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Worker Profile & Capabilities (1 col) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              {getWorkerIcon(selectedWorker.code)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{selectedWorker.name}</h3>
              <p className="text-xs text-indigo-300">{selectedWorker.roleTitle}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Kapabilitas & Tugas Otomatis:</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {selectedWorker.capabilities.map((cap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Riwayat Aktivitas Terkini:</h4>
            <div className="space-y-2">
              {selectedWorker.activityLogs.map((log) => (
                <div key={log.id} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between font-mono text-slate-500 text-[10px]">
                    <span>{log.timestamp}</span>
                    <span className="uppercase text-indigo-400">{log.status}</span>
                  </div>
                  <p className="mt-0.5 text-slate-300">{log.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Command Console & Gemini Response (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Konsol Perintah Interaktif ({selectedWorker.name})</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Powered by Gemini 3.8 Flash</span>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Kirim instruksi langsung atau ajukan pertanyaan terkait operasional {selectedWorker.name}.
            </p>

            {/* AI Output Bubble */}
            {aiLiveReply && (
              <div className="mt-4 p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Bot className="h-4 w-4 text-indigo-400" />
                    Respons {selectedWorker.name}:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Realtime Completed</span>
                </div>
                <div className="text-slate-200 leading-relaxed whitespace-pre-line text-xs font-normal">
                  {aiLiveReply}
                </div>
              </div>
            )}

            {isAsking && (
              <div className="mt-4 p-4 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-slate-400 flex items-center gap-3">
                <span className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></span>
                <span>{selectedWorker.name} sedang memproses instruksi Anda dengan parameter kantor...</span>
              </div>
            )}
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleSendPrompt} className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={interactivePrompt}
              onChange={(e) => setInteractivePrompt(e.target.value)}
              placeholder={`Beri instruksi untuk ${selectedWorker.name} (contoh: ${
                selectedWorker.code === 'ai_hr'
                  ? 'Rekap sisa cuti dan kehadiran tim engineering'
                  : selectedWorker.code === 'ai_finance'
                  ? 'Audit kuitansi kas kecil minggu ini'
                  : 'Cek kepatuhan dan tugas berjalan'
              })...`}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isAsking || !interactivePrompt.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 text-xs font-semibold shadow-md transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
