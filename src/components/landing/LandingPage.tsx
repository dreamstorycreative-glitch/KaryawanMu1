import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  CircleDollarSign,
  FileCheck2,
  CheckSquare,
  FolderClosed,
  Bot,
  Building2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check,
  MessageCircle,
  Play,
  Cpu,
  MessageSquare,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setShowLanding,
    setShowAuthModal,
    setShowOnboarding,
    setShowSubscriptionModal,
    subscriptionPlans,
    adminWhatsApp,
  } = useApp();

  const featureCards = [
    { title: 'HR Management', desc: 'Database karyawan terpusat dengan biodata lengkap, kontrak, struktur jabatan, dan rekam jejak.', icon: Users },
    { title: 'Attendance GPS', desc: 'Presensi presisi berbasis koordinat radius kantor (100m) dan sinkronisasi real-time.', icon: Clock },
    { title: 'Leave Management', desc: 'Jatah cuti otomatis, form izin sakit/tahunan, dan alur persetujuan bertingkat Manager & HR.', icon: CalendarDays },
    { title: 'Payroll Otomatis', desc: 'Perhitungan gaji bruto, BPJS, lembur, pajak, serta pengiriman slip gaji digital massal.', icon: CreditCard },
    { title: 'Finance & Kas', desc: 'Pencatatan kas operasional, laba rugi, invoice klien, dan pembacaan kuitansi pintar.', icon: CircleDollarSign },
    { title: 'Tax Center', desc: 'Monitoring kepatuhan PPh 21, PPh Badan, dan PPN dengan kalender tenggat pelaporan.', icon: FileCheck2 },
    { title: 'Task Management', desc: 'Papan delegasi tugas modern yang dapat diberikan kepada Human Team maupun AI Worker.', icon: CheckSquare },
    { title: 'Forum Chat & Ideation', desc: 'Ruang interaksi terbuka bagi seluruh staf dan owner untuk berdiskusi, usulkan ide, voting, dan brainstorming bersama AI Copilot yang bisa diaktif/nonaktifkan.', icon: MessageSquare },
    { title: 'Pusat Dokumen', desc: 'Penyimpanan arsip digital dengan pencarian semantik AI berbasis bahasa alami.', icon: FolderClosed },
    { title: 'AI Digital Workers', desc: 'Enam asisten digital otonom yang bekerja 24/7 dan selalu meminta Human Approval untuk tindakan sensitif.', icon: Bot },
    { title: 'Office Dashboard', desc: 'Pusat kendali visual dengan denah kantor interaktif status meja karyawan hari ini.', icon: Building2 },
  ];

  const aiWorkersShowcase = [
    { code: 'ai_hr', name: 'AI HR', role: 'Automated People Ops', desc: 'Membantu mengelola data karyawan, rekap absensi, dan validasi jatah cuti.', icon: Users },
    { code: 'ai_finance', name: 'AI Finance', role: 'OCR & Ledger Agent', desc: 'Membaca kuitansi otomatis via OCR dan membantu menginput draf transaksi.', icon: CircleDollarSign },
    { code: 'ai_payroll', name: 'AI Payroll', role: 'Salary Engine', desc: 'Membantu proses kalkulasi payroll, potongan BPJS, dan slip gaji terenkripsi.', icon: CreditCard },
    { code: 'ai_tax', name: 'AI Tax', role: 'Compliance Sentinel', desc: 'Mengingatkan deadline pajak, mengorganisir dokumen, dan draf checklist SPT.', icon: FileCheck2 },
    { code: 'ai_document', name: 'AI Document', role: 'Semantic Indexer', desc: 'Membaca, mengklasifikasikan, dan mencari dokumen kantor lewat instruksi bebas.', icon: FolderClosed },
    { code: 'ai_office', name: 'AI Office', role: 'Operations Assistant', desc: 'Membantu reminder meeting, alokasi meja, task delegasi, dan pengumuman.', icon: Bot },
  ];

  const handleWhatsAppBooking = (planName: string, price: number) => {
    const invoiceId = `KMU-2609-${Math.floor(100 + Math.random() * 900)}`;
    const msg = `Halo Admin KaryawanMu! Saya ingin mengaktifkan Paket ${planName} untuk [Nama PT] dengan Invoice #${invoiceId}. Saya akan mengirimkan bukti transfernya di sini.`;
    window.open(`https://wa.me/62${adminWhatsApp.replace(/^0/, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex h-18 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-xl max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-extrabold text-white">
            K
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">KaryawanMu</span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
              Digital Office OS
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#fitur" className="hover:text-white transition-colors">Fitur Kantor</a>
          <a href="#digital-team" className="hover:text-white transition-colors">AI Digital Team</a>
          <a href="#denah" className="hover:text-white transition-colors">Denah Interaktif</a>
          <a href="#harga" className="hover:text-white transition-colors">Paket Langganan</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLanding(false)}
            className="text-xs font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
          >
            Masuk Aplikasi
          </button>
          <button
            onClick={() => {
              setShowLanding(false);
              setShowOnboarding(true);
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Mulai Gunakan
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-xs text-indigo-300 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Generasi Baru Digital Office Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight md:leading-tight">
            Bukan cuma software kantor.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Ini tim digital Anda.
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Kelola karyawan, kantor, keuangan, dokumen, dan pekerjaan administratif dalam satu platform.
            Biarkan AI membantu pekerjaan yang berulang agar tim Anda bisa fokus pada pekerjaan yang lebih penting.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setShowLanding(false);
                setShowOnboarding(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 hover:scale-[1.02]"
            >
              <span>Mulai Gunakan KaryawanMu</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowLanding(false)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Play className="h-4 w-4 text-slate-400" />
              <span>Lihat Demo Dashboard</span>
            </button>
          </div>

          {/* Interactive Visual Dashboard Mockup */}
          <div className="mt-14 relative rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-2xl backdrop-blur-xl overflow-hidden max-w-5xl mx-auto">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-800/80">
              <img
                src="/src/assets/images/hero_modern_digital_office_1790356902014.jpg"
                alt="KaryawanMu Digital Office HQ"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 backdrop-blur-md text-left">
                    <p className="text-[11px] text-slate-400">Presensi Hari Ini</p>
                    <p className="text-lg font-bold text-white font-mono tabular-nums">42 / 48 Hadir</p>
                    <span className="text-[10px] text-emerald-400">🟢 87.5% Tepat Waktu</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 backdrop-blur-md text-left">
                    <p className="text-[11px] text-slate-400">Digital Team</p>
                    <p className="text-lg font-bold text-indigo-300 font-mono tabular-nums">6 AI Online</p>
                    <span className="text-[10px] text-indigo-400">🤖 125 Tugas Selesai</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 backdrop-blur-md text-left">
                    <p className="text-[11px] text-slate-400">Payroll September</p>
                    <p className="text-lg font-bold text-white font-mono tabular-nums">Rp368.5 Jt</p>
                    <span className="text-[10px] text-amber-400">⚠️ Draf Siap Review</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 backdrop-blur-md text-left">
                    <p className="text-[11px] text-slate-400">Denah Kantor</p>
                    <p className="text-lg font-bold text-white font-mono tabular-nums">30 Meja Aktif</p>
                    <span className="text-[10px] text-sky-400">🏢 Sudirman Center</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: 10 Cards */}
      <section id="fitur" className="py-20 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Fitur Lengkap</h2>
            <p className="mt-2 text-3xl font-extrabold text-white">Semua kebutuhan kantor dalam satu platform</p>
            <p className="mt-3 text-sm text-slate-400">
              Integrasi sempurna antara sistem kepegawaian, pembukuan kas kecil, perpajakan, dan automasi kecerdasan buatan.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{feat.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Digital Team Showcase */}
      <section id="digital-team" className="py-20 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Autonomous Workforce</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">AI Digital Team Anda</h2>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Bukan bot obrolan umum biasa. Setiap AI Worker bertindak layaknya anggota tim spesialis dengan kapabilitas teruji dan pengawasan tata kelola manusia (Human Governance).
              </p>
            </div>
            <button
              onClick={() => setShowLanding(false)}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-colors"
            >
              <Cpu className="h-4 w-4" />
              <span>Buka AI Workspace Node</span>
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiWorkersShowcase.map((worker) => {
              const Icon = worker.icon;
              return (
                <div
                  key={worker.code}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-colors relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{worker.name}</h3>
                        <p className="text-[11px] text-indigo-300">{worker.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Online
                    </span>
                  </div>
                  <p className="mt-3.5 text-xs text-slate-400 leading-relaxed">{worker.desc}</p>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Memerlukan Approval: Ya</span>
                    <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer" onClick={() => setShowLanding(false)}>Lihat Job</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section with WhatsApp Manual Activation */}
      <section id="harga" className="py-20 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Investasi Kantor</h2>
            <p className="mt-2 text-3xl font-extrabold text-white">Pilih paket terbaik untuk kantor Anda</p>
            <p className="mt-2 text-xs text-slate-400">
              Aktivasi instan via transfer manual & konfirmasi WhatsApp resmi admin <strong>{adminWhatsApp}</strong>.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'border-2 border-indigo-500 bg-slate-900 shadow-xl shadow-indigo-500/10 scale-105'
                    : 'border border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div>
                  {plan.popular && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white px-2 py-0.5 rounded-full mb-3">
                      Paling Populer
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{plan.tagline}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                      Rp{plan.monthlyPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-slate-400">/bulan</span>
                  </div>

                  <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() => handleWhatsAppBooking(plan.name, plan.monthlyPrice)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-semibold transition-colors shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Bayar via WhatsApp</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowLanding(false);
                      setShowSubscriptionModal(true);
                    }}
                    className="w-full text-center text-[11px] text-slate-400 hover:text-white py-1"
                  >
                    Generate Invoice Sistem
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 font-bold text-white text-xs">
              K
            </div>
            <span className="font-semibold text-slate-300">KaryawanMu</span>
            <span>— Digital Team untuk Kantor Anda</span>
          </div>
          <div>
            <span>© 2026 PT KaryawanMu Digital Indonesia. Sahid Sudirman Center Lt. 24, Jakarta Pusat.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
