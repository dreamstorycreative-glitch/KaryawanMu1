import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionInvoice } from '../../types';
import {
  ShieldAlert,
  Building,
  CreditCard,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  MessageCircle,
  Database,
  Sliders,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const {
    company,
    subscriptionPlans,
    updatePlanPricing,
    invoices,
    activateSubscriptionInvoice,
    setCurrentRole,
    setCurrentTab,
    adminWhatsApp,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'companies' | 'invoices' | 'plans' | 'ai_usage'>('dashboard');
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editLimit, setEditLimit] = useState<number>(0);

  // Sample multi-tenant company list
  const companyTenants = [
    { id: 'comp_1', name: 'PT KaryawanMu Digital Indonesia', pic: 'Hendra Wijaya', plan: 'Pro', status: 'active', employees: 48, aiUsage: '84%' },
    { id: 'comp_2', name: 'CV Maju Kreatif Solusindo', pic: 'Bambang Irawan', plan: 'Starter', status: 'pending_payment', employees: 12, aiUsage: '22%' },
    { id: 'comp_3', name: 'PT Logistik Nusantara Bersama', pic: 'Dewi Lestari', plan: 'Business', status: 'trial', employees: 95, aiUsage: '65%' },
    { id: 'comp_4', name: 'PT Sinar Abadi Sentosa', pic: 'Surya Kencana', plan: 'Starter', status: 'expired', employees: 8, aiUsage: '0%' },
  ];

  const handleStartEditPlan = (plan: any) => {
    setEditingPlanId(plan.id);
    setEditPrice(plan.monthlyPrice);
    setEditLimit(plan.employeeLimit);
  };

  const handleSavePlan = (planId: string) => {
    updatePlanPricing(planId, Number(editPrice), Number(editLimit));
    setEditingPlanId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              KaryawanMu Super Admin Console (/super-admin)
            </span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-white">Platform Tenant & Subscription Manager</h1>
          <p className="mt-1 text-xs text-slate-400">
            Akses tingkat root untuk mengelola seluruh tenant perusahaan, verifikasi bukti transfer WhatsApp, dan konfigurasi paket langganan.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentRole('owner');
            setCurrentTab('dashboard');
          }}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
        >
          Kembali ke Tenant Demo
        </button>
      </div>

      {/* Super Admin Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          <p className="text-[11px] text-slate-400">Total Perusahaan</p>
          <p className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">4</p>
          <span className="text-[10px] text-slate-400">Multi-tenant</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          <p className="text-[11px] text-slate-400">Perusahaan Aktif</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">2</p>
          <span className="text-[10px] text-emerald-400">Langganan Berjalan</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          <p className="text-[11px] text-slate-400">Masa Trial</p>
          <p className="text-2xl font-bold text-sky-400 font-mono mt-1 tabular-nums">1</p>
          <span className="text-[10px] text-slate-400">14 Hari Percobaan</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          <p className="text-[11px] text-slate-400">Expired / Tunggakan</p>
          <p className="text-2xl font-bold text-rose-400 font-mono mt-1 tabular-nums">1</p>
          <span className="text-[10px] text-slate-400">Perlu Follow-up</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          <p className="text-[11px] text-slate-400">Monthly Revenue (MRR)</p>
          <p className="text-xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">Rp2.198.000</p>
          <span className="text-[10px] text-slate-400">Total Penagihan</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          <p className="text-[11px] text-slate-400">Total Karyawan Terkelola</p>
          <p className="text-2xl font-bold text-indigo-400 font-mono mt-1 tabular-nums">163</p>
          <span className="text-[10px] text-slate-400">User Seats</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {[
          { id: 'dashboard', label: 'Verifikasi Pembayaran WA' },
          { id: 'companies', label: 'Daftar Perusahaan Tenant' },
          { id: 'plans', label: 'Konfigurasi Harga Paket' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeSubTab === t.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Verifikasi WhatsApp & Invoices */}
      {activeSubTab === 'dashboard' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Antrean Pembayaran & Invoice WhatsApp</h3>
              <p className="text-xs text-slate-400">
                Admin WhatsApp Penerima: <strong className="text-emerald-400 font-mono">{adminWhatsApp}</strong>
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Perusahaan mengirim bukti transfer via WhatsApp dan admin menekan "Aktifkan Paket".
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">No. Invoice</th>
                  <th className="pb-3">Perusahaan</th>
                  <th className="pb-3">Paket</th>
                  <th className="pb-3">Nominal</th>
                  <th className="pb-3">Tanggal</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Aksi Super Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 pr-3 font-mono font-bold text-indigo-400">{inv.invoiceNumber}</td>
                    <td className="py-3.5 pr-3 font-semibold text-white">{inv.companyName}</td>
                    <td className="py-3.5 pr-3 text-slate-300">{inv.planName}</td>
                    <td className="py-3.5 pr-3 font-mono font-bold text-white">
                      Rp{inv.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-slate-400">{inv.issueDate}</td>
                    <td className="py-3.5 pr-3">
                      {inv.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3" /> Paid & Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          <Clock className="h-3 w-3" /> Pending Verifikasi
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      {inv.status !== 'active' ? (
                        <button
                          onClick={() => activateSubscriptionInvoice(inv.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors"
                        >
                          Aktifkan Paket (Verifikasi Lunas)
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">Paket Aktif</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Companies Tenant List */}
      {activeSubTab === 'companies' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Database Tenant Multi-Perusahaan</h3>
              <p className="text-xs text-slate-400">Seluruh data antar perusahaan terisolasi secara aman</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Nama PT / Entitas</th>
                  <th className="pb-3">PIC Penanggung Jawab</th>
                  <th className="pb-3">Paket Aktif</th>
                  <th className="pb-3">Karyawan</th>
                  <th className="pb-3">Beban AI Quota</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {companyTenants.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 font-bold text-white">{c.name}</td>
                    <td className="py-3.5 text-slate-300">{c.pic}</td>
                    <td className="py-3.5 font-semibold text-indigo-400">{c.plan}</td>
                    <td className="py-3.5 font-mono text-slate-200">{c.employees} Karyawan</td>
                    <td className="py-3.5 font-mono text-slate-400">{c.aiUsage}</td>
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                          c.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : c.status === 'trial'
                            ? 'bg-sky-500/10 text-sky-400'
                            : c.status === 'pending_payment'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Plans & Pricing Configurator */}
      {activeSubTab === 'plans' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Konfigurasi Harga & Batasan Paket (Configurable Pricing)</h3>
            <p className="text-xs text-slate-400">
              Harga tidak di-hardcode sehingga Super Admin dapat mengubah biaya langganan bulanan dan kuota karyawan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{plan.name}</h4>
                  <span className="text-[10px] text-indigo-400 font-mono">{plan.aiWorkersCount} AI Workers</span>
                </div>

                {editingPlanId === plan.id ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Harga Bulanan (Rp)</label>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Limit Karyawan</label>
                      <input
                        type="number"
                        value={editLimit}
                        onChange={(e) => setEditLimit(Number(e.target.value))}
                        className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-white font-mono"
                      />
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => handleSavePlan(plan.id)}
                        className="flex-1 py-1 rounded bg-emerald-600 text-white font-bold"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditingPlanId(null)}
                        className="px-2 py-1 rounded bg-slate-800 text-slate-400"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-bold text-white font-mono">
                      Rp{plan.monthlyPrice.toLocaleString('id-ID')}
                      <span className="text-xs text-slate-400 font-normal"> /bulan</span>
                    </p>
                    <p className="text-slate-400">Limit: {plan.employeeLimit} Karyawan</p>
                    <p className="text-slate-400">Storage: {plan.storageLimitGb} GB</p>
                    <button
                      onClick={() => handleStartEditPlan(plan)}
                      className="w-full py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium"
                    >
                      Ubah Harga / Limit
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
