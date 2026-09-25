import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficeDesk, Employee } from '../../types';
import {
  Building2,
  Plus,
  Trash2,
  Users,
  Search,
  Move,
  CheckCircle2,
  UserCheck,
  Maximize2,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export const OfficeMap: React.FC = () => {
  const {
    officeDesks,
    employees,
    updateDesk,
    assignEmployeeToDesk,
    addDesk,
    deleteDesk,
    setSelectedEmployee,
  } = useApp();

  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const selectedDesk = officeDesks.find((d) => d.id === selectedDeskId);
  const assignedEmployee = employees.find((e) => e.id === selectedDesk?.employeeId);

  // Status mapping
  const statusBadge = (status?: string) => {
    switch (status) {
      case 'hadir':
        return <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">🟢 Hadir di Kantor</span>;
      case 'wfh':
        return <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">🟡 WFH (Remote)</span>;
      case 'meeting':
        return <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-medium">🔵 Sedang Meeting</span>;
      case 'cuti':
        return <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">⚪ Sedang Cuti</span>;
      case 'terlambat':
        return <span className="inline-flex items-center gap-1 text-[10px] text-orange-400 font-medium">🟠 Terlambat</span>;
      case 'tidak_hadir':
        return <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-medium">🔴 Tidak Hadir</span>;
      default:
        return <span className="text-[10px] text-slate-500">Meja Kosong</span>;
    }
  };

  const handleAddNewDesk = () => {
    const newDesk: OfficeDesk = {
      id: `desk_custom_${Date.now()}`,
      code: `DSK-${String(officeDesks.length + 1).padStart(2, '0')}`,
      label: `Meja Kerja ${officeDesks.length + 1}`,
      x: 100 + Math.floor(Math.random() * 200),
      y: 150 + Math.floor(Math.random() * 150),
      width: 90,
      height: 65,
      type: 'desk',
    };
    addDesk(newDesk);
    setSelectedDeskId(newDesk.id);
  };

  // Drag simulation on SVG/Canvas
  const handleMouseDown = (e: React.MouseEvent, deskId: string) => {
    if (!isEditMode) return;
    const targetDesk = officeDesks.find((d) => d.id === deskId);
    if (!targetDesk) return;
    setIsDragging(deskId);
    setDragOffset({
      x: e.clientX - targetDesk.x,
      y: e.clientY - targetDesk.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isEditMode) return;
    const newX = Math.max(10, Math.min(800, e.clientX - dragOffset.x));
    const newY = Math.max(10, Math.min(480, e.clientY - dragOffset.y));
    updateDesk(isDragging, { x: Math.round(newX / 10) * 10, y: Math.round(newY / 10) * 10 });
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const filteredDesks = officeDesks.filter((d) => {
    if (filterDepartment === 'all') return true;
    return d.department === filterDepartment;
  });

  return (
    <div className="space-y-5">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Denah Kantor Interaktif (Office Map)</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Tata letak meja dan ruangan Sahid Sudirman Center Lt. 24. Drag & drop meja, assign karyawan, dan pantau kehadiran realtime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
          >
            <option value="all">Semua Departemen</option>
            <option value="Executive & Direksi">Executive & Direksi</option>
            <option value="HR & Operations">HR & Operations</option>
            <option value="Finance & Tax">Finance & Tax</option>
            <option value="Engineering & Tech">Engineering & Tech</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Marketing & Sales">Marketing & Sales</option>
          </select>

          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isEditMode
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Move className="h-3.5 w-3.5" />
            <span>{isEditMode ? 'Selesai Edit' : 'Edit Tata Letak'}</span>
          </button>

          {isEditMode && (
            <button
              onClick={handleAddNewDesk}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Meja</span>
            </button>
          )}
        </div>
      </div>

      {/* Legend & Guide */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-1">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">🟢 Hadir di Meja</span>
          <span className="flex items-center gap-1.5">🟡 WFH (Remote)</span>
          <span className="flex items-center gap-1.5">🔵 Sedang Meeting</span>
          <span className="flex items-center gap-1.5">⚪ Sedang Cuti</span>
          <span className="flex items-center gap-1.5">🔴 Tidak Hadir</span>
        </div>
        <span className="text-[11px] text-indigo-400 font-medium">
          {isEditMode ? 'Mode Drag Aktif: Geser meja untuk memindahkan posisi' : 'Klik meja untuk membuka profil karyawan'}
        </span>
      </div>

      {/* Interactive Floor Plan Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG/Canvas Area (3 cols) */}
        <div
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-950 p-6 min-h-[560px] relative overflow-auto select-none"
        >
          {/* Floor Plan Boundaries & Watermark Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

          {/* Office Compass & Boundary Labels */}
          <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest pointer-events-none">
            GEDUNG A · PINTU UTARA · KANTOR UTAMA (450 M²)
          </div>

          <div className="relative w-[920px] h-[520px]">
            {filteredDesks.map((desk) => {
              const emp = employees.find((e) => e.id === desk.employeeId);
              const isSelected = selectedDeskId === desk.id;

              const statusColor = emp
                ? {
                    hadir: 'border-emerald-500/70 bg-emerald-950/40 text-emerald-200',
                    wfh: 'border-amber-500/70 bg-amber-950/40 text-amber-200',
                    meeting: 'border-blue-500/70 bg-blue-950/40 text-blue-200',
                    cuti: 'border-slate-600 bg-slate-900/60 text-slate-300',
                    terlambat: 'border-orange-500/70 bg-orange-950/40 text-orange-200',
                    tidak_hadir: 'border-rose-500/70 bg-rose-950/40 text-rose-200',
                  }[emp.todayStatus] || 'border-slate-700 bg-slate-900/80 text-slate-300'
                : desk.type === 'meeting_room'
                ? 'border-indigo-500/50 bg-indigo-950/20 text-indigo-300'
                : desk.type === 'director_room'
                ? 'border-purple-500/50 bg-purple-950/20 text-purple-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-400';

              return (
                <div
                  key={desk.id}
                  onMouseDown={(e) => handleMouseDown(e, desk.id)}
                  onClick={() => {
                    setSelectedDeskId(desk.id);
                    if (!isEditMode && emp) {
                      setSelectedEmployee(emp);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: `${desk.x}px`,
                    top: `${desk.y}px`,
                    width: `${desk.width}px`,
                    height: `${desk.height}px`,
                  }}
                  className={`rounded-xl border p-2 text-left transition-shadow cursor-pointer flex flex-col justify-between ${statusColor} ${
                    isSelected ? 'ring-2 ring-indigo-400 shadow-xl' : 'hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold">{desk.code}</span>
                    {emp && (
                      <span className="h-2 w-2 rounded-full bg-current"></span>
                    )}
                  </div>

                  <div className="truncate">
                    <p className="text-[11px] font-bold text-white truncate">
                      {emp ? emp.name.split(' ')[0] : desk.label}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {emp ? emp.jobTitle : desk.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Desk / Employee Inspector Panel (1 col) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white">Detail Elemen Terpilih</span>
              {selectedDesk && (
                <span className="text-[10px] font-mono text-indigo-400">{selectedDesk.code}</span>
              )}
            </div>

            {selectedDesk ? (
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nama / Label Meja</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={selectedDesk.label}
                      onChange={(e) => updateDesk(selectedDesk.id, { label: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white outline-none"
                    />
                  ) : (
                    <p className="font-semibold text-white">{selectedDesk.label}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Karyawan yang Menempati</label>
                  {assignedEmployee ? (
                    <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 flex items-center gap-3">
                      <img
                        src={assignedEmployee.photo}
                        alt={assignedEmployee.name}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <p className="font-bold text-white truncate">{assignedEmployee.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{assignedEmployee.jobTitle}</p>
                        <div className="mt-1">{statusBadge(assignedEmployee.todayStatus)}</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Belum ada karyawan yang ditugaskan</p>
                  )}
                </div>

                {/* Assign Dropdown in edit mode */}
                {isEditMode && (
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Ubah Penempatan Karyawan</label>
                    <select
                      value={selectedDesk.employeeId || ''}
                      onChange={(e) => assignEmployeeToDesk(selectedDesk.id, e.target.value || undefined)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none text-xs"
                    >
                      <option value="">-- Kosongkan Meja --</option>
                      {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name} ({e.jobTitle})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {assignedEmployee && (
                  <button
                    onClick={() => setSelectedEmployee(assignedEmployee)}
                    className="w-full rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 py-2 text-xs font-semibold transition-colors"
                  >
                    Buka Profil Lengkap Karyawan
                  </button>
                )}

                {isEditMode && (
                  <button
                    onClick={() => {
                      deleteDesk(selectedDesk.id);
                      setSelectedDeskId(null);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 py-2 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus Elemen Ini</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                <Info className="h-6 w-6 mx-auto mb-2 text-slate-600" />
                <p>Pilih meja atau ruangan pada denah untuk melihat informasi lengkap.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p>• Total Meja: {officeDesks.length}</p>
            <p>• Terisi: {officeDesks.filter((d) => d.employeeId).length} Karyawan</p>
          </div>
        </div>
      </div>
    </div>
  );
};
