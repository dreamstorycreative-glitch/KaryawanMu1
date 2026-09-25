import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Check,
  Building,
  MapPin,
  Clock,
  UserPlus,
  Network,
  LayoutGrid,
  Bot,
  PartyPopper,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { showOnboarding, setShowOnboarding, company, updateCompany, aiWorkers, setCurrentTab } = useApp();
  const [step, setStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    companyName: company.name,
    picName: company.picName,
    email: company.email,
    whatsapp: company.whatsapp,
    address: company.address,
    employeeCount: company.employeeCount,
    industry: company.industry,
    radiusMeters: 100,
    startTime: '09:00',
    endTime: '18:00',
    workDays: 'Senin - Jumat',
    activeAiWorkers: aiWorkers.map((w) => w.code),
  });

  if (!showOnboarding) return null;

  const stepsList = [
    { num: 1, title: 'Informasi Perusahaan', icon: Building },
    { num: 2, title: 'Lokasi Kantor', icon: MapPin },
    { num: 3, title: 'Jam Kerja', icon: Clock },
    { num: 4, title: 'Karyawan', icon: UserPlus },
    { num: 5, title: 'Struktur Organisasi', icon: Network },
    { num: 6, title: 'Denah Meja', icon: LayoutGrid },
    { num: 7, title: 'Aktifkan AI Team', icon: Bot },
    { num: 8, title: 'Siap Digunakan', icon: PartyPopper },
  ];

  const handleFinish = () => {
    updateCompany({
      name: formData.companyName,
      picName: formData.picName,
      email: formData.email,
      whatsapp: formData.whatsapp,
      address: formData.address,
      employeeCount: Number(formData.employeeCount),
      industry: formData.industry,
    });
    setShowOnboarding(false);
    setCurrentTab('dashboard');
  };

  const progressPercent = Math.round((step / 8) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-white">Setup Kantor Digital Baru</h2>
            <p className="text-xs text-slate-400">Langkah {step} dari 8 · {stepsList[step - 1].title}</p>
          </div>
          <button
            onClick={() => setShowOnboarding(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-indigo-500 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm font-medium">Lengkapi profil dasar entitas kantor Anda:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-slate-400 block mb-1">Nama Perusahaan / PT</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Nama PIC / Penanggung Jawab</label>
                  <input
                    type="text"
                    value={formData.picName}
                    onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Resmi Perusahaan</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Nomor WhatsApp PIC</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-400 block mb-1">Alamat Gedung / Kantor</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Jumlah Karyawan Awal</label>
                  <input
                    type="number"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Industri Perusahaan</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm font-medium">Tentukan radius presensi GPS kantor:</p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Koordinat Gedung Terdaftar</span>
                  <span className="font-mono text-indigo-400">-6.2088° S, 106.8456° E</span>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Radius Toleransi Presensi (Meter)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="30"
                      max="300"
                      step="10"
                      value={formData.radiusMeters}
                      onChange={(e) => setFormData({ ...formData, radiusMeters: Number(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                    <span className="font-mono text-white text-sm font-bold w-16">{formData.radiusMeters} m</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-900/50 text-[11px] text-slate-300">
                  ℹ️ Jika karyawan berada di luar radius {formData.radiusMeters} meter, sistem akan otomatis mendeteksi status kerja sebagai WFH atau memunculkan peringatan.
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm font-medium">Pengaturan Jam Masuk & Pulang:</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Jam Masuk Kerja</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Jam Pulang Kerja</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-slate-800/60 p-3 text-[11px] text-slate-400">
                Toleransi keterlambatan sistem: 15 menit. Karyawan yang absen lewat 09:15 WIB akan tercatat memiliki potongan late deduction pada slip payroll.
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm font-medium">Demo Data Karyawan Telah Dimuat:</p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span>Nama Karyawan</span>
                  <span>Jabatan & Divisi</span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-200">
                  <span>Hendra Wijaya</span>
                  <span className="text-indigo-400 font-mono">CEO · Executive</span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-200">
                  <span>Maya Safitri</span>
                  <span className="text-indigo-400 font-mono">HRD Lead · HR</span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-200">
                  <span>Budi Santoso</span>
                  <span className="text-indigo-400 font-mono">Manager · Engineering</span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-200">
                  <span>Rina Kusuma</span>
                  <span className="text-indigo-400 font-mono">Finance Lead · Finance</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-400">✓ 48 Karyawan demo sudah siap disinkronkan.</p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm font-medium">Struktur 6 Departemen Standar:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Executive & Direksi', 'HR & Operations', 'Finance & Tax', 'Engineering & Tech', 'Product & Design', 'Marketing & Sales'].map((dept, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-slate-800 bg-slate-800/40 text-slate-200 flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{dept}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm font-medium">Denah Kantor Interaktif:</p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <LayoutGrid className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-xs text-white font-semibold">30 Meja Kerja & 4 Ruangan Telah Terpetakan</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Anda dapat melakukan drag & drop denah, alokasi kursi, dan melihat status realtime kehadiran di menu "Denah Kantor".
                </p>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm font-medium">Aktivasi AI Digital Workers:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {aiWorkers.map((w) => (
                  <div key={w.code} className="p-2.5 rounded-lg border border-indigo-900/60 bg-indigo-950/30 text-indigo-200 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{w.name}</p>
                      <p className="text-[10px] text-slate-400">{w.roleTitle}</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Semua AI Worker akan bertindak dengan prinsip Human Governance.
              </p>
            </div>
          )}

          {step === 8 && (
            <div className="text-center py-6 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto">
                <PartyPopper className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Setup Selesai! Kantor Siap Berjalan</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Platform digital office {formData.companyName} telah siap dengan Human Team & AI Digital Workers.
              </p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-4">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 8 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-sm"
            >
              <span>Lanjut</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg shadow-sm"
            >
              <span>Masuk Dashboard Kantor</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
