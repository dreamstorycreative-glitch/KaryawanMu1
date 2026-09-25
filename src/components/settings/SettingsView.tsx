import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building,
  MapPin,
  Clock,
  Shield,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { company, updateCompany } = useApp();

  const [compName, setCompName] = useState(company.name);
  const [picName, setPicName] = useState(company.picName);
  const [address, setAddress] = useState(company.address);
  const [radiusMeters, setRadiusMeters] = useState(company.officeCoordinates.radiusMeters);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany({
      name: compName,
      picName,
      address,
      officeCoordinates: {
        ...company.officeCoordinates,
        radiusMeters,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Top Header */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Pengaturan Kantor & Konfigurasi Sistem</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Kelola identitas perusahaan, radius toleransi GPS absensi, dan preferensi digital office.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Pengaturan perusahaan berhasil disimpan ke sistem!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 text-xs">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <Building className="h-4 w-4 text-indigo-400" />
            <span>Identitas Perusahaan (Multi-Tenant Entity)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Nama Perusahaan / PT</label>
              <input
                type="text"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Nama Direktur / PIC</label>
              <input
                type="text"
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1">Alamat Kantor Pusat</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-400" />
            <span>Koordinat Presensi & Batas Geofencing</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Batas Radius Kantor Toleransi Presensi (Meter)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="20"
                  max="250"
                  value={radiusMeters}
                  onChange={(e) => setRadiusMeters(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <span className="font-mono font-bold text-white w-14">{radiusMeters} m</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Karyawan yang melakukan absen lebih dari {radiusMeters} meter dari kantor akan ditandai WFH.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-xs font-semibold shadow-md transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
