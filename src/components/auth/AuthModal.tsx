import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  Mail,
  Lock,
  Building,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, setCurrentRole, setShowOnboarding } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [regData, setRegData] = useState({
    companyName: '',
    picName: '',
    email: '',
    whatsapp: '',
    address: '',
    employeeCount: 20,
    industry: 'Teknologi',
  });

  if (!showAuthModal) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAuthModal(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAuthModal(false);
    setShowOnboarding(true); // Direct to onboarding wizard!
  };

  const quickRoles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'owner', title: 'Hendra Wijaya', desc: 'Direktur / Owner' },
    { role: 'hr', title: 'Maya Safitri', desc: 'HR / HRD Lead' },
    { role: 'finance', title: 'Rina Kusuma', desc: 'Finance Lead' },
    { role: 'employee', title: 'Andi Pratama', desc: 'Karyawan (Staff)' },
    { role: 'superadmin', title: 'Super Admin', desc: 'Platform Admin' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              {mode === 'login' && 'Masuk ke KaryawanMu'}
              {mode === 'register' && 'Registrasi Perusahaan Baru'}
              {mode === 'forgot' && 'Reset Kata Sandi'}
              {mode === 'verify' && 'Verifikasi Email Perusahaan'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Digital Team untuk Kantor Anda</p>
          </div>
          <button onClick={() => setShowAuthModal(false)} className="p-1 rounded-md text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        {mode === 'login' && (
          <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Quick Demo Login:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {quickRoles.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => {
                    setCurrentRole(r.role);
                    setShowAuthModal(false);
                  }}
                  className="px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-left text-[11px] transition-colors"
                >
                  <p className="font-semibold text-white leading-tight">{r.title}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form: Login */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Email Perusahaan</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.co.id"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Kata Sandi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <button type="button" onClick={() => setMode('forgot')} className="hover:text-indigo-400">
                Lupa kata sandi?
              </button>
              <button type="button" onClick={() => setMode('register')} className="text-indigo-400 hover:underline">
                Daftar Perusahaan Baru
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition-colors"
            >
              Masuk Dashboard
            </button>
          </form>
        )}

        {/* Form: Register Perusahaan */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="text-slate-400 block mb-1">Nama Perusahaan / PT *</label>
              <input
                type="text"
                required
                value={regData.companyName}
                onChange={(e) => setRegData({ ...regData, companyName: e.target.value })}
                placeholder="Contoh: PT KaryawanMu Digital"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Nama PIC (Penanggung Jawab) *</label>
              <input
                type="text"
                required
                value={regData.picName}
                onChange={(e) => setRegData({ ...regData, picName: e.target.value })}
                placeholder="Nama Anda"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Email Resmi *</label>
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="admin@pt.co.id"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">No. WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={regData.whatsapp}
                  onChange={(e) => setRegData({ ...regData, whatsapp: e.target.value })}
                  placeholder="0812xxxxxxxx"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Alamat Gedung / Kantor *</label>
              <input
                type="text"
                required
                value={regData.address}
                onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                placeholder="Gedung / Jalan kantor"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Estimasi Karyawan</label>
                <input
                  type="number"
                  value={regData.employeeCount}
                  onChange={(e) => setRegData({ ...regData, employeeCount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Industri</label>
                <input
                  type="text"
                  value={regData.industry}
                  onChange={(e) => setRegData({ ...regData, industry: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition-colors"
              >
                Lanjut ke Onboarding Wizard
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-[11px] text-slate-400 hover:text-white mt-2"
              >
                Sudah punya akun? Masuk
              </button>
            </div>
          </form>
        )}

        {/* Forgot password */}
        {mode === 'forgot' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-300">
              Masukkan email perusahaan Anda untuk menerima tautan reset kata sandi:
            </p>
            <input
              type="email"
              placeholder="nama@perusahaan.co.id"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
            />
            <button
              onClick={() => {
                alert('Tautan reset kata sandi telah dikirim ke email Anda.');
                setMode('login');
              }}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Kirim Tautan Reset
            </button>
            <button
              onClick={() => setMode('login')}
              className="w-full text-center text-[11px] text-slate-400 hover:text-white"
            >
              Kembali ke Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
