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

  // State untuk Modal Reset History
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // State Input
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    ptkp: "TK/0",
    bruto: "",
  });

  // State Hasil
  const [result, setResult] = useState<any>(null);

  // Load Data
  const loadData = async () => {
    const res = await getTerListAction();
    setData(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Input Bruto (Auto Format Rupiah)
  const handleBrutoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanVal = parseCurrency(rawVal);

    // Pastikan hanya angka
    if (!/^\d*$/.test(cleanVal)) return;

    setFormData({ ...formData, bruto: cleanVal });
  };

  // Handle Calculate
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await calculateTerAction(formData);

    setIsLoading(false);

    if (res.success && res.hasil) {
      setResult(res.hasil);
      loadData();
      toast.success("Perhitungan Berhasil!", {
        description: `PPh Terutang: Rp ${res.hasil.pph.toLocaleString("id-ID")}`,
        duration: 4000,
      });
    } else {
      toast.error("Gagal Menghitung", {
        description: res.message,
      });
    }
  };

  const handleResetForm = () => {
    setFormData({ nama: "", nik: "", ptkp: "TK/0", bruto: "" });
    setResult(null);
    toast.info("Formulir direset.");
  };

  // Handle Reset History (Hapus Semua)
  const handleResetHistory = async () => {
    setIsResetModalOpen(false); // Tutup modal
    const res = await resetTerHistoryAction();

    if (res.success) {
      toast.success(res.message);
      loadData();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Tombol Kembali */}
      <div>
        <Link
          href="/dashboard/simulasi"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm mb-2"
        >
          <ArrowLeft size={18} /> Kembali ke Menu Simulasi
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Calculator className="text-slate-600" /> Perhitungan PPh 21 (TER)
        </h1>
        <p className="text-sm text-slate-500">
          Kalkulator Tarif Efektif Rata-Rata sesuai PP 58 Tahun 2023
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM 1: FORM INPUT */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-800 text-lg">
              Input Data Pegawai
            </h2>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Nama Pegawai
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-2.5 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Masukkan Nama"
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 outline-none transition-all"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* NIK */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  NIK (Nomor Induk Kependudukan)
                </label>
                <input
                  required
                  type="text"
                  placeholder="16 Digit NIK"
                  maxLength={16}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 outline-none transition-all"
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData({ ...formData, nik: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PTKP */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Status PTKP
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 outline-none bg-white transition-all"
                  value={formData.ptkp}
                  onChange={(e) =>
                    setFormData({ ...formData, ptkp: e.target.value })
                  }
                >
                  <optgroup label="Tidak Kawin">
                    <option value="TK/0">
                      TK/0 - Tidak Kawin, 0 Tanggungan (TER A)
                    </option>
                    <option value="TK/1">
                      TK/1 - Tidak Kawin, 1 Tanggungan (TER A)
                    </option>
                    <option value="TK/2">
                      TK/2 - Tidak Kawin, 2 Tanggungan (TER B)
                    </option>
                    <option value="TK/3">
                      TK/3 - Tidak Kawin, 3 Tanggungan (TER B)
                    </option>
                  </optgroup>
                  <optgroup label="Kawin">
                    <option value="K/0">
                      K/0 - Kawin, 0 Tanggungan (TER A)
                    </option>
                    <option value="K/1">
                      K/1 - Kawin, 1 Tanggungan (TER B)
                    </option>
                    <option value="K/2">
                      K/2 - Kawin, 2 Tanggungan (TER B)
                    </option>
                    <option value="K/3">
                      K/3 - Kawin, 3 Tanggungan (TER C)
                    </option>
                  </optgroup>
                </select>
              </div>

              {/* Bruto (Auto Format Rupiah) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Penghasilan Bruto (Rp)
                </label>
                <div className="relative">
                  <Wallet
                    className="absolute left-3 top-2.5 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    placeholder="0"
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-500 outline-none transition-all"
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
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 shadow-md disabled:opacity-50 transition-all flex justify-center items-center gap-2 active:scale-95"
              >
                {isLoading ? (
                  "Menghitung..."
                ) : (
                  <>
                    <Calculator size={20} /> HITUNG & SIMPAN
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* KOLOM 2: HASIL PERHITUNGAN */}
        <div className="bg-slate-900 rounded-xl shadow-xl p-6 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-6">
              Hasil Perhitungan
            </h3>

            {!result ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <Calculator size={48} className="mb-2 opacity-20" />
                <p className="text-sm">Masukkan data untuk melihat hasil.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Kategori TER</p>
                  <div className="text-2xl font-bold text-yellow-500">
                    TER {result.kategori}
                  </div>
                </div>

                <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Tarif Efektif</p>
                    <div className="text-xl font-bold">{result.tarif}%</div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs mb-1">Bruto</p>
                    <div className="text-sm font-mono opacity-80">
                      Rp{" "}
                      {(parseFloat(formData.bruto) || 0).toLocaleString(
                        "id-ID",
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-slate-300 text-sm mb-1">
                    PPh Pasal 21 Terutang
                  </p>
                  <div className="text-4xl font-bold text-white tracking-tight">
                    Rp {result.pph.toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="bg-white/10 p-3 rounded-lg text-xs text-slate-300 mt-4">
                  Perhitungan ini menggunakan skema tarif efektif bulanan sesuai
                  PP 58/2023.
                </div>
              </div>
            )}
          </div>

          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-slate-800 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* RIWAYAT / DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <History size={18} /> Riwayat Perhitungan
            </h3>
            {/* Tombol Hapus Riwayat (Hanya muncul jika ada data) */}
            {data.length > 0 && (
              <button
                onClick={() => setIsResetModalOpen(true)}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-bold bg-white border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} /> Hapus Riwayat
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Nama..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-sm w-48 focus:ring-1 focus:ring-slate-500 outline-none"
            />
            <Search
              size={14}
              className="absolute left-2.5 top-2.5 text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Nama Pegawai</th>
                <th className="px-6 py-3">Status PTKP</th>
                <th className="px-6 py-3 text-right">Penghasilan Bruto</th>
                <th className="px-6 py-3 text-center">Tarif</th>
                <th className="px-6 py-3 text-right">PPh Terutang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Belum ada riwayat.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 text-slate-500 text-xs">
                      {item.tanggal?.split(" ")[0]}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800">
                      {item.nama}
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.nik}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                        {item.ptkp}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-slate-600">
                      Rp {item.bruto.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-slate-500">
                      {item.tarif}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-emerald-700">
                      Rp {item.pph.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL KONFIRMASI RESET HISTORY --- */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Hapus Semua Riwayat?
                </h3>
                <p className="text-sm text-slate-500">
                  Apakah Anda yakin ingin menghapus <b>semua</b> riwayat
                  perhitungan? Data yang dihapus tidak dapat dikembalikan.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsResetModalOpen(false)}
                  className="flex-1 py-2.5 text-slate-700 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleResetHistory}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 shadow-md transition-colors"
                >
                  Ya, Hapus Semua
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
