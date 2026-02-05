"use client";

import { useState, useEffect } from "react";
import {
  getTerListAction,
  calculateTerAction,
  resetTerHistoryAction,
} from "@/actions/ter-action";
import {
  Calculator,
  RotateCcw,
  User,
  Wallet,
  History,
  Search,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// --- UTILS FORMATTING ---
const formatCurrency = (value: string | number) => {
  if (!value) return "";
  const rawValue = value.toString().replace(/\D/g, "");
  return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value: string) => {
  return value.replace(/\./g, "");
};

export default function TerPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    ptkp: "TK/0",
    bruto: "",
  });

  const [result, setResult] = useState<any>(null);

  const loadData = async () => {
    const res = await getTerListAction();
    setData(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBrutoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanVal = parseCurrency(rawVal);
    if (!/^\d*$/.test(cleanVal)) return;
    setFormData({ ...formData, bruto: cleanVal });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await calculateTerAction(formData);
    setIsLoading(false);

    if (res.success && res.hasil) {
      setResult(res.hasil);
      loadData();
      toast.success("Berhasil!", {
        description: `PPh Terutang: Rp ${res.hasil.pph.toLocaleString("id-ID")}`,
        duration: 3000,
      });
    } else {
      toast.error("Gagal", { description: res.message });
    }
  };

  const handleResetForm = () => {
    setFormData({ nama: "", nik: "", ptkp: "TK/0", bruto: "" });
    setResult(null);
    toast.info("Form direset.");
  };

  const handleResetHistory = async () => {
    setIsResetModalOpen(false);
    const res = await resetTerHistoryAction();
    if (res.success) {
      toast.success(res.message);
      loadData();
    } else {
      toast.error(res.message);
    }
  };

  return (
    // FIX UTAMA: max-w-full, overflow-x-hidden, dan mx-auto untuk centering
    <div className="w-full max-w-[100vw] overflow-x-hidden animate-in fade-in pb-20">
      {/* Container Auto Center */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
        {/* Tombol Kembali */}
        <div>
          <Link
            href="/dashboard/simulasi"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-xs md:text-sm"
          >
            <ArrowLeft size={16} /> Kembali ke Menu Simulasi
          </Link>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="text-slate-600 w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span>Perhitungan PPh 21 (TER)</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 leading-snug">
            Kalkulator Tarif Efektif Rata-Rata (PP 58 Tahun 2023)
          </p>
        </div>

        {/* Main Grid: Stack on Mobile, 3 Cols on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KOLOM 1: FORM INPUT */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-800 text-sm md:text-lg">
                Input Data Pegawai
              </h2>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-3 py-1.5 bg-slate-50 rounded-lg hover:bg-slate-100 font-medium"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
              {/* Grid Nama & NIK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1.5">
                    Nama Pegawai
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input
                      required
                      type="text"
                      placeholder="Nama Lengkap"
                      className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-slate-500 outline-none transition-all placeholder:text-slate-400"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1.5">
                    NIK (16 Digit)
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Nomor Induk Kependudukan"
                    maxLength={16}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-slate-500 outline-none transition-all placeholder:text-slate-400"
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Grid PTKP & Bruto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1.5">
                    Status PTKP
                  </label>
                  <div className="relative">
                    <select
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-slate-500 outline-none bg-white transition-all text-slate-700 appearance-none"
                      value={formData.ptkp}
                      onChange={(e) =>
                        setFormData({ ...formData, ptkp: e.target.value })
                      }
                    >
                      <optgroup label="Tidak Kawin">
                        <option value="TK/0">TK/0 - (TER A)</option>
                        <option value="TK/1">TK/1 - (TER A)</option>
                        <option value="TK/2">TK/2 - (TER B)</option>
                        <option value="TK/3">TK/3 - (TER B)</option>
                      </optgroup>
                      <optgroup label="Kawin">
                        <option value="K/0">K/0 - (TER A)</option>
                        <option value="K/1">K/1 - (TER B)</option>
                        <option value="K/2">K/2 - (TER B)</option>
                        <option value="K/3">K/3 - (TER C)</option>
                      </optgroup>
                    </select>
                    {/* Arrow Icon */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1.5">
                    Penghasilan Bruto (Rp)
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input
                      required
                      type="text"
                      placeholder="0"
                      className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-slate-500 outline-none transition-all"
                      value={formatCurrency(formData.bruto)}
                      onChange={handleBrutoChange}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 shadow-md disabled:opacity-70 transition-all flex justify-center items-center gap-2 active:scale-95 text-sm md:text-base"
                >
                  {isLoading ? (
                    "Menghitung..."
                  ) : (
                    <>
                      <Calculator size={18} /> HITUNG & SIMPAN
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* KOLOM 2: HASIL PERHITUNGAN */}
          <div className="bg-slate-900 rounded-xl shadow-xl p-5 md:p-6 text-white flex flex-col justify-between relative overflow-hidden h-fit">
            <div className="relative z-10">
              <h3 className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-wider mb-4 md:mb-6 border-b border-slate-700 pb-2">
                Hasil Perhitungan
              </h3>

              {!result ? (
                <div className="flex flex-col items-center justify-center py-8 md:h-48 text-slate-500">
                  <Calculator size={40} className="mb-2 opacity-20" />
                  <p className="text-xs md:text-sm text-center px-4">
                    Masukkan data di formulir untuk melihat hasil.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px] md:text-xs mb-0.5">
                        Kategori
                      </p>
                      <div className="text-xl md:text-2xl font-bold text-yellow-500">
                        TER {result.kategori}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[10px] md:text-xs mb-0.5">
                        Tarif
                      </p>
                      <div className="text-xl md:text-2xl font-bold">
                        {result.tarif}%
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <p className="text-slate-400 text-[10px] mb-0.5 uppercase tracking-wide">
                      Bruto
                    </p>
                    <div className="text-base md:text-lg font-mono text-slate-200">
                      Rp{" "}
                      {(parseFloat(formData.bruto) || 0).toLocaleString(
                        "id-ID",
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-300 text-xs md:text-sm mb-1 font-medium">
                      PPh Pasal 21 Terutang
                    </p>
                    {/* FIX: Break-all agar angka tidak jebol di HP */}
                    <div className="text-3xl md:text-4xl font-bold text-white tracking-tight break-all leading-none">
                      Rp {result.pph.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="bg-white/5 p-2 md:p-3 rounded-lg text-[10px] text-slate-400 leading-relaxed">
                    *Perhitungan menggunakan skema TER Bulanan sesuai PP
                    58/2023.
                  </div>
                </div>
              )}
            </div>

            {/* Decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-slate-800 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>

        {/* RIWAYAT / DATA TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-w-0">
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 gap-3 md:gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm md:text-base">
                <History size={18} /> Riwayat
              </h3>
              {data.length > 0 && (
                <button
                  onClick={() => setIsResetModalOpen(true)}
                  className="md:hidden text-[10px] text-red-600 flex items-center gap-1 font-bold bg-white border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              )}
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Cari Nama..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs md:text-sm focus:ring-1 focus:ring-slate-500 outline-none bg-white transition-all placeholder:text-slate-400"
                />
                <Search
                  size={14}
                  className="absolute left-3 top-2.5 md:top-3 text-slate-400"
                />
              </div>
              {data.length > 0 && (
                <button
                  onClick={() => setIsResetModalOpen(true)}
                  className="hidden md:flex text-xs text-red-600 hover:text-red-700 items-center gap-1 font-bold bg-white border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              )}
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs md:text-sm text-left whitespace-nowrap min-w-[600px]">
              <thead className="bg-white text-slate-600 font-bold border-b border-slate-200 text-[10px] md:text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">PTKP</th>
                  <th className="px-4 py-3 text-right">Bruto</th>
                  <th className="px-4 py-3 text-center">Tarif</th>
                  <th className="px-4 py-3 text-right">PPh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-400 text-sm italic"
                    >
                      Belum ada riwayat perhitungan.
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-500 text-[10px] md:text-xs">
                        {item.tanggal?.split(" ")[0]}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {item.nama}
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {item.nik}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-bold border border-slate-200">
                          {item.ptkp.split(" ")[0]}{" "}
                          <span className="text-slate-400 hidden md:inline">
                            {item.ptkp.substring(item.ptkp.indexOf("("))}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 font-mono">
                        {item.bruto.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-500">
                        {item.tarif}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700 font-mono">
                        {item.pph.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL KONFIRMASI RESET HISTORY --- */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 text-center space-y-3">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
                <Trash2 size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Hapus Semua Riwayat?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                Tindakan ini tidak dapat dibatalkan. Semua data riwayat akan
                hilang.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsResetModalOpen(false)}
                  className="flex-1 py-2 text-slate-600 font-bold text-xs border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleResetHistory}
                  className="flex-1 py-2 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700 shadow-md transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
