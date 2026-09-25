import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import { EmployeeProfileDrawer } from './EmployeeProfileDrawer';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const {
    employees,
    departments,
    addEmployee,
    selectedEmployee,
    setSelectedEmployee,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Employee Form state
  const [newEmp, setNewEmp] = useState({
    name: '',
    email: '',
    whatsapp: '',
    jobTitle: '',
    department: 'Engineering & Tech',
    basicSalary: 12000000,
    allowance: 2000000,
    bankName: 'BCA',
    accountNumber: '',
    npwp: '',
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name.trim()) return alert('Nama karyawan wajib diisi');
    addEmployee({
      name: newEmp.name,
      email: newEmp.email || `${newEmp.name.toLowerCase().replace(/\s+/g, '.')}@karyawanmu.co.id`,
      whatsapp: newEmp.whatsapp || '081200000000',
      jobTitle: newEmp.jobTitle || 'Staff',
      department: newEmp.department,
      basicSalary: Number(newEmp.basicSalary),
      allowance: Number(newEmp.allowance),
      bankName: newEmp.bankName,
      accountNumber: newEmp.accountNumber || '8830129381',
      npwp: newEmp.npwp || '01.234.567.8-012.000',
    });
    setShowAddModal(false);
    setNewEmp({
      name: '',
      email: '',
      whatsapp: '',
      jobTitle: '',
      department: 'Engineering & Tech',
      basicSalary: 12000000,
      allowance: 2000000,
      bankName: 'BCA',
      accountNumber: '',
      npwp: '',
    });
  };

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || e.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Database Karyawan (HRIS Directory)</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Total {employees.length} karyawan terdaftar di PT KaryawanMu Digital Indonesia. Klik karyawan untuk detail profil, payroll, cuti, dan performa.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Karyawan</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama karyawan, jabatan, ID (KMU-001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-4 py-2 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-white outline-none focus:border-indigo-500"
          >
            <option value="all">Semua Departemen ({departments.length})</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => setSelectedEmployee(emp)}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.photo}
                    alt={emp.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500 transition-all"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-slate-400">{emp.jobTitle}</p>
                    <span className="text-[10px] font-mono text-slate-400">{emp.employeeId}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {emp.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Departemen:</span>
                  <span className="text-slate-300 font-medium">{emp.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gaji Pokok:</span>
                  <span className="font-mono text-slate-200">Rp{emp.basicSalary.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status Hari Ini:</span>
                  <span className="text-emerald-400 font-medium capitalize">🟢 {emp.todayStatus}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400 group-hover:text-indigo-300">
              <span>Buka Profil Karyawan</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Tambah Data Karyawan Baru</h3>
            <p className="text-xs text-slate-400 mt-0.5">Lengkapi data dasar untuk pembuatan akun dan slip gaji.</p>

            <form onSubmit={handleCreateEmployee} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Lengkap Karyawan *</label>
                <input
                  type="text"
                  required
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Jabatan Pekerjaan *</label>
                  <input
                    type="text"
                    required
                    value={newEmp.jobTitle}
                    onChange={(e) => setNewEmp({ ...newEmp, jobTitle: e.target.value })}
                    placeholder="Contoh: QA Engineer"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Departemen</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Email Kantor</label>
                  <input
                    type="email"
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    placeholder="nama@karyawanmu.co.id"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={newEmp.whatsapp}
                    onChange={(e) => setNewEmp({ ...newEmp, whatsapp: e.target.value })}
                    placeholder="0812xxxxxxxx"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Gaji Pokok (Rp)</label>
                  <input
                    type="number"
                    value={newEmp.basicSalary}
                    onChange={(e) => setNewEmp({ ...newEmp, basicSalary: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tunjangan (Rp)</label>
                  <input
                    type="number"
                    value={newEmp.allowance}
                    onChange={(e) => setNewEmp({ ...newEmp, allowance: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer */}
      {selectedEmployee && (
        <EmployeeProfileDrawer
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};
