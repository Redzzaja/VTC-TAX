"use client";

import { useState, useEffect } from "react";
import { getSptListAction, createSptAction } from "@/actions/spt-action";
import {
  BookOpen,
  Plus,
  Send,
  FileCheck,
  X,
  Search,
  RefreshCw,
  FileText,
} from "lucide-react";

export default function LaporSptPage() {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // State Form (Format Baru: 1770 Sederhana)
  const [formData, setFormData] = useState({
    jenisPajak: "PPh Orang Pribadi",
    jenisSurat: "SPT Tahunan 1770 SS",
    masa: "Tahunan",
    tahun: "2024",
    pembetulan: "0",
    nominal: "0",
    noObjek: "-",
  });

  // Load Data (Ambil dari Data SPT, Filter DILAPORKAN)
  const loadData = async () => {
    setIsLoading(true);
    const res = await getSptListAction();
    // Filter hanya yang sudah lapor
    const reported = res.filter(
      (item: any) => item.status === "DILAPORKAN" || item.status === "SELESAI"
    );
    setData(reported);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Submit (Lapor Langsung)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    // Kirim dengan status khusus "DILAPORKAN"
    const payload = { ...formData, status: "DILAPORKAN" };
    const res = await createSptAction(payload);

    setIsSubmitLoading(false);

    if (res.success) {
      alert(
        `PELAPORAN BERHASIL!\n\nNomor BPE: ${res.bpe}\nData telah tersimpan di arsip.`
      );
      setIsModalOpen(false);
      loadData();
    } else {
      alert("Gagal: " + res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-cyan-600" /> Arsip SPT (E-Filing)
          </h1>
          <p className="text-sm text-gray-500">
            Riwayat Pelaporan SPT Tahunan & Masa
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-700 transition"
        >
          <Plus size={18} /> Lapor SPT Baru
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-cyan-50 text-cyan-800 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">BPE / No. Tanda Terima</th>
              <th className="px-6 py-4">Jenis SPT</th>
              <th className="px-6 py-4">Masa / Tahun</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Nominal (Rp)</th>
              <th className="px-6 py-4 text-center">Tanggal Lapor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Memuat data arsip...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-gray-300" />
                    Belum ada SPT yang dilaporkan.
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-mono font-bold text-cyan-700">
                      <FileCheck size={16} />
                      {item.bpe}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {item.jenis_surat}
                    <div className="text-[10px] text-gray-400 font-normal">
                      {item.jenis_pajak}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.periode}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                      {item.model}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {item.nominal.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-500">
                    {item.tanggal}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM LAPOR MANUAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-cyan-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Send size={20} /> Lapor SPT (E-Filing)
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Jenis Formulir */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">
                  Jenis Formulir
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, jenisSurat: e.target.value })
                  }
                >
                  <option value="SPT Tahunan 1770 SS">
                    1770 SS (Pegawai &lt; 60 Juta)
                  </option>
                  <option value="SPT Tahunan 1770 S">
                    1770 S (Pegawai &ge; 60 Juta)
                  </option>
                  <option value="SPT Tahunan 1770">
                    1770 (Usahawan/Bebas)
                  </option>
                  <option value="SPT Masa PPh 21">SPT Masa PPh 21/26</option>
                </select>
              </div>

              {/* Tahun Pajak */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">
                  Tahun Pajak
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue="2024"
                    className="w-1/2 border rounded-lg px-3 py-2 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, tahun: e.target.value })
                    }
                  />
                  <div className="w-1/2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Pembetulan:</span>
                    <input
                      type="number"
                      defaultValue="0"
                      min="0"
                      className="w-16 border rounded-lg px-3 py-2 text-sm"
                      onChange={(e) =>
                        setFormData({ ...formData, pembetulan: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Status Nihil / Kurang Bayar */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">
                  Status SPT
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4 mb-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="status"
                        value="0"
                        defaultChecked
                        onChange={() =>
                          setFormData({ ...formData, nominal: "0" })
                        }
                      />
                      Nihil (0)
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="status" value="KB" />
                      Kurang Bayar
                    </label>
                  </div>
                  <input
                    type="number"
                    placeholder="Masukkan Nominal Kurang Bayar"
                    className="w-full border rounded px-3 py-1.5 text-sm bg-white"
                    onChange={(e) =>
                      setFormData({ ...formData, nominal: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Upload Simulasi */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                <FileText className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm font-medium text-gray-600">
                  Klik untuk upload CSV / PDF
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  (Hanya simulasi, file tidak akan disimpan)
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-cyan-700 disabled:opacity-50 text-sm flex items-center gap-2"
                >
                  {isSubmitLoading ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <Send size={16} /> Kirim SPT
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
