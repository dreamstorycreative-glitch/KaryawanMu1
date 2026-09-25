import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const TaxView: React.FC = () => {
  const { taxRecords, payrollPeriod, toggleTaxChecklist } = useApp();
  const [selectedTax, setSelectedTax] = useState(taxRecords[0]);
  const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);
  const [aiReportSummary, setAiReportSummary] = useState<string | null>(null);

  const handleRunAiAudit = () => {
    setAiAnalysisRunning(true);
    setTimeout(() => {
      setAiAnalysisRunning(false);
      setAiReportSummary(
        'AI Tax Assistant mengonfirmasi bahwa 48 data payroll periode September 2026 telah sesuai dengan ketentuan Tarif Efektif Rata-Rata (TER) PP 58/2023. Semua NIK/NPWP valid. Sisa 1 checklist: verifikasi internal oleh Finance Lead sebelum ekspor file CSV DJP.'
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Tax Center & Kepatuhan Pajak Perusahaan</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Integrasi pelaporan PPh 21 (TER), PPh Badan, dan PPN dengan kalender tenggat resmi DJP serta pendampingan AI Tax Assistant.
          </p>
        </div>

        <button
          onClick={handleRunAiAudit}
          disabled={aiAnalysisRunning}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>{aiAnalysisRunning ? 'AI Tax Sedang Menganalisis...' : 'Audit Kepatuhan Pajak (AI Tax)'}</span>
        </button>
      </div>

      {/* Legal Tax Disclaimer (Mandatory Requirement) */}
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200">
          <p className="font-bold">Disclaimer Kepatuhan Perpajakan Resmi:</p>
          <p className="mt-0.5 text-amber-300/80 leading-relaxed">
            Perhitungan angka pajak dan rekapitulasi data pada sistem KaryawanMu disajikan sebagai draf estimasi internal pendukung.
            Seluruh perhitungan dan pelaporan pajak wajib diverifikasi oleh pihak yang kompeten (Tax Officer / Konsultan Pajak resmi)
            sebelum disampaikan secara resmi ke Direktorat Jenderal Pajak (DJP).
          </p>
        </div>
      </div>

      {/* AI Tax Assistant Realtime Analysis Card */}
      {aiReportSummary && (
        <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Bot className="h-4 w-4 text-indigo-400" />
              <span>Draf Analisis AI Tax Assistant: Masa September 2026</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">100% Data Klop</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{aiReportSummary}</p>
        </div>
      )}

      {/* 3 Tax Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {taxRecords.map((tax) => {
          const isSelected = selectedTax.id === tax.id;
          return (
            <div
              key={tax.id}
              onClick={() => setSelectedTax(tax)}
              className={`rounded-2xl border p-5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-slate-900 shadow-xl'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">{tax.taxType}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                    tax.status === 'reported'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : tax.status === 'ready_for_review'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tax.status.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="mt-2 text-base font-bold text-white">{tax.period}</p>
              <p className="mt-1 text-xs text-slate-400">Estimasi Pajak Terutang:</p>
              <p className="text-xl font-bold text-white font-mono mt-0.5 tabular-nums">
                Rp{tax.amount.toLocaleString('id-ID')}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  Batas: {tax.deadline}
                </span>
                <span className="text-indigo-400 font-medium">Buka Checklist →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Tax Focus: Checklist & Connection to Payroll */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              Checklist Kesiapan: {selectedTax.taxType} ({selectedTax.period})
            </h3>
            <p className="text-xs text-slate-400">
              Kelola kelengkapan dokumen sebelum diserahkan ke DJP Online
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Tenggat Waktu:</span>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
              {selectedTax.deadline}
            </span>
          </div>
        </div>

        {/* Payroll Connection info if PPh 21 */}
        {selectedTax.taxType === 'PPh 21' && (
          <div className="mt-4 p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-indigo-300">Terkoneksi Otomatis dengan Modul Payroll:</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Data rekap gaji September 2026 ({payrollPeriod.employeeCount} karyawan) senilai Rp
                {payrollPeriod.totalGross.toLocaleString('id-ID')} siap diekspor menjadi format formulir 1721.
              </p>
            </div>
            <button
              onClick={() => alert('Data payroll telah disinkronkan ke draf SPT Masa 1721-A1.')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap"
            >
              Sinkronkan Ulang
            </button>
          </div>
        )}

        {/* Checklist items */}
        <div className="mt-5 space-y-2.5">
          {selectedTax.checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleTaxChecklist(selectedTax.id, item.id)}
              className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => {}}
                  className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
                />
                <span className={`text-xs ${item.checked ? 'text-slate-300 line-through' : 'text-white font-medium'}`}>
                  {item.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {item.checked ? '✓ Lengkap' : 'Belum Diverifikasi'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
