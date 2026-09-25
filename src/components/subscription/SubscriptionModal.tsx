import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlan, SubscriptionInvoice } from '../../types';
import {
  X,
  Sparkles,
  Check,
  MessageCircle,
  CreditCard,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const SubscriptionModal: React.FC = () => {
  const {
    showSubscriptionModal,
    setShowSubscriptionModal,
    subscriptionPlans,
    company,
    createSubscriptionInvoice,
    adminWhatsApp,
  } = useApp();

  const [generatedInvoice, setGeneratedInvoice] = useState<SubscriptionInvoice | null>(null);

  if (!showSubscriptionModal) return null;

  const handleSelectPlan = (planId: string) => {
    const inv = createSubscriptionInvoice(planId);
    setGeneratedInvoice(inv);
  };

  const handlePayViaWhatsApp = () => {
    if (!generatedInvoice) return;
    const msg = `Halo Admin KaryawanMu! Saya ingin mengaktifkan ${generatedInvoice.planName} untuk ${company.name} dengan Invoice ${generatedInvoice.invoiceNumber}. Saya akan mengirimkan bukti transfernya di sini.`;
    const cleanNumber = adminWhatsApp.replace(/^0/, '62');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Pilih Paket Langganan KaryawanMu</h2>
            </div>
            <p className="text-xs text-slate-400">Pembayaran manual via transfer bank & konfirmasi instan WhatsApp</p>
          </div>
          <button
            onClick={() => {
              setShowSubscriptionModal(false);
              setGeneratedInvoice(null);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {!generatedInvoice ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-5 flex flex-col justify-between border transition-all ${
                    plan.popular
                      ? 'border-indigo-500 bg-slate-900 ring-1 ring-indigo-500 shadow-xl'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {plan.popular && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30 mb-2 inline-block">
                        Paling Favorit
                      </span>
                    )}
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{plan.tagline}</p>
                    <div className="mt-3">
                      <span className="text-xl font-extrabold text-white font-mono tabular-nums">
                        Rp{plan.monthlyPrice.toLocaleString('id-ID')}
                      </span>
                      <span className="text-slate-400 text-[11px]">/bln</span>
                    </div>

                    <div className="mt-4 space-y-2 text-slate-300">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px]">
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className="mt-6 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2 text-xs font-semibold shadow-md transition-colors"
                  >
                    Pilih Paket Ini
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Invoice View with WhatsApp Payment Button */
            <div className="max-w-lg mx-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
              <div className="text-center pb-4 border-b border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  INVOICE PEMBAYARAN MANUAL
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 font-mono">{generatedInvoice.invoiceNumber}</h3>
                <p className="text-xs text-slate-400">Diterbitkan untuk: {generatedInvoice.companyName}</p>
              </div>

              <div className="space-y-2 text-slate-300 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span>Paket Langganan:</span>
                  <span className="font-semibold text-white">{generatedInvoice.planName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span>Tanggal Terbit:</span>
                  <span className="font-mono text-white">{generatedInvoice.issueDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span>Status Pembayaran:</span>
                  <span className="font-semibold text-amber-400 uppercase">{generatedInvoice.status}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800 font-bold text-sm">
                  <span>Total Tagihan:</span>
                  <span className="font-mono text-emerald-400">
                    Rp{generatedInvoice.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Bank Transfer Instructions */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs space-y-1.5 text-slate-300">
                <p className="font-semibold text-white">Rekening Tujuan Pembayaran:</p>
                <p className="font-mono text-slate-200">Bank BCA: 8830-1122-33 (PT KaryawanMu Digital)</p>
                <p className="font-mono text-slate-200">Bank Mandiri: 127-00-9988-112</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Setelah transfer, klik tombol di bawah untuk mengirim bukti transfer ke WhatsApp admin.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handlePayViaWhatsApp}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3 text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Bayar & Konfirmasi via WhatsApp ({adminWhatsApp})</span>
                </button>
                <button
                  onClick={() => setGeneratedInvoice(null)}
                  className="w-full py-1.5 text-slate-400 hover:text-white text-xs text-center"
                >
                  Pilih Paket Lain
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
