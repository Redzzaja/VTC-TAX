"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSptListAction, createSptAction } from "@/actions/spt-action"; // Import Action
import {
  FileText,
  Wallet,
  Send,
  XCircle,
  Ban,
  ArrowLeft,
  PlusCircle,
  MoreVertical,
  Search,
  Edit3,
  Trash2,
  Eye,
  X,
  Save,
  RefreshCw,
} from "lucide-react";

// --- KOMPONEN MODAL (FORM) ---
function CreateSptModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    jenisPajak: "PPh Pasal 21",
    jenisSurat: "SPT Masa PPh Pasal 21/26",
    masa: "Januari",
    tahun: "2025",
    pembetulan: "0",
    noObjek: "-",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Panggil Server Action
    const result = await createSptAction(formData);

    setIsLoading(false);
    if (result.success) {
      alert("Sukses: " + result.message);
      onSuccess(); // Refresh data di tabel utama
      onClose(); // Tutup modal
    } else {
      alert("Gagal: " + result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <PlusCircle size={20} className="text-yellow-500" />
            Buat SPT Baru
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Form Input Tetap Sama Seperti Sebelumnya */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Jenis Pajak
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.jenisPajak}
              onChange={(e) =>
                setFormData({ ...formData, jenisPajak: e.target.value })
              }
            >
              <option value="PPh Pasal 21">PPh Pasal 21</option>
              <option value="PPh Orang Pribadi">PPh Orang Pribadi</option>
              <option value="PPh Pasal 23">PPh Pasal 23</option>
              <option value="PPN Dalam Negeri">PPN Dalam Negeri</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Jenis Surat
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.jenisSurat}
              onChange={(e) =>
                setFormData({ ...formData, jenisSurat: e.target.value })
              }
            >
              <option value="SPT Masa">SPT Masa</option>
              <option value="SPT Tahunan 1770">SPT Tahunan 1770 (OP)</option>
              <option value="SPT Tahunan 1771">SPT Tahunan 1771 (Badan)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Masa Pajak
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.masa}
                onChange={(e) =>
                  setFormData({ ...formData, masa: e.target.value })
                }
              >
                {[
                  "Januari",
                  "Februari",
                  "Maret",
                  "April",
                  "Mei",
                  "Juni",
                  "Juli",
                  "Agustus",
                  "September",
                  "Oktober",
                  "November",
                  "Desember",
                  "Tahunan",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Tahun Pajak
              </label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.tahun}
                onChange={(e) =>
                  setFormData({ ...formData, tahun: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Pembetulan Ke-
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.pembetulan}
                onChange={(e) =>
                  setFormData({ ...formData, pembetulan: e.target.value })
                }
              />
              <span className="text-xs text-slate-500">
                Isi 0 untuk SPT Normal
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Simpan Konsep
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MAIN PAGE ---

export default function CoretaxDashboard() {
  const [activeTab, setActiveTab] = useState<
    "KONSEP" | "MENUNGGU_BAYAR" | "DILAPORKAN" | "DITOLAK" | "DIBATALKAN"
  >("KONSEP");
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data dari Server Action
  const loadData = async () => {
    setIsLoading(true);
    const data = await getSptListAction();
    setDrafts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Data
  const filteredData = drafts.filter((d) => d.status === activeTab);

  // UI Helpers
  const getHeaderStyle = () => {
    switch (activeTab) {
      case "KONSEP":
        return { color: "bg-yellow-500", title: "Konsep SPT", icon: FileText };
      case "MENUNGGU_BAYAR":
        return {
          color: "bg-orange-500",
          title: "SPT Menunggu Pembayaran",
          icon: Wallet,
        };
      case "DILAPORKAN":
        return { color: "bg-green-600", title: "SPT Dilaporkan", icon: Send };
      case "DITOLAK":
        return { color: "bg-red-600", title: "SPT Ditolak", icon: XCircle };
      case "DIBATALKAN":
        return { color: "bg-gray-600", title: "SPT Dibatalkan", icon: Ban };
      default:
        return { color: "bg-slate-600", title: "SPT", icon: FileText };
    }
  };
  const header = getHeaderStyle();
  const HeaderIcon = header.icon;

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[85vh]">
      {/* Sidebar - Tampil Sama */}
      <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-16 bg-slate-900 flex items-center px-4">
            <h2 className="text-white font-bold text-lg tracking-wide">
              SobatVTC
            </h2>
          </div>
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <div className="font-bold text-slate-800 text-sm">
              3276021102840016
            </div>
            <div className="text-xs text-slate-500 mt-1">
              NPWP: 09.254.294.3-404.000
            </div>
          </div>
          <nav className="flex flex-col p-2 space-y-1">
            {[
              { id: "KONSEP", label: "Konsep SPT" },
              { id: "MENUNGGU_BAYAR", label: "SPT Menunggu Pembayaran" },
              { id: "DILAPORKAN", label: "SPT Dilaporkan" },
              { id: "DITOLAK", label: "SPT Ditolak" },
              { id: "DIBATALKAN", label: "SPT Dibatalkan" },
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveTab(menu.id as any)}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === menu.id
                    ? "bg-blue-50 text-blue-700 font-bold shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {menu.label}
              </button>
            ))}
          </nav>
        </div>
        <Link
          href="/dashboard/simulasi"
          className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-slate-500 hover:text-slate-800 bg-white border border-slate-300 rounded-lg"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 space-y-6">
        <div
          className={`rounded-xl p-6 flex justify-between items-center text-white shadow-lg ${header.color}`}
        >
          <div>
            <h1 className="text-2xl font-bold">{header.title}</h1>
            <p className="opacity-90 text-sm">Simulasi Data Coretax System</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <HeaderIcon size={32} />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari..."
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-sm w-64 focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-slate-400"
            />
          </div>

          {activeTab === "KONSEP" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-transform active:scale-95"
            >
              <PlusCircle size={16} className="text-yellow-500" /> Buat SPT
            </button>
          )}
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">AKSI</th>
                <th className="px-6 py-4">JENIS PAJAK</th>
                <th className="px-6 py-4">JENIS SURAT</th>
                <th className="px-6 py-4">PERIODE</th>
                <th className="px-6 py-4">NO. OBJEK</th>
                <th className="px-6 py-4">MODEL</th>
                <th className="px-6 py-4">ID BILLING</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    Memuat Data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={40} className="text-slate-200" />
                      <p>Belum ada data {header.title.toLowerCase()}.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 group">
                    <td className="px-6 py-4">
                      {activeTab === "KONSEP" ? (
                        <div className="flex gap-2 opacity-60 group-hover:opacity-100">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <button className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold hover:bg-slate-200">
                          <Eye size={14} /> LIHAT
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {item.jenis_pajak}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.jenis_surat}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.periode}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.no_objek}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          item.model === "NORMAL"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {item.model}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      {item.id_billing}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateSptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
