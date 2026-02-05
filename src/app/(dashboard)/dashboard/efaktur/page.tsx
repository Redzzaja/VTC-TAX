"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getFakturListAction,
  createFakturAction,
} from "@/actions/efaktur-action";
import {
  ArrowRight,
  Upload, // Pajak Keluaran
  Download, // Pajak Masukan
  RotateCcw, // Retur Masukan
  CornerUpLeft, // Retur Keluaran
  Plus,
  QrCode,
  X,
  Loader2,
  Receipt,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

// --- DATA MENU E-FAKTUR (PROFESIONAL MONOKROM) ---
const efakturMenus = [
  {
    title: "Pajak Keluaran",
    desc: "Administrasi Faktur Pajak Keluaran",
    icon: Upload,
    action: "keluaran", // Ini yang aktif
  },
  {
    title: "Pajak Masukan",
    desc: "Administrasi Faktur Pajak Masukan",
    icon: Download,
    action: "masukan",
  },
  {
    title: "Retur Pajak Masukan",
    desc: "Nota Retur atas Pajak Masukan",
    icon: RotateCcw,
    action: "retur_masukan",
  },
  {
    title: "Retur Pajak Keluaran",
    desc: "Nota Retur atas Pajak Keluaran",
    icon: CornerUpLeft,
    action: "retur_keluaran",
  },
];

export default function EfakturPage() {
  // State Navigasi
  const [activeView, setActiveView] = useState<"menu" | "keluaran">("menu");

  // State Data & Form (Untuk Pajak Keluaran)
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    pembeli: "",
    dpp: "",
    barang: "",
  });

  // Load Data saat masuk menu Keluaran
  const loadData = async () => {
    setIsLoading(true);
    const res = await getFakturListAction();
    setData(res);
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeView === "keluaran") {
      loadData();
    }
  }, [activeView]);

  // Handle Create Faktur
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await createFakturAction(formData);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Faktur Berhasil Direkam!", {
        description: `NSFP: ${res.nsfp}`,
        duration: 5000,
      });
      setIsModalOpen(false);
      setFormData({ pembeli: "", dpp: "", barang: "" });
      loadData();
    } else {
      toast.error("Gagal Merekam Faktur", { description: res.message });
    }
  };

  // --- TAMPILAN 1: MENU UTAMA ---
  if (activeView === "menu") {
    return (
      <div className="space-y-8 animate-in fade-in">
        {/* Tombol Kembali */}
        <div>
          <Link
            href="/dashboard/simulasi"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm mb-2"
          >
            <ArrowLeft size={18} /> Kembali ke Menu Simulasi
          </Link>
        </div>

        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Receipt className="text-slate-600" /> E-Faktur
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administrasi Faktur Pajak Elektronik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {efakturMenus.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between h-full hover:border-slate-300"
              onClick={() => {
                if (item.action === "keluaran") {
                  setActiveView("keluaran");
                } else {
                  toast.info(
                    `Menu ${item.title} belum tersedia di simulasi ini.`,
                  );
                }
              }}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-slate-50 border border-slate-100 group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300 shadow-sm">
                  <item.icon
                    size={28}
                    className="text-slate-600 group-hover:text-yellow-500 transition-colors duration-300"
                  />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  E-FAKTUR
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-lg leading-tight group-hover:text-slate-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 group-hover:border-slate-300 group-hover:text-slate-800">
                AKSES LAYANAN <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: PAJAK KELUARAN (List & Form) ---
  if (activeView === "keluaran") {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        {/* Header Sub-Halaman */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => setActiveView("menu")}
                className="text-slate-400 hover:text-slate-800 transition-colors"
              >
                <ArrowRight className="rotate-180" size={20} />
              </button>
              <h1 className="text-2xl font-bold text-slate-800">
                Daftar Pajak Keluaran
              </h1>
            </div>
            <p className="text-sm text-slate-500 ml-7">
              Kelola faktur pajak keluaran Anda.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus size={18} className="text-yellow-500" /> Rekam Faktur
          </button>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-75">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Loader2 className="animate-spin mb-2" size={32} />
              <p>Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Receipt className="mb-4 opacity-20" size={64} />
              <p>Belum ada data faktur keluaran.</p>
            </div>
          ) : (
            <div className="grid gap-0 divide-y divide-slate-100">
              {data.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 flex justify-between items-center hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 text-slate-600 rounded-lg group-hover:bg-slate-100 transition-colors border border-slate-200">
                      <QrCode size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">
                        {item.lawan_transaksi}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono tracking-wide flex items-center gap-2">
                        {item.nsfp}
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        {item.tanggal}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">
                      Total Nilai
                    </p>
                    <h4 className="font-bold text-slate-800 text-lg font-mono">
                      Rp {item.total.toLocaleString("id-ID")}
                    </h4>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold mt-1 inline-block border border-emerald-100">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Form Rekam */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white border-b border-slate-800">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Upload size={20} className="text-yellow-500" /> Rekam Faktur
                  Keluaran
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="hover:text-slate-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                      Lawan Transaksi
                    </label>
                    <input
                      required
                      placeholder="Nama Pembeli / PT..."
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-slate-500 outline-none transition-all"
                      value={formData.pembeli}
                      onChange={(e) =>
                        setFormData({ ...formData, pembeli: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                      Detail Barang/Jasa
                    </label>
                    <input
                      required
                      placeholder="Contoh: Jasa Konsultasi..."
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-slate-500 outline-none transition-all"
                      value={formData.barang}
                      onChange={(e) =>
                        setFormData({ ...formData, barang: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                      Harga Jual (DPP)
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="0"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-slate-500 outline-none font-bold transition-all"
                      value={formData.dpp}
                      onChange={(e) =>
                        setFormData({ ...formData, dpp: e.target.value })
                      }
                    />
                  </div>

                  <div className="pt-4 flex gap-3 border-t border-slate-100 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-2.5 text-slate-500 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-50 shadow-md transition-colors"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        "Simpan & Upload"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
