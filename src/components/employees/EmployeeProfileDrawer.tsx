import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import {
  X,
  Mail,
  Phone,
  Building,
  Calendar,
  CreditCard,
  FileText,
  Shield,
  Clock,
  CheckCircle2,
  FolderClosed,
  CheckSquare,
  Award,
} from 'lucide-react';

interface Props {
  employee: Employee;
  onClose: () => void;
}

export const EmployeeProfileDrawer: React.FC<Props> = ({ employee, onClose }) => {
  const { officeDesks, attendanceRecords, leaveRequests, payslips, tasks } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'leave' | 'payroll' | 'documents' | 'tasks' | 'performance'>('overview');

  const assignedDesk = officeDesks.find((d) => d.id === employee.deskId);
  const employeePayslip = payslips.find((p) => p.employeeId === employee.id);
  const employeeTasks = tasks.filter((t) => t.assigneeId === employee.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
          <div className="flex items-center gap-4">
            <img
              src={employee.photo}
              alt={employee.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-500/50"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{employee.name}</h2>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                  {employee.employeeId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{employee.jobTitle} · {employee.department}</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-slate-400" />
                  {employee.email}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="h-3 w-3 text-slate-400" />
                  {employee.whatsapp}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/30 px-6 text-xs overflow-x-auto">
          {[
            { id: 'overview', label: 'Ringkasan' },
            { id: 'attendance', label: 'Presensi' },
            { id: 'leave', label: 'Cuti' },
            { id: 'payroll', label: 'Gaji & Payroll' },
            { id: 'documents', label: 'Dokumen' },
            { id: 'tasks', label: 'Tugas' },
            { id: 'performance', label: 'Kinerja' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 px-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === t.id
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="font-semibold text-slate-300 block border-b border-slate-800 pb-2">Informasi Kerja</span>
                <div className="grid grid-cols-2 gap-3 text-slate-400">
                  <div>
                    <span className="block text-[11px] text-slate-400">Departemen</span>
                    <span className="text-white font-medium">{employee.department}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">Tanggal Bergabung</span>
                    <span className="text-white font-mono">{employee.joinedDate}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">Jam Kerja Standar</span>
                    <span className="text-white font-mono">{employee.workingHours}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">Lokasi Meja Kerja</span>
                    <span className="text-indigo-400 font-semibold font-mono">{assignedDesk?.code || 'Meja Fleksibel'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">Status Kepegawaian</span>
                    <span className="text-emerald-400 font-semibold uppercase">{employee.status}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">Sisa Jatah Cuti</span>
                    <span className="text-white font-mono font-bold">{employee.leaveBalance} Hari</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="font-semibold text-slate-300 block border-b border-slate-800 pb-2">Legalitas & Rekening</span>
                <div className="grid grid-cols-2 gap-3 text-slate-400">
                  <div>
                    <span className="block text-[11px] text-slate-400">Nomor Pokok Wajib Pajak (NPWP)</span>
                    <span className="text-white font-mono">{employee.npwp}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">Rekening Bank</span>
                    <span className="text-white font-mono">{employee.bankName} - {employee.accountNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">BPJS Kesehatan</span>
                    <span className="text-white font-mono">{employee.bpjsKesehatan}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">BPJS Ketenagakerjaan</span>
                    <span className="text-white font-mono">{employee.bpjsKetenagakerjaan}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between">
                <div>
                  <p className="text-slate-400">Status Hari Ini</p>
                  <p className="text-sm font-bold text-white capitalize">{employee.todayStatus}</p>
                </div>
                <div className="text-right font-mono">
                  <p className="text-slate-400">Waktu Masuk</p>
                  <p className="text-emerald-400 font-bold">{employee.checkInTime || '-'}</p>
                </div>
              </div>
              <p className="text-slate-400 text-[11px]">Catatan log presensi bulan ini: 21 Hadir, 1 WFH, 0 Alpa.</p>
            </div>
          )}

          {activeTab === 'leave' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-slate-400">Sisa Cuti Tahunan 2026</p>
                <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">{employee.leaveBalance} Hari</p>
                <p className="text-[11px] text-slate-400 mt-2">Dihitung otomatis oleh AI HR Worker saat pengajuan disetujui.</p>
              </div>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <span className="font-semibold text-slate-300">Komponen Penggajian Bulanan</span>
                <div className="flex justify-between py-1 text-slate-400 border-b border-slate-800/80">
                  <span>Gaji Pokok:</span>
                  <span className="font-mono text-white font-bold">Rp{employee.basicSalary.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400 border-b border-slate-800/80">
                  <span>Tunjangan Operasional:</span>
                  <span className="font-mono text-white">Rp{employee.allowance.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400 border-b border-slate-800/80">
                  <span>Bank Penerima:</span>
                  <span className="font-mono text-indigo-300">{employee.bankName} · {employee.accountNumber}</span>
                </div>
              </div>
              {employeePayslip && (
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 flex items-center justify-between">
                  <span>Slip Gaji Terakhir (September 2026):</span>
                  <span className="font-mono font-bold">Rp{employeePayslip.netSalary.toLocaleString('id-ID')} (Terkirim)</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Perjanjian Kontrak Kerja (PKWT/PKWTT)</p>
                  <p className="text-[10px] text-slate-400">PDF · Terverifikasi Legalitas HRD</p>
                </div>
                <span className="text-indigo-400 font-mono text-[11px] cursor-pointer hover:underline">Unduh PDF</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">KTP & NPWP Terindeks</p>
                  <p className="text-[10px] text-slate-400">Arsip Digital Terenkripsi</p>
                </div>
                <span className="text-indigo-400 font-mono text-[11px] cursor-pointer hover:underline">Lihat Berkas</span>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-2">
              {employeeTasks.length > 0 ? (
                employeeTasks.map((t) => (
                  <div key={t.id} className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{t.title}</p>
                      <p className="text-[10px] text-slate-400">Batas: {t.dueDate}</p>
                    </div>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded capitalize text-slate-300">
                      {t.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic py-4 text-center">Belum ada tugas khusus yang ditugaskan minggu ini.</p>
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="font-semibold text-white">Evaluasi Kinerja Q3 2026</span>
                <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">Sangat Baik (A)</p>
                <p className="mt-2 text-slate-400 leading-relaxed text-[11px]">
                  Penyelesaian target sprint 98%, kehadiran tepat waktu 96%, dan kolaborasi tim dinilai memuaskan oleh Lead Department.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
