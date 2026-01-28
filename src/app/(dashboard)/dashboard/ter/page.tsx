"use client";

import { useState, useEffect } from "react";
import { getTerListAction, calculateTerAction } from "@/actions/ter-action";
import {
  Calculator,
  RotateCcw,
  User,
  Wallet,
  History,
  Search,
} from "lucide-react";

export default function TerPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle Calculate
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Panggil Server Action
    const res = await calculateTerAction(formData);

    setIsLoading(false);
    if (res.success) {
      setResult(res.hasil);
      loadData();
    } else {
      alert("Gagal: " + res.message);
    }
  };

  // Reset Form
  const handleReset = () => {
    setFormData({ nama: "", nik: "", ptkp: "TK/0", bruto: "" });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calculator className="text-indigo-600" /> Perhitungan PPh 21 (TER)
        </h1>
        <p className="text-sm text-gray-500">
          Kalkulator Tarif Efektif Rata-Rata sesuai PP 58 Tahun 2023
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM 1: FORM INPUT */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 text-lg">
              Input Data Pegawai
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nama Pegawai
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Masukkan Nama"
                    className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* NIK */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  NIK (Nomor Induk Kependudukan)
                </label>
                <input
                  required
                  type="text"
                  placeholder="16 Digit NIK"
                  maxLength={16}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Status PTKP
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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

              {/* Bruto */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Penghasilan Bruto (Rp)
                </label>
                <div className="relative">
                  <Wallet
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    required
                    type="number"
                    placeholder="0"
                    className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.bruto}
                    onChange={(e) =>
                      setFormData({ ...formData, bruto: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 shadow-lg disabled:opacity-50 transition-all flex justify-center items-center gap-2"
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
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-6">
              Hasil Perhitungan
            </h3>

            {!result ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <Calculator size={48} className="mb-2 opacity-20" />
                <p className="text-sm">Masukkan data untuk melihat hasil.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Kategori TER</p>
                  <div className="text-2xl font-bold text-yellow-400">
                    TER {result.kategori}
                  </div>
                </div>

                <div className="flex justify-between items-end border-b border-gray-700 pb-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Tarif Efektif</p>
                    <div className="text-xl font-bold">{result.tarif}%</div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs mb-1">Bruto</p>
                    <div className="text-sm font-mono opacity-80">
                      Rp{" "}
                      {(parseFloat(formData.bruto) || 0).toLocaleString(
                        "id-ID"
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-300 text-sm mb-1">
                    PPh Pasal 21 Terutang
                  </p>
                  <div className="text-4xl font-bold text-white tracking-tight">
                    Rp {result.pph.toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="bg-white/10 p-3 rounded-lg text-xs text-gray-300 mt-4">
                  Perhitungan ini menggunakan skema tarif efektif bulanan sesuai
                  PP 58/2023.
                </div>
              </div>
            )}
          </div>

          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* RIWAYAT / DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <History size={18} /> Riwayat Perhitungan
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Nama..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-300 text-sm w-48 focus:ring-1 focus:ring-indigo-500"
            />
            <Search
              size={14}
              className="absolute left-2.5 top-2.5 text-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-600 font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Nama Pegawai</th>
                <th className="px-6 py-3">Status PTKP</th>
                <th className="px-6 py-3 text-right">Penghasilan Bruto</th>
                <th className="px-6 py-3 text-center">Tarif</th>
                <th className="px-6 py-3 text-right">PPh Terutang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Belum ada riwayat.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-500 text-xs">
                      {item.tanggal?.split(" ")[0]}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {item.nama}
                      <div className="text-[10px] text-gray-400 font-mono">
                        {item.nik}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                        {item.ptkp}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-gray-600">
                      Rp {item.bruto.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-gray-500">
                      {item.tarif}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-indigo-700">
                      Rp {item.pph.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
