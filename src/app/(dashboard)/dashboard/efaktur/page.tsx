"use client";

import { useState, useEffect } from "react";
import {
  getFakturListAction,
  createFakturAction,
} from "@/actions/efaktur-action";
import { Receipt, Plus, Package, X, QrCode } from "lucide-react";

export default function EfakturPage() {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Input
  const [formData, setFormData] = useState({
    pembeli: "",
    dpp: "",
    barang: "",
  });

  const loadData = async () => {
    const res = await getFakturListAction();
    setData(res);
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createFakturAction(formData);
    if (res.success) {
      alert("Faktur Terbit! NSFP: " + res.nsfp);
      setIsModalOpen(false);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Receipt className="text-blue-600" /> E-Faktur 4.0
          </h1>
          <p className="text-sm text-gray-500">
            Administrasi Faktur Pajak Elektronik
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <Plus size={18} /> Rekam Faktur
        </button>
      </div>

      {/* List Faktur */}
      <div className="grid gap-4">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <QrCode size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">
                  {item.lawan_transaksi}
                </h3>
                <p className="text-xs text-gray-500 font-mono">{item.nsfp}</p>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                  {item.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Nilai Faktur</p>
              <h4 className="font-bold text-blue-700 text-lg">
                Rp {item.total.toLocaleString("id-ID")}
              </h4>
              <p className="text-xs text-gray-400">{item.tanggal}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form Sederhana */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">Rekam Faktur Keluaran</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Nama Lawan Transaksi"
                className="w-full border rounded p-2"
                onChange={(e) =>
                  setFormData({ ...formData, pembeli: e.target.value })
                }
              />
              <input
                required
                placeholder="Nama Barang / Jasa"
                className="w-full border rounded p-2"
                onChange={(e) =>
                  setFormData({ ...formData, barang: e.target.value })
                }
              />
              <input
                required
                type="number"
                placeholder="Harga Jual (DPP)"
                className="w-full border rounded p-2"
                onChange={(e) =>
                  setFormData({ ...formData, dpp: e.target.value })
                }
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">
                Simpan & Upload
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-2 text-gray-500 text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
