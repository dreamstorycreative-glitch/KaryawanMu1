import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { analyzeReceiptWithAi } from '../../services/geminiService';
import {
  X,
  Sparkles,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const AiFinanceWorkerModal: React.FC<Props> = ({ onClose }) => {
  const { addTransaction } = useApp();

  const [receiptText, setReceiptText] = useState(
    'Kuitansi pembelian ATK dan kertas printer seharga Rp2.450.000 dari PT ABC Office Supplies pada 25 September 2026. Pembayaran via kas kecil kantor.'
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const handleRunOcr = async () => {
    setAnalyzing(true);
    const result = await analyzeReceiptWithAi({ receiptDescription: receiptText });
    setOcrResult(result);
    setAnalyzing(false);
  };

  const handleApprove = () => {
    if (!ocrResult) return;
    addTransaction({
      date: ocrResult.date || '2026-09-25',
      type: 'expense',
      category: ocrResult.category || 'Office Supplies',
      vendor: ocrResult.vendor || 'Vendor Terdeteksi',
      amount: Number(ocrResult.nominal) || 2450000,
      description: `${ocrResult.notes || 'Dicatat via AI OCR'} (${ocrResult.confidence}% confidence)`,
      status: 'approved',
      ocrConfidence: ocrResult.confidence || 95,
      isAiGenerated: true,
      account: 'Kas Kecil',
    });
    alert('Transaksi berhasil dicatat ke Kas Kecil setelah mendapat Human Approval!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Finance Worker OCR Scanner</h3>
              <p className="text-[11px] text-slate-400">Ekstraksi kuitansi otomatis dengan Human Governance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input prompt / description */}
        <div className="space-y-1.5 text-xs">
          <label className="text-slate-400 block font-medium">
            Simulasi Input Teks Kuitansi / Bukti Nota:
          </label>
          <textarea
            rows={3}
            value={receiptText}
            onChange={(e) => setReceiptText(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500 text-xs"
          ></textarea>
          <p className="text-[10px] text-slate-500">
            Contoh nota riil: mencakup nama vendor, nilai rupiah, tanggal transaksi, dan tujuan belanja.
          </p>
        </div>

        <button
          onClick={handleRunOcr}
          disabled={analyzing}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 text-xs font-semibold shadow-md transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>{analyzing ? 'AI Finance Sedang Membaca...' : 'Jalankan Analisis AI OCR'}</span>
        </button>

        {/* Extracted result */}
        {ocrResult && (
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Hasil Ekstraksi OCR
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Confidence: {ocrResult.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Vendor</span>
                <span className="font-semibold text-white">{ocrResult.vendor}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Nominal Terdeteksi</span>
                <span className="font-mono font-bold text-white">
                  Rp{Number(ocrResult.nominal).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Kategori</span>
                <span className="text-indigo-300">{ocrResult.category}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Tanggal</span>
                <span className="font-mono">{ocrResult.date}</span>
              </div>
            </div>

            {/* Governance notice */}
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-2.5 text-[11px] text-amber-300 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>⚠️ Human Approval Required:</strong> AI tidak akan langsung memotong saldo kas tanpa persetujuan manual Anda.
              </span>
            </div>

            {/* Decision Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleApprove}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2 text-xs font-semibold shadow-sm transition-colors text-center"
              >
                Setujui & Catat ke Kas
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-medium"
              >
                Tolak
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
