import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Users,
  CreditCard,
  CircleDollarSign,
  FileCheck2,
  Bot,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { employees, payrollPeriod, transactions, taxRecords, aiWorkers } = useApp();

  const [activeReport, setActiveReport] = useState<string>('attendance');
  const [dateFilter, setDateFilter] = useState('2026-09');
  const [deptFilter, setDeptFilter] = useState('all');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const reportTypes = [
    { id: 'attendance', label: 'Laporan Presensi & Kehadiran', icon: Users },
    { id: 'payroll', label: 'Laporan Rekap Payroll & Gaji', icon: CreditCard },
    { id: 'finance', label: 'Laporan Arus Kas & Biaya', icon: CircleDollarSign },
    { id: 'tax', label: 'Laporan Rekap Pajak (PPh & PPN)', icon: FileCheck2 },
    { id: 'ai', label: 'Laporan Aktivitas AI Digital Team', icon: Bot },
  ];

  const handleExport = (format: 'pdf' | 'excel') => {
    setDownloadSuccess(`Ekspor berhasil: ${activeReport.toUpperCase()}_REPORT_${dateFilter}.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Pusat Laporan & Ekspor Analitik Kantor</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Unduh laporan komprehensif dalam format resmi PDF dan spreadsheet Excel untuk rapat direksi dan audit eksternal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* Success notification */}
      {downloadSuccess && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {downloadSuccess}
          </span>
          <button onClick={() => setDownloadSuccess(null)} className="underline">Tutup</button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {reportTypes.map((r) => {
            const Icon = r.icon;
            const isSelected = activeReport === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveReport(r.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-white outline-none font-mono"
          />
        </div>
      </div>

      {/* Report Data Preview Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">
              Pratinjau Data Laporan ({activeReport.toUpperCase()} · Periode {dateFilter})
            </h3>
            <p className="text-xs text-slate-400">Menampilkan 10 baris pertama untuk verifikasi sebelum diunduh</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Status: Siap Unduh</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          {activeReport === 'attendance' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Karyawan</th>
                  <th className="pb-3">Departemen</th>
                  <th className="pb-3">Hari Hadir</th>
                  <th className="pb-3">Hari WFH</th>
                  <th className="pb-3">Cuti Terpakai</th>
                  <th className="pb-3">Keterlambatan</th>
                  <th className="pb-3 text-right">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {employees.slice(0, 7).map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-white">{e.name}</td>
                    <td className="py-3 text-slate-400">{e.department}</td>
                    <td className="py-3 font-mono text-slate-300">21 Hari</td>
                    <td className="py-3 font-mono text-slate-300">1 Hari</td>
                    <td className="py-3 font-mono text-slate-300">0 Hari</td>
                    <td className="py-3 font-mono text-slate-300">{e.todayStatus === 'terlambat' ? '1x' : '0x'}</td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-400">98.5%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReport === 'payroll' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Karyawan</th>
                  <th className="pb-3">Gaji Pokok</th>
                  <th className="pb-3">Tunjangan</th>
                  <th className="pb-3">Potongan BPJS</th>
                  <th className="pb-3">PPh 21 TER</th>
                  <th className="pb-3 text-right">Gaji Bersih (Net)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {employees.slice(0, 7).map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-white">{e.name}</td>
                    <td className="py-3 font-mono text-slate-300">Rp{e.basicSalary.toLocaleString('id-ID')}</td>
                    <td className="py-3 font-mono text-slate-300">Rp{e.allowance.toLocaleString('id-ID')}</td>
                    <td className="py-3 font-mono text-rose-400">-Rp{Math.round(e.basicSalary * 0.03).toLocaleString('id-ID')}</td>
                    <td className="py-3 font-mono text-sky-400">Rp{Math.round(e.basicSalary * 0.05).toLocaleString('id-ID')}</td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-400">
                      Rp{Math.round(e.basicSalary + e.allowance - e.basicSalary * 0.08).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReport === 'finance' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Tanggal</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">Pihak Vendor</th>
                  <th className="pb-3">Metode Akun</th>
                  <th className="pb-3 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-mono text-slate-400">{t.date}</td>
                    <td className="py-3 text-slate-300">{t.category}</td>
                    <td className="py-3 font-semibold text-white">{t.vendor}</td>
                    <td className="py-3 font-mono text-slate-400">{t.account}</td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      Rp{t.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReport === 'ai' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">AI Worker</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Pekerjaan Aktif</th>
                  <th className="pb-3">Tugas Selesai</th>
                  <th className="pb-3 text-right">Human Approvals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {aiWorkers.map((w) => (
                  <tr key={w.code} className="hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-white">{w.name}</td>
                    <td className="py-3 uppercase text-emerald-400 font-mono text-[10px]">{w.status}</td>
                    <td className="py-3 text-slate-300">{w.activeJob}</td>
                    <td className="py-3 font-mono text-slate-200">{w.completedTasksCount} Tugas</td>
                    <td className="py-3 text-right font-mono text-amber-400 font-bold">{w.pendingApprovals.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
