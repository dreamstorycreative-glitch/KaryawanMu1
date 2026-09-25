import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AiFinanceWorkerModal } from './AiFinanceWorkerModal';
import {
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Receipt,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const { transactions, approveTransaction, rejectTransaction } = useApp();
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Metrics
  const totalIncome = transactions
    .filter((t) => t.type === 'income' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashflow = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-white">Keuangan & Kas Kantor (Finance Hub)</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Monitoring arus kas, rekening operasional, serta automasi pembacaan nota kuitansi oleh AI Finance Worker.
          </p>
        </div>

        <button
          onClick={() => setShowOcrModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
        >
          <Receipt className="h-4 w-4" />
          <span>Scan Kuitansi (AI OCR)</span>
        </button>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pemasukan Q3</span>
            <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-xl font-bold text-emerald-400 font-mono tabular-nums">
            Rp{totalIncome.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-slate-400">B2B SaaS & Kontrak Jasa</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pengeluaran Q3</span>
            <ArrowUpRight className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-2 text-xl font-bold text-rose-400 font-mono tabular-nums">
            Rp{totalExpense.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-slate-400">AWS Cloud, Sewa, ATK & Kas</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Arus Kas Bersih (Net)</span>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="mt-2 text-xl font-bold text-white font-mono tabular-nums">
            +Rp{netCashflow.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-emerald-400">Kas Positif & Terkendali</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Rekening Terhubung</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="mt-2 text-sm font-bold text-white">BCA Operasional & Kas Kecil</p>
          <span className="text-[10px] text-slate-400">Mutasi otomatis tervalidasi</span>
        </div>
      </div>

      {/* Ledger Transactions Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Buku Kas & Transaksi</h3>
            <p className="text-xs text-slate-400">Histori mutasi kas masuk, belanja operasional, dan draf kuitansi AI</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Tampilkan:</span>
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterType === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterType === 'income' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterType === 'expense' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pengeluaran
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Tanggal</th>
                <th className="pb-3 font-semibold">Vendor / Keterangan</th>
                <th className="pb-3 font-semibold">Kategori</th>
                <th className="pb-3 font-semibold">Akun Kas</th>
                <th className="pb-3 font-semibold">Nominal</th>
                <th className="pb-3 font-semibold">Status / AI OCR</th>
                <th className="pb-3 font-semibold text-right">Aksi Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 pr-3 font-mono text-slate-400">{trx.date}</td>
                  <td className="py-3.5 pr-3">
                    <p className="font-semibold text-white">{trx.vendor}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">{trx.description}</p>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-300">{trx.category}</td>
                  <td className="py-3.5 pr-3 font-mono text-slate-400">{trx.account}</td>
                  <td className="py-3.5 pr-3 font-mono font-bold">
                    <span className={trx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                      {trx.type === 'income' ? '+' : '-'}Rp{trx.amount.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3">
                    {trx.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3" /> Disetujui
                      </span>
                    ) : trx.status === 'draft' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        <Sparkles className="h-3 w-3 text-amber-400" />
                        {trx.isAiGenerated ? `AI Draf (${trx.ocrConfidence}%)` : 'Menunggu Approval'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                        <XCircle className="h-3 w-3" /> Ditolak
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    {trx.status === 'draft' ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => approveTransaction(trx.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectTransaction(trx.id)}
                          className="px-2 py-1 rounded border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-[11px]"
                        >
                          Tolak
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Tercatat</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showOcrModal && <AiFinanceWorkerModal onClose={() => setShowOcrModal(false)} />}
    </div>
  );
};
