"use client";

import { useState, useEffect } from "react";
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
  Search,
  PlusCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

// --- DATA MENU E-FAKTUR ---
const efakturMenus = [
  {
    title: "Pajak Keluaran",
    desc: "Administrasi Faktur Pajak Keluaran",
    icon: Upload,
    style: "bg-blue-50 text-blue-600 border-blue-200",
    action: "keluaran",
  },
  {
    title: "Pajak Masukan",
    desc: "Administrasi Faktur Pajak Masukan",
    icon: Download,
    style: "bg-emerald-50 text-emerald-600 border-emerald-200",
    action: "masukan",
  },
  {
    title: "Retur Pajak Masukan",
    desc: "Nota Retur atas Pajak Masukan",
    icon: RotateCcw,
    style: "bg-orange-50 text-orange-600 border-orange-200",
    action: "retur_masukan",
  },
  {
    title: "Retur Pajak Keluaran",
    desc: "Nota Retur atas Pajak Keluaran",
    icon: CornerUpLeft,
    style: "bg-purple-50 text-purple-600 border-purple-200",
    action: "retur_keluaran",
  },
];

export default function EfakturPage() {
  // --- STATE ---
  const [activeView, setActiveView] = useState<"menu" | "keluaran">("menu");
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

  // --- TAMPILAN 1: MENU UTAMA (GRID) ---
  if (activeView === "menu") {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <Receipt className="text-blue-600" /> E-Faktur 4.0
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administrasi Faktur Pajak Elektronik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {efakturMenus.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col justify-between cursor-pointer"
              onClick={() => {
                if (item.action === "keluaran") {
                  setActiveView("keluaran");
                } else {
                  toast.info(`Menu ${item.title} segera hadir...`);
                }
              }}
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 border ${item.style}`}
                >
                  <item.icon size={28} />
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  E-FAKTUR SERVICE
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group-hover:border-blue-200 group-hover:text-blue-600">
                AKSES LAYANAN <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: DAFTAR PAJAK KELUARAN ---
  if (activeView === "keluaran") {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView("menu")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <ArrowRight className="rotate-180" size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Pajak Keluaran
              </h1>
              <p className="text-sm text-gray-500">
                Daftar Faktur Pajak Keluaran yang telah direkam.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <PlusCircle size={20} /> Rekam Faktur
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari NSFP / Pembeli..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              />
            </div>
            <div className="text-xs font-medium text-gray-500">
              Total: {data.length} Faktur
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-600 font-bold uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Lawan Transaksi</th>
                  <th className="px-6 py-4">Nomor Faktur (NSFP)</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4 text-right">Total DPP</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">
                      <Loader2 className="animate-spin mx-auto mb-2" /> Memuat
                      data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">
                      <FileText className="mx-auto mb-2 opacity-20" size={48} />{" "}
                      Belum ada data faktur.
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">
                          {item.lawan_transaksi}
                        </div>
                        <div className="text-xs text-gray-400">
                          NPWP: 00.000.000.0-000.000
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-blue-600 font-medium">
                        {item.nsfp}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {item.tanggal}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-700">
                        Rp {item.total.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold border border-green-200">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Rekam Faktur */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
              <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Upload size={20} /> Rekam Faktur Keluaran
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="hover:bg-blue-700 p-1 rounded transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">
                    Lawan Transaksi
                  </label>
                  <input
                    required
                    placeholder="Nama Pembeli / Perusahaan..."
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.pembeli}
                    onChange={(e) =>
                      setFormData({ ...formData, pembeli: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">
                    Barang / Jasa
                  </label>
                  <input
                    required
                    placeholder="Detail transaksi..."
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.barang}
                    onChange={(e) =>
                      setFormData({ ...formData, barang: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">
                    Harga Jual (DPP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 font-bold text-sm">
                      Rp
                    </span>
                    <input
                      required
                      type="number"
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={formData.dpp}
                      onChange={(e) =>
                        setFormData({ ...formData, dpp: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-gray-500 font-bold text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 active:scale-95 transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      "Simpan & Terbitkan"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
