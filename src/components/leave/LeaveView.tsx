import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveRequest } from '../../types';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

export const LeaveView: React.FC = () => {
  const {
    currentUser,
    employees,
    leaveRequests,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
  } = useApp();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form states
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Cuti Tahunan');
  const [startDate, setStartDate] = useState('2026-10-05');
  const [endDate, setEndDate] = useState('2026-10-06');
  const [daysCount, setDaysCount] = useState(2);
  const [reason, setReason] = useState('');

  // Current employee leave balance
  const currentEmployee = employees.find((e) => e.name === currentUser.name) || employees[0];
  const leaveBalance = currentEmployee?.leaveBalance ?? 12;

  // Counts
  const totalRequests = leaveRequests.length;
  const pendingCount = leaveRequests.filter((r) => r.status.includes('pending')).length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = leaveRequests.filter((r) => r.status === 'rejected').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return alert('Mohon isi alasan cuti');
    submitLeaveRequest({
      employeeId: currentEmployee.id,
      employeeName: currentEmployee.name,
      department: currentEmployee.department,
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason,
      attachmentName: 'surat_pengajuan.pdf',
    });
    setShowApplyModal(false);
    setReason('');
  };

  const filteredRequests = leaveRequests.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Manajemen Cuti & Izin Kantor</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Pengajuan cuti online dengan persetujuan berjenjang: Karyawan → Manager → HRD. Kuota terpotong otomatis saat disetujui.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Ajukan Cuti Baru</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Sisa Jatah Cuti Anda</p>
          <p className="mt-1 text-2xl font-bold text-indigo-400 font-mono tabular-nums">{leaveBalance} Hari</p>
          <span className="text-[10px] text-slate-400">Dari total kuota 12 hari/tahun</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Menunggu Approval</p>
          <p className="mt-1 text-2xl font-bold text-amber-400 font-mono tabular-nums">{pendingCount}</p>
          <span className="text-[10px] text-slate-400">Butuh verifikasi Manager/HR</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Cuti Disetujui</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400 font-mono tabular-nums">{approvedCount}</p>
          <span className="text-[10px] text-slate-400">Sudah memotong saldo</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Pengajuan Ditolak</p>
          <p className="mt-1 text-2xl font-bold text-rose-400 font-mono tabular-nums">{rejectedCount}</p>
          <span className="text-[10px] text-slate-400">Tidak memotong saldo</span>
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Daftar Pengajuan Cuti</h3>
            <p className="text-xs text-slate-400">Alur persetujuan terintegrasi dengan AI HR Worker</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="pending_manager">Pending Manager</option>
              <option value="pending_hr">Pending HR</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Karyawan</th>
                <th className="pb-3 font-semibold">Jenis Cuti</th>
                <th className="pb-3 font-semibold">Rentang Waktu</th>
                <th className="pb-3 font-semibold">Durasi</th>
                <th className="pb-3 font-semibold">Alasan</th>
                <th className="pb-3 font-semibold">Status Persetujuan</th>
                <th className="pb-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 pr-3">
                    <p className="font-semibold text-white">{req.employeeName}</p>
                    <p className="text-[10px] text-slate-400">{req.department}</p>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="text-slate-300 font-medium">{req.leaveType}</span>
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-slate-400">
                    {req.startDate} s/d {req.endDate}
                  </td>
                  <td className="py-3.5 pr-3 font-mono font-bold text-white">{req.daysCount} Hari</td>
                  <td className="py-3.5 pr-3 max-w-xs truncate text-slate-400">{req.reason}</td>
                  <td className="py-3.5 pr-3">
                    {req.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                        <CheckCircle2 className="h-3 w-3" /> Disetujui HR
                      </span>
                    ) : req.status === 'pending_hr' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded font-medium">
                        <Clock className="h-3 w-3" /> Menunggu HR (Mgr OK)
                      </span>
                    ) : req.status === 'pending_manager' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-medium">
                        <Clock className="h-3 w-3" /> Menunggu Manager
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-medium">
                        <XCircle className="h-3 w-3" /> Ditolak
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    {req.status === 'pending_manager' && (currentUser.role === 'manager' || currentUser.role === 'owner') && (
                      <button
                        onClick={() => approveLeaveRequest(req.id, 'manager')}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px]"
                      >
                        Setujui Manager
                      </button>
                    )}
                    {req.status === 'pending_hr' && (currentUser.role === 'hr' || currentUser.role === 'owner') && (
                      <button
                        onClick={() => approveLeaveRequest(req.id, 'hr')}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px]"
                      >
                        Approval Final HR
                      </button>
                    )}
                    {req.status.includes('pending') && (
                      <button
                        onClick={() => rejectLeaveRequest(req.id)}
                        className="px-2 py-1 rounded border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 font-medium text-[11px]"
                      >
                        Tolak
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Form Pengajuan Cuti</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sisa saldo cuti Anda: {leaveBalance} hari kerja</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Jenis Cuti</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                >
                  <option value="Cuti Tahunan">Cuti Tahunan</option>
                  <option value="Cuti Sakit">Cuti Sakit (Surat Dokter)</option>
                  <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                  <option value="Cuti Khusus">Cuti Khusus (Menikah/Duka)</option>
                  <option value="Izin">Izin Tidak Masuk</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Jumlah Hari Kerja</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Alasan Cuti</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Jelaskan keperluan dan delegasi tugas pekerjaan Anda..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
