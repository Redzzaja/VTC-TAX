"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  FileText,
  RotateCcw,
  History,
  Banknote,
  FileInput,
  BadgePercent,
} from "lucide-react";
import {
  createBillingAction,
  getBillingListAction,
} from "@/actions/billing-action";
import { Plus, X } from "lucide-react";

// --- DATA MENU SESUAI PERMINTAAN ANDA ---
const billingServices = [
  {
    title: "Permohonan Pbk",
    desc: "Permohonan Pemindahbukuan Setoran",
    icon: RotateCcw,
    color: "bg-blue-600",
    action: "pbk", // Placeholder
  },
  {
    title: "Kode Billing Mandiri",
    desc: "Layanan Mandiri Pembuatan Kode Billing",
    icon: CreditCard,
    color: "bg-emerald-600",
    action: "create", // -> Buka Modal Buat Billing
  },
  {
    title: "Billing Tagihan",
    desc: "Pembuatan Kode Billing atas Tagihan Pajak",
    icon: FileText,
    color: "bg-indigo-600",
    action: "tagihan", // Placeholder
  },
  {
    title: "Billing Belum Bayar",
    desc: "Daftar Kode Billing Belum Dibayar",
    icon: Banknote,
    color: "bg-orange-600",
    action: "list", // -> Buka Tabel Data
  },
  {
    title: "Restitusi Pajak",
    desc: "Formulir Pengajuan Pengembalian Pajak",
    icon: FileInput,
    color: "bg-purple-600",
    action: "restitusi", // Placeholder
  },
  {
    title: "Imbalan Bunga",
    desc: "Permohonan Pemberian Imbalan Bunga",
    icon: BadgePercent,
    color: "bg-pink-600",
    action: "bunga", // Placeholder
  },
  {
    title: "PPh DTP PDAM",
    desc: "Permohonan PPh DTP atas Penghasilan PDAM",
    icon: FileText,
    color: "bg-cyan-600",
    action: "pdam", // Placeholder
  },
  {
    title: "Riwayat Pembayaran",
    desc: "Log dan Arsip Bukti Penerimaan Negara",
    icon: History,
    color: "bg-slate-600",
    action: "history", // -> Buka Tabel Data (Log)
  },
];

// --- KOMPONEN HALAMAN UTAMA ---
export default function BillingMenuPage() {
  const [activeView, setActiveView] = useState("menu"); // 'menu' | 'create' | 'list'

  // State untuk Data & Form (Logic yang sudah kita buat sebelumnya)
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    npwp: "",
    nama: "",
    kap: "411121",
    kjs: "100",
    masa: "Januari",
    tahun: "2025",
    nominal: "",
    uraian: "",
  });

  // Fungsi Load Data (Dipanggil saat masuk menu List/History)
  const handleOpenList = async () => {
    setIsLoading(true);
    setActiveView("list");
    const res = await getBillingListAction();
    setData(res);
    setIsLoading(false);
  };

  // Fungsi Submit Form (Create Billing)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createBillingAction(formData);
    setIsLoading(false);

    if (res.success) {
      alert(`Sukses! ID Billing Anda: ${res.id_billing}`);
      setActiveView("list"); // Pindah ke list setelah sukses
      handleOpenList(); // Reload data
    } else {
      alert("Gagal: " + res.message);
    }
  };

  // --- TAMPILAN 1: MENU UTAMA (GRID KARTU) ---
  if (activeView === "menu") {
    return (
      <div className="space-y-8">
        {/* Header Sederhana */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            PAYMENT SERVICE
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Layanan Pembayaran dan Administrasi Perpajakan
          </p>
        </div>

        {/* Grid Menu 4 Kolom (Sesuai List Anda) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {billingServices.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-lg ${item.color} bg-opacity-10 flex items-center justify-center mb-4`}
                >
                  <item.icon
                    className={`w-6 h-6 ${item.color.replace("bg-", "text-")}`}
                  />
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => {
                  if (item.action === "create") setActiveView("create");
                  else if (item.action === "list" || item.action === "history")
                    handleOpenList();
                  else alert("Fitur ini belum tersedia di simulasi.");
                }}
                className="w-full py-2.5 rounded-lg border border-blue-600 text-blue-600 font-bold text-xs uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                AKSES LAYANAN
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: FORM BUAT BILLING (KODE BILLING MANDIRI) ---
  if (activeView === "create") {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="font-bold text-lg">Kode Billing Mandiri</h2>
          <button
            onClick={() => setActiveView("menu")}
            className="hover:bg-emerald-700 p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {/* Form Content Sama Seperti Sebelumnya */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Identitas Penyetor
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  required
                  type="text"
                  placeholder="NPWP"
                  className="w-1/3 border rounded px-3 py-2 text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, npwp: e.target.value })
                  }
                />
                <input
                  required
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-2/3 border rounded px-3 py-2 text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Jenis Pajak (KAP)
              </label>
              <select
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                onChange={(e) =>
                  setFormData({ ...formData, kap: e.target.value })
                }
              >
                <option value="411121">411121 - PPh 21</option>
                <option value="411125">411125 - PPh 25/29 OP</option>
                <option value="411211">411211 - PPN</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Jenis Setoran (KJS)
              </label>
              <select
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                onChange={(e) =>
                  setFormData({ ...formData, kjs: e.target.value })
                }
              >
                <option value="100">100 - Masa</option>
                <option value="200">200 - Tahunan</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Nominal Setor (Rp)
              </label>
              <input
                required
                type="number"
                className="w-full border rounded px-3 py-2 text-sm mt-1 font-bold text-lg"
                onChange={(e) =>
                  setFormData({ ...formData, nominal: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setActiveView("menu")}
              className="flex-1 py-3 text-gray-500 font-bold text-sm border rounded hover:bg-gray-50"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-emerald-600 text-white font-bold text-sm rounded hover:bg-emerald-700 shadow-md"
            >
              {isLoading ? "MEMPROSES..." : "BUAT KODE BILLING"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- TAMPILAN 3: DAFTAR BILLING (BILLING BELUM BAYAR / RIWAYAT) ---
  if (activeView === "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Daftar Kode Billing
          </h2>
          <button
            onClick={() => setActiveView("menu")}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
          >
            <ArrowRight className="rotate-180" size={16} /> Kembali ke Menu
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">ID Billing</th>
                <th className="px-6 py-4">KAP/KJS</th>
                <th className="px-6 py-4">Masa</th>
                <th className="px-6 py-4 text-right">Nominal</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Belum ada data.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                      {item.id_billing}
                    </td>
                    <td className="px-6 py-4">{item.kode_jenis}</td>
                    <td className="px-6 py-4">{item.masa_tahun}</td>
                    <td className="px-6 py-4 text-right font-bold">
                      Rp {item.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">
                        AKTIF
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
