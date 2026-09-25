import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types';
import {
  CheckSquare,
  Plus,
  Users,
  Bot,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, employees, aiWorkers } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'human' | 'ai'>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeType, setAssigneeType] = useState<'human' | 'ai'>('ai');
  const [assigneeId, setAssigneeId] = useState<string>(aiWorkers[0].code);
  const [department, setDepartment] = useState('Engineering & Tech');
  const [priority, setPriority] = useState<TaskItem['priority']>('medium');
  const [dueDate, setDueDate] = useState('2026-09-30');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Judul tugas wajib diisi');

    const assigneeName =
      assigneeType === 'ai'
        ? aiWorkers.find((w) => w.code === assigneeId)?.name || 'AI Worker'
        : employees.find((e) => e.id === assigneeId)?.name || 'Staff Karyawan';

    addTask({
      title,
      description,
      assigneeType,
      assigneeId,
      assigneeName,
      department,
      priority,
      dueDate,
      status: 'todo',
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const columns: { id: TaskItem['status']; label: string }[] = [
    { id: 'todo', label: 'Belum Mulai (To Do)' },
    { id: 'in_progress', label: 'Sedang Berjalan' },
    { id: 'review', label: 'Menunggu Review' },
    { id: 'completed', label: 'Selesai' },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (filterType === 'all') return true;
    return t.assigneeType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Task Management & Papan Delegasi Kantor</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Distribusikan tugas pekerjaan secara merata antara Human Team dan 6 AI Digital Workers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterType === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('human')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterType === 'human' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              👤 Human
            </button>
            <button
              onClick={() => setFilterType('ai')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterType === 'ai' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              🤖 AI Worker
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Tugas Baru</span>
          </button>
        </div>
      </div>

      {/* Kanban Board (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-bold text-white">{col.label}</span>
                <span className="font-mono text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded">
                  {colTasks.length}
                </span>
              </div>

              <div className="mt-3 space-y-3 flex-1 overflow-y-auto min-h-[300px]">
                {colTasks.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 shadow-sm hover:border-slate-700 transition-colors space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          t.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-300'
                            : t.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Batas: {t.dueDate}</span>
                    </div>

                    <h4 className="font-bold text-white leading-tight">{t.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{t.description}</p>

                    {/* Progress bar if present */}
                    {t.progressTotal && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>Progress Otomatis:</span>
                          <span className="text-indigo-400 font-bold">
                            {t.progressCurrent} / {t.progressTotal}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${Math.round(((t.progressCurrent || 0) / t.progressTotal) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded text-[10px] ${
                            t.assigneeType === 'ai' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {t.assigneeType === 'ai' ? <Bot className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                        </div>
                        <span className="text-[11px] text-slate-300 font-medium truncate max-w-[110px]">
                          {t.assigneeName}
                        </span>
                      </div>

                      {/* Quick move selector */}
                      <select
                        value={t.status}
                        onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded px-1.5 py-0.5 outline-none"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Buat Tugas Baru</h3>
            <p className="text-xs text-slate-400 mt-0.5">Berikan tugas kepada Human Team atau AI Digital Worker.</p>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Judul Tugas *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Input 50 kuitansi September"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Deskripsi Tugas</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rincian instruksi pekerjaan..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Tipe Pelaksana</label>
                  <select
                    value={assigneeType}
                    onChange={(e) => {
                      const t = e.target.value as 'human' | 'ai';
                      setAssigneeType(t);
                      setAssigneeId(t === 'ai' ? aiWorkers[0].code : employees[0].id);
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  >
                    <option value="ai">🤖 AI Digital Worker</option>
                    <option value="human">👤 Human Staff</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pilih Anggota</label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  >
                    {assigneeType === 'ai'
                      ? aiWorkers.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.name}
                          </option>
                        ))
                      : employees.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Prioritas</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  >
                    <option value="low">Rendah (Low)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="high">Tinggi (High)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Batas Waktu</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
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
                  Delegasikan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
