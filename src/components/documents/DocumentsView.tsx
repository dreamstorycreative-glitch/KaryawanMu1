import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentItem } from '../../types';
import { searchDocumentsWithAi } from '../../services/geminiService';
import {
  FolderClosed,
  Search,
  Upload,
  Sparkles,
  FileText,
  FileSpreadsheet,
  Download,
  Filter,
  Eye,
  CheckCircle2,
  X,
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, addDocument } = useApp();

  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState<{ summary: string; matchingDocIds: string[] } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentItem['category']>('hr');
  const [newSummary, setNewSummary] = useState('');

  const categories = [
    { id: 'all', label: 'Semua Dokumen' },
    { id: 'hr', label: 'HR Documents' },
    { id: 'finance', label: 'Finance Documents' },
    { id: 'tax', label: 'Tax Documents' },
    { id: 'contract', label: 'Contracts' },
    { id: 'company', label: 'Company Documents' },
    { id: 'invoice', label: 'Invoices' },
  ];

  const handleRunAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSearchQuery.trim()) return;

    setIsSearchingAi(true);
    const res = await searchDocumentsWithAi(aiSearchQuery, documents);
    setAiSearchResult(res);
    setIsSearchingAi(false);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert('Judul dokumen wajib diisi');

    addDocument({
      title: newTitle,
      category: newCategory,
      fileType: 'pdf',
      fileSize: '1.4 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'User Internal',
      tags: ['Manual Upload', newCategory.toUpperCase(), '2026'],
      aiSummary: newSummary || 'Dokumen diunggah oleh staf kantor dan telah terindeks oleh AI Document Worker.',
    });

    setShowUploadModal(false);
    setNewTitle('');
    setNewSummary('');
  };

  const filteredDocs = documents.filter((doc) => {
    if (aiSearchResult && aiSearchResult.matchingDocIds.length > 0) {
      return aiSearchResult.matchingDocIds.includes(doc.id);
    }
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div>
          <div className="flex items-center gap-2">
            <FolderClosed className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Pusat Dokumen & Repositori Arsip Kantor</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Pencarian cerdas bertenaga AI Document Worker untuk kontrak kerja, laporan keuangan, bukti potong pajak, dan berkas perusahaan.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Unggah Dokumen Baru</span>
        </button>
      </div>

      {/* AI Semantic Natural Language Search Box */}
      <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Pencarian Bahasa Alami (AI Document Worker)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Semantic Natural Language Search</span>
        </div>

        <form onSubmit={handleRunAiSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={aiSearchQuery}
              onChange={(e) => setAiSearchQuery(e.target.value)}
              placeholder="Ketik kueri bebas (Contoh: Cari kontrak karyawan bagian Finance tahun 2026 atau sewa gedung)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingAi || !aiSearchQuery.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 text-xs font-semibold shadow-md transition-colors"
          >
            <span>{isSearchingAi ? 'Mencari...' : 'Cari Dokumen'}</span>
          </button>
          {aiSearchResult && (
            <button
              type="button"
              onClick={() => {
                setAiSearchResult(null);
                setAiSearchQuery('');
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-2"
            >
              Reset
            </button>
          )}
        </form>

        {aiSearchResult && (
          <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/40 text-xs text-slate-200">
            <p className="font-semibold text-indigo-300 mb-1">Hasil Ringkasan AI:</p>
            <p className="text-[11px] leading-relaxed">{aiSearchResult.summary}</p>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCategory(c.id);
              setAiSearchResult(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === c.id && !aiSearchResult
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocPreview(doc)}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                  {doc.fileType === 'xlsx' ? (
                    <FileSpreadsheet className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                  {doc.fileType} · {doc.fileSize}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                {doc.title}
              </h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">{doc.aiSummary}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {doc.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">{doc.uploadDate}</span>
              <span className="text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 font-medium">
                <Eye className="h-3.5 w-3.5" />
                <span>Lihat Dokumen</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                  {selectedDocPreview.category.toUpperCase()} DOKUMEN
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedDocPreview.title}</h3>
                <p className="text-xs text-slate-400">
                  Diunggah oleh: {selectedDocPreview.uploadedBy} · {selectedDocPreview.uploadDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
              <span className="font-bold text-indigo-300 block">Ringkasan Isi (AI Document Summary):</span>
              <p className="text-slate-300 leading-relaxed">{selectedDocPreview.aiSummary}</p>
            </div>

            <div className="space-y-1 text-xs text-slate-400">
              <p>• Format: {selectedDocPreview.fileType.toUpperCase()}</p>
              <p>• Ukuran: {selectedDocPreview.fileSize}</p>
              <p>• Tags: {selectedDocPreview.tags.join(', ')}</p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => alert(`Mengunduh berkas: ${selectedDocPreview.title}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Unduh Berkas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Unggah Dokumen Kantor</h3>
            <p className="text-xs text-slate-400 mt-0.5">Berkas akan diindeks otomatis oleh AI Document Worker.</p>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Judul Dokumen *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Perjanjian Kerjasama Vendor 2026"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Kategori Dokumen</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                >
                  <option value="hr">HR Documents</option>
                  <option value="finance">Finance Documents</option>
                  <option value="tax">Tax Documents</option>
                  <option value="contract">Contracts</option>
                  <option value="company">Company Documents</option>
                  <option value="invoice">Invoices</option>
                  <option value="receipt">Receipts</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Keterangan / Catatan Dokumen</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Tuliskan intisari dokumen..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none"
                ></textarea>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-700 rounded-xl text-center text-slate-400">
                <Upload className="h-6 w-6 mx-auto mb-1 text-slate-500" />
                <p>Klik untuk memilih file PDF, DOCX, XLSX</p>
                <p className="text-[10px] text-slate-500">Maksimal 25MB per file</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Simpan & Indeks AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
