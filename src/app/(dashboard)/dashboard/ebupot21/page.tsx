"use client";

import { useState, useEffect } from "react";
import { getBupotListAction, createBupotAction } from "@/actions/bupot-action";
import { FileText, Plus, Search, User, X, Save, Printer } from "lucide-react";

export default function EbupotPage() {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    masa: "Januari",
    tahun: "2025",
    kode: "21-100-01",
    npwp: "",
    nama: "",
    bruto: "",
    tarif: "5",
  });

  // Load Data
  const loadData = async () => {
    const res = await getBupotListAction();
    setData(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createBupotAction(formData);
    setIsLoading(false);

    if (res.success) {
      alert("Sukses: " + res.message);
      setIsModalOpen(false);
      loadData();
    } else {
      alert("Gagal: " + res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-yellow-600" /> E-Bupot 21/26
          </h1>
          <p className="text-sm text-gray-500">
            Pembuatan Bukti Potong PPh Pasal 21
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-700 transition"
        >
          <Plus size={18} /> Buat Bukti Potong
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-yellow-50 text-yellow-800 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Penerima Penghasilan</th>
              <th className="px-6 py-4">Kode Objek</th>
              <th className="px-6 py-4">Masa Pajak</th>
              <th className="px-6 py-4 text-right">Bruto (Rp)</th>
              <th className="px-6 py-4 text-right">PPh Dipotong (Rp)</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Belum ada bukti potong.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">
                      {item.identitas.nama}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {item.identitas.npwp}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      {item.kode_objek}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.masa}</td>
                  <td className="px-6 py-4 text-right font-medium">
                    {item.bruto.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-red-600">
                    {item.pph.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Cetak / Lihat"
                    >
                      <Printer size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORMULIR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-yellow-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileText size={20} /> Form Bukti Potong Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Identitas Penerima */}
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-700 block mb-1">
                  Identitas Penerima Penghasilan
                </label>
                <div className="flex gap-2">
                  <div className="relative w-1/3">
                    <User
                      size={16}
                      className="absolute left-3 top-2.5 text-gray-400"
                    />
                    <input
                      required
                      type="text"
                      placeholder="NPWP / NIK"
                      className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm"
                      onChange={(e) =>
                        setFormData({ ...formData, npwp: e.target.value })
                      }
                    />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="Nama Lengkap Sesuai KTP"
                    className="w-2/3 border rounded-lg px-3 py-2 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Kode Objek Pajak */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">
                  Kode Objek Pajak
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, kode: e.target.value })
                  }
                >
                  <option value="21-100-01">21-100-01 (Pegawai Tetap)</option>
                  <option value="21-100-02">
                    21-100-02 (Penerima Pensiun)
                  </option>
                  <option value="21-100-03">
                    21-100-03 (Pegawai Tidak Tetap)
                  </option>
                  <option value="21-100-07">21-100-07 (Bukan Pegawai)</option>
                </select>
              </div>

              {/* Masa Pajak */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">
                  Masa & Tahun Pajak
                </label>
                <div className="flex gap-2">
                  <select
                    className="w-2/3 border rounded-lg px-3 py-2 text-sm"
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
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    defaultValue="2025"
                    className="w-1/3 border rounded-lg px-3 py-2 text-sm text-center"
                    onChange={(e) =>
                      setFormData({ ...formData, tahun: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Penghasilan Bruto */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">
                  Penghasilan Bruto (Rp)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full border rounded-lg px-3 py-2 text-sm font-bold"
                  onChange={(e) =>
                    setFormData({ ...formData, bruto: e.target.value })
                  }
                />
              </div>

              {/* Tarif Pajak */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">
                  Tarif Efektif / PPh 17 (%)
                </label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    step="0.01"
                    defaultValue="5"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, tarif: e.target.value })
                    }
                  />
                  <span className="absolute right-3 top-2 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="md:col-span-2 pt-4 border-t flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-700 disabled:opacity-50 text-sm flex items-center gap-2"
                >
                  {isLoading ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <Save size={16} /> Simpan Bukti Potong
                    </>
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
