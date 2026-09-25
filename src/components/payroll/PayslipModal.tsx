import React, { useState } from 'react';
import { Payslip } from '../../types';
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  Building,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

interface Props {
  payslip: Payslip;
  periodName: string;
  onClose: () => void;
}

export const PayslipModal: React.FC<Props> = ({ payslip, periodName, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [sentWhatsapp, setSentWhatsapp] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    setSentWhatsapp(true);
    setTimeout(() => setSentWhatsapp(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Top Actions */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold text-white">Slip Gaji Digital ({payslip.id})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{sentWhatsapp ? 'Terkirim!' : 'Kirim via WhatsApp'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Payslip Document Body */}
        <div className="p-8 overflow-y-auto flex-1 text-xs space-y-6 print:p-6 print:text-black">
          {/* Company & Period Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-5 print:border-black">
            <div>
              <h2 className="text-base font-bold text-white print:text-black">PT KARYAWANMU DIGITAL INDONESIA</h2>
              <p className="text-[11px] text-slate-400 print:text-gray-600">
                Sahid Sudirman Center Lt. 24, Jl. Jend. Sudirman Kav. 86, Jakarta Pusat
              </p>
              <p className="text-[10px] text-slate-500 print:text-gray-500">NPWP: 01.992.381.4-021.000</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded print:text-black print:border-black">
                SLIP GAJI RESMI
              </span>
              <p className="mt-1 font-mono font-bold text-white print:text-black">{periodName}</p>
            </div>
          </div>

          {/* Employee Identity */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 print:border-gray-300 print:bg-gray-50">
            <div>
              <p className="text-[11px] text-slate-400 print:text-gray-500">Nama Karyawan:</p>
              <p className="font-bold text-white print:text-black text-sm">{payslip.employeeName}</p>
              <p className="text-slate-400 print:text-gray-600">{payslip.jobTitle}</p>
            </div>
            <div className="text-right font-mono">
              <p className="text-[11px] text-slate-400 print:text-gray-500">Transfer Bank:</p>
              <p className="font-bold text-white print:text-black">{payslip.bankName} - {payslip.accountNumber}</p>
              <p className="text-[11px] text-slate-400 print:text-gray-600">Departemen: {payslip.department}</p>
            </div>
          </div>

          {/* Salary Breakdown Matrix */}
          <div className="grid grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="space-y-2">
              <h4 className="font-bold text-emerald-400 border-b border-slate-800 pb-1.5 print:text-black print:border-gray-400">
                A. PENERIMAAN (EARNINGS)
              </h4>
              <div className="space-y-1.5 text-slate-300 print:text-black">
                <div className="flex justify-between">
                  <span>Gaji Pokok:</span>
                  <span className="font-mono">Rp{payslip.basicSalary.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tunjangan Tetap:</span>
                  <span className="font-mono">Rp{payslip.allowance.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus Kinerja:</span>
                  <span className="font-mono">Rp{payslip.bonus.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uang Lembur (Overtime):</span>
                  <span className="font-mono">Rp{payslip.overtime.toLocaleString('id-ID')}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white print:text-black">
                  <span>Total Gaji Bruto:</span>
                  <span className="font-mono">Rp{payslip.grossSalary.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-2">
              <h4 className="font-bold text-rose-400 border-b border-slate-800 pb-1.5 print:text-black print:border-gray-400">
                B. POTONGAN (DEDUCTIONS)
              </h4>
              <div className="space-y-1.5 text-slate-300 print:text-black">
                <div className="flex justify-between">
                  <span>Potongan Keterlambatan:</span>
                  <span className="font-mono">Rp{payslip.deductionLate.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Potongan Absensi:</span>
                  <span className="font-mono">Rp{payslip.deductionAbsence.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>BPJS Kesehatan (1%):</span>
                  <span className="font-mono">Rp{payslip.bpjsKesehatanDeduction.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>BPJS Ketenagakerjaan (2%):</span>
                  <span className="font-mono">Rp{payslip.bpjsTkDeduction.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak Penghasilan (PPh 21):</span>
                  <span className="font-mono">Rp{payslip.taxPPh21.toLocaleString('id-ID')}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-rose-300 print:text-black">
                  <span>Total Potongan:</span>
                  <span className="font-mono">Rp{payslip.totalDeduction.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight */}
          <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-4 flex items-center justify-between print:border-black print:bg-gray-100">
            <div>
              <p className="text-xs font-semibold text-indigo-300 print:text-black">GAJI BERSIH (TAKE HOME PAY)</p>
              <p className="text-[10px] text-slate-400 print:text-gray-500">Telah ditransfer ke rekening {payslip.bankName}</p>
            </div>
            <span className="text-2xl font-extrabold text-white font-mono tabular-nums print:text-black">
              Rp{payslip.netSalary.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-800 flex justify-between text-center print:border-black">
            <div>
              <p className="text-[11px] text-slate-400 print:text-gray-600">Penerima,</p>
              <div className="h-12"></div>
              <p className="font-bold text-white print:text-black underline">{payslip.employeeName}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 print:text-gray-600">Diverifikasi oleh AI Payroll & HR,</p>
              <div className="h-12 flex items-center justify-center">
                <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">
                  DIGITALLY VERIFIED
                </span>
              </div>
              <p className="font-bold text-white print:text-black underline">Maya Safitri (HRD Lead)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
