import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Payslip } from '../../types';
import { PayslipModal } from './PayslipModal';
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Building,
  DollarSign,
  Download,
} from 'lucide-react';

export const PayrollView: React.FC = () => {
  const {
    currentUser,
    payrollPeriod,
    payslips,
    processPayrollRun,
    releasePayrollToPaid,
  } = useApp();

  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleRunAiPayroll = () => {
    processPayrollRun();
    setSuccessToast('AI Payroll Worker telah menyelesaikan rekonsiliasi keterlambatan, BPJS, dan PPh 21!');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleReleaseSalary = () => {
    if (currentUser.role !== 'owner' && currentUser.role !== 'finance') {
      return alert('Hanya Direktur / Finance Lead yang dapat mencairkan penggajian massal.');
    }
    releasePayrollToPaid();
    setSuccessToast('Penggajian September 2026 telah diverifikasi dan status berubah menjadi PAID.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Payroll & Penggajian Karyawan</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Kalkulasi otomatis gaji bruto, tunjangan, potongan absensi/terlambat, BPJS Kesehatan, BPJS TK, dan PPh 21 oleh AI Payroll Worker.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {payrollPeriod.status === 'processing' && (
            <button
              onClick={handleRunAiPayroll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Hitung Ulang (AI Payroll)</span>
            </button>
          )}

          {payrollPeriod.status === 'completed' && (
            <button
              onClick={handleReleaseSalary}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Cairkan Gaji (Setujui Direktur)</span>
            </button>
          )}

          {payrollPeriod.status === 'paid' && (
            <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Payroll Selesai & Terbayar</span>
            </span>
          )}
        </div>
      </div>

      {/* Alert toast */}
      {successToast && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-center justify-between">
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="underline">Tutup</button>
        </div>
      )}

      {/* Period Summary Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div>
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Periode Penggajian Aktif</span>
            <h2 className="text-xl font-bold text-white mt-0.5">September 2026</h2>
            <p className="text-xs text-slate-400">Total {payrollPeriod.employeeCount} karyawan terdaftar</p>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                payrollPeriod.status === 'paid'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : payrollPeriod.status === 'completed'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              }`}
            >
              Status: {payrollPeriod.status}
            </span>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Diverifikasi: {payrollPeriod.processedDate}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
            <p className="text-xs text-slate-400">Total Gaji Bruto</p>
            <p className="text-lg font-bold text-white font-mono mt-1 tabular-nums">
              Rp{payrollPeriod.totalGross.toLocaleString('id-ID')}
            </p>
            <span className="text-[10px] text-slate-400">Gaji Pokok + Tunjangan</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
            <p className="text-xs text-slate-400">Total Potongan (BPJS/Absen)</p>
            <p className="text-lg font-bold text-rose-400 font-mono mt-1 tabular-nums">
              -Rp{payrollPeriod.totalDeduction.toLocaleString('id-ID')}
            </p>
            <span className="text-[10px] text-slate-400">BPJS Kes & Ketenagakerjaan</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
            <p className="text-xs text-slate-400">Estimasi PPh 21 TER</p>
            <p className="text-lg font-bold text-sky-400 font-mono mt-1 tabular-nums">
              Rp{payrollPeriod.totalTax.toLocaleString('id-ID')}
            </p>
            <span className="text-[10px] text-slate-400">Terkoneksi ke Tax Center</span>
          </div>

          <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20">
            <p className="text-xs text-indigo-300 font-semibold">Total Gaji Bersih (Net)</p>
            <p className="text-xl font-extrabold text-white font-mono mt-1 tabular-nums">
              Rp{payrollPeriod.totalNet.toLocaleString('id-ID')}
            </p>
            <span className="text-[10px] text-emerald-400">Siap Ditransfer ke Rekening</span>
          </div>
        </div>
      </div>

      {/* Payslips Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Daftar Slip Gaji Digital Karyawan</h3>
            <p className="text-xs text-slate-400">Klik "Lihat Slip" untuk melihat rincian dan mencetak format resmi PDF</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{payslips.length} Slip Gaji Siap</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Karyawan</th>
                <th className="pb-3 font-semibold">Jabatan</th>
                <th className="pb-3 font-semibold">Gaji Pokok</th>
                <th className="pb-3 font-semibold">Tunjangan</th>
                <th className="pb-3 font-semibold">Potongan</th>
                <th className="pb-3 font-semibold">PPh 21</th>
                <th className="pb-3 font-semibold">Gaji Bersih</th>
                <th className="pb-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {payslips.map((ps) => (
                <tr key={ps.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 pr-3">
                    <p className="font-semibold text-white">{ps.employeeName}</p>
                    <p className="text-[10px] text-slate-400">{ps.department}</p>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-300">{ps.jobTitle}</td>
                  <td className="py-3.5 pr-3 font-mono text-slate-200">
                    Rp{ps.basicSalary.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-slate-200">
                    Rp{ps.allowance.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-rose-400">
                    -Rp{ps.totalDeduction.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-sky-400">
                    Rp{ps.taxPPh21.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 pr-3 font-mono font-bold text-emerald-400">
                    Rp{ps.netSalary.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedPayslip(ps)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-[11px] font-medium transition-colors"
                    >
                      Lihat Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Modal */}
      {selectedPayslip && (
        <PayslipModal
          payslip={selectedPayslip}
          periodName={`${payrollPeriod.monthName} ${payrollPeriod.year}`}
          onClose={() => setSelectedPayslip(null)}
        />
      )}
    </div>
  );
};
