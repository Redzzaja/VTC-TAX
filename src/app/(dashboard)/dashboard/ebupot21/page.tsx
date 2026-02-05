"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getBupotListAction,
  createBupotAction,
  deleteBupotAction,
  approveBupotAction,
} from "@/actions/bupot-action";
import {
  FileText,
  Plus,
  Search,
  Users,
  Building2,
  Archive,
  CheckCircle2,
  Loader2,
  Trash2,
  Stamp,
  X,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

// --- HELPER FORMATTING ---
const formatCurrency = (value: string | number) => {
  if (!value) return "";
  const rawValue = value.toString().replace(/\D/g, "");
  return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value: string) => {
  return value.replace(/\./g, "");
};

export default function EbupotPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<"BP-21" | "BPPU">("BP-21");
  const [statusTab, setStatusTab] = useState<"Belum Terbit" | "Terbit">(
    "Belum Terbit",
  );

  const [formData, setFormData] = useState({
    masa: "Januari",
    tahun: "2025",
    status_bupot: "Normal",
    npwp: "",
    nama: "",
    nitku: "",
    kode: "",
    tarif: "",
    pph: "",
    fasilitas_pajak: "Tanpa Fasilitas",
    dpp_bppu: "",
    status_ptkp: "TK/0",
    bruto_bp21: "",
    persentase_dpp: "100",
    jenis_dokumen: "Invoice",
    no_dokumen: "",
    tanggal_dokumen: "",
  });

  const loadData = async () => {
    setIsLoading(true);
    const res = await getBupotListAction();
    setData(res);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const tarif = parseFloat(formData.tarif) || 0;
    let hitunganPPh = 0;
    if (activeTab === "BPPU") {
      const dpp = parseFloat(formData.dpp_bppu) || 0;
      hitunganPPh = Math.floor(dpp * (tarif / 100));
    } else {
      const bruto = parseFloat(formData.bruto_bp21) || 0;
      const persenDpp = parseFloat(formData.persentase_dpp) || 100;
      const dpp = bruto * (persenDpp / 100);
      hitunganPPh = Math.floor(dpp * (tarif / 100));
    }
    setFormData((prev) => ({ ...prev, pph: hitunganPPh.toString() }));
  }, [
    formData.dpp_bppu,
    formData.bruto_bp21,
    formData.tarif,
    formData.persentase_dpp,
    activeTab,
  ]);

  const filteredData = data.filter((item) => {
    if (item.jenis_bupot !== activeTab) return false;
    if (statusTab === "Belum Terbit") {
      return item.status === "Draft" || item.status === "Belum Lapor";
    } else {
      return item.status === "Terbit" || item.status === "Lapor";
    }
  });

  const handleSubmit = async (
    e: React.FormEvent,
    statusSimpan: "Draft" | "Terbit",
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      ...formData,
      jenis_bupot: activeTab,
      status: statusSimpan,
      bruto: activeTab === "BPPU" ? formData.dpp_bppu : formData.bruto_bp21,
    };
    const res = await createBupotAction(payload);
    setIsSubmitting(false);
    if (res.success) {
      toast.success(res.message);
      setIsModalOpen(false);
      resetForm();
      loadData();
    } else {
      toast.error(res.message);
    }
  };

  const resetForm = () => {
    setFormData({
      masa: "Januari",
      tahun: "2025",
      status_bupot: "Normal",
      npwp: "",
      nama: "",
      nitku: "",
      kode: "",
      tarif: "",
      pph: "",
      fasilitas_pajak: "Tanpa Fasilitas",
      dpp_bppu: "",
      status_ptkp: "TK/0",
      bruto_bp21: "",
      persentase_dpp: "100",
      jenis_dokumen: "Invoice",
      no_dokumen: "",
      tanggal_dokumen: "",
    });
  };

  const handleApprove = (id: number) => {
    const promise = approveBupotAction(id);
    toast.promise(promise, {
      loading: "Memposting...",
      success: (data) => {
        loadData();
        return data.message;
      },
      error: "Gagal memposting",
    });
  };

  const onDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    const promise = deleteBupotAction(deleteId);
    setDeleteId(null);
    toast.promise(promise, {
      loading: "Menghapus...",
      success: () => {
        loadData();
        return "Terhapus";
      },
      error: "Gagal menghapus",
    });
  };

  const handleMoneyChange = (field: string, value: string) => {
    const cleanValue = parseCurrency(value);
    if (!/^\d*$/.test(cleanValue)) return;
    setFormData({ ...formData, [field]: cleanValue });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* --- TOMBOL KEMBALI --- */}
      <div>
        <Link
          href="/dashboard/simulasi"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm mb-2"
        >
          <ArrowLeft size={18} /> Kembali ke Menu Simulasi
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-slate-600" /> e-Bupot 21/26 & Unifikasi
          </h1>
          <p className="text-sm text-slate-500">
            Administrasi Bukti Potong Pajak
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-1 rounded-lg flex gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab("BP-21")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "BP-21" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
          >
            <Users size={16} /> PPh 21/26
          </button>
          <button
            onClick={() => setActiveTab("BPPU")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "BPPU" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
          >
            <Briefcase size={16} /> PPh Unifikasi
          </button>
        </div>
      </div>

      {/* List Data */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setStatusTab("Belum Terbit")}
            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors flex justify-center items-center gap-2 ${statusTab === "Belum Terbit" ? "border-slate-800 text-slate-900 bg-slate-50" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <Archive size={18} /> Belum Terbit (Draft)
          </button>
          <button
            onClick={() => setStatusTab("Terbit")}
            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors flex justify-center items-center gap-2 ${statusTab === "Terbit" ? "border-slate-800 text-slate-900 bg-slate-50" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <CheckCircle2 size={18} /> Sudah Terbit
          </button>
        </div>

        <div className="p-4 flex justify-between items-center bg-white border-b border-slate-100">
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari NPWP / Nama..."
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-slate-500 outline-none w-64"
            />
          </div>

          {statusTab === "Belum Terbit" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Plus size={16} className="text-yellow-500" /> Rekam {activeTab}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">No Bukti Potong</th>
                <th className="px-6 py-4">Masa</th>
                <th className="px-6 py-4">Identitas WP</th>
                <th className="px-6 py-4">Objek Pajak</th>
                <th className="px-6 py-4 text-right">Penghasilan Bruto</th>
                <th className="px-6 py-4 text-right">PPh Dipotong</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-600">
                      {item.bupot_id}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.masa}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {item.identitas.nama}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {item.identitas.npwp}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-600">
                        {item.kode_objek}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-600">
                      Rp {item.bruto.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-700">
                      Rp {item.pph.toLocaleString("id-ID")}
                    </td>

                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                      {statusTab === "Belum Terbit" && (
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="text-slate-600 bg-slate-100 p-2 rounded-lg hover:bg-slate-200 transition-colors"
                          title="Posting"
                        >
                          <Stamp size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteClick(item.id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            {/* Header Modal - Slate 900 */}
            <div className="px-6 py-4 flex justify-between items-center bg-slate-900 text-white sticky top-0 z-10 border-b border-slate-800">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {activeTab === "BPPU" ? (
                  <Briefcase size={20} className="text-yellow-500" />
                ) : (
                  <Users size={20} className="text-yellow-500" />
                )}
                Rekam {activeTab === "BPPU" ? "PPh Unifikasi" : "PPh 21/26"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form className="p-8 space-y-8">
              {/* I. INFORMASI UMUM */}
              <section>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                  I. Informasi Umum
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Masa Pajak <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
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
                        ].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Tahun
                      </label>
                      <input
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 bg-slate-50 text-slate-500"
                        value={formData.tahun}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                      value={formData.status_bupot}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status_bupot: e.target.value,
                        })
                      }
                    >
                      <option value="Normal">Normal</option>
                      <option value="Pembetulan">Pembetulan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      NPWP / NIK <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                      value={formData.npwp}
                      onChange={(e) =>
                        setFormData({ ...formData, npwp: e.target.value })
                      }
                      placeholder="00.000.000.0-000.000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Nama <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      NITKU / Identitas Sub Unit
                    </label>
                    <input
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                      value={formData.nitku}
                      onChange={(e) =>
                        setFormData({ ...formData, nitku: e.target.value })
                      }
                      placeholder="Opsional"
                    />
                  </div>
                </div>
              </section>

              {/* II. PAJAK PENGHASILAN */}
              <section>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                  II. Pajak Penghasilan
                </h4>
                {activeTab === "BPPU" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Fasilitas Pajak
                      </label>
                      <select
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                        value={formData.fasilitas_pajak}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fasilitas_pajak: e.target.value,
                          })
                        }
                      >
                        <option value="Tanpa Fasilitas">Tanpa Fasilitas</option>
                        <option value="SKB">Surat Keterangan Bebas</option>
                        <option value="DTP">Ditanggung Pemerintah</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Kode Objek Pajak <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                        value={formData.kode}
                        onChange={(e) =>
                          setFormData({ ...formData, kode: e.target.value })
                        }
                      >
                        <option value="">Pilih Kode...</option>
                        <option value="24-100-01">
                          24-100-01 (Sewa Tanah/Bangunan)
                        </option>
                        <option value="24-100-02">
                          24-100-02 (Jasa Konstruksi)
                        </option>
                        <option value="22-100-01">
                          22-100-01 (Pengadaan Barang)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Dasar Pengenaan Pajak (Rp){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 font-bold focus:ring-2 focus:ring-slate-500 outline-none"
                        value={formatCurrency(formData.dpp_bppu)}
                        onChange={(e) =>
                          handleMoneyChange("dpp_bppu", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "BP-21" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Status PTKP <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                        value={formData.status_ptkp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status_ptkp: e.target.value,
                          })
                        }
                      >
                        <option value="TK/0">TK/0</option>
                        <option value="K/0">K/0</option>
                        <option value="K/1">K/1</option>
                        <option value="K/2">K/2</option>
                        <option value="K/3">K/3</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Kode Objek Pajak <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                        value={formData.kode}
                        onChange={(e) =>
                          setFormData({ ...formData, kode: e.target.value })
                        }
                      >
                        <option value="">Pilih Kode...</option>
                        <option value="21-100-01">
                          21-100-01 (Pegawai Tetap)
                        </option>
                        <option value="21-100-02">
                          21-100-02 (Penerima Pensiun)
                        </option>
                        <option value="21-100-03">
                          21-100-03 (Pegawai Tidak Tetap)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Penghasilan Bruto (Rp){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 font-bold focus:ring-2 focus:ring-slate-500 outline-none"
                        value={formatCurrency(formData.bruto_bp21)}
                        onChange={(e) =>
                          handleMoneyChange("bruto_bp21", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        DPP (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="number"
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                        value={formData.persentase_dpp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            persentase_dpp: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Tarif (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                      value={formData.tarif}
                      onChange={(e) =>
                        setFormData({ ...formData, tarif: e.target.value })
                      }
                      placeholder="Contoh: 5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Pajak Penghasilan (Rp){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 font-bold bg-slate-50 text-slate-700"
                      value={formatCurrency(formData.pph)}
                      onChange={(e) => handleMoneyChange("pph", e.target.value)}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      *Otomatis dihitung, dapat diedit
                    </p>
                  </div>
                </div>
              </section>

              {/* III. DOKUMEN REFERENSI */}
              <section>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                  III. Dokumen Referensi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Jenis Dokumen
                    </label>
                    <select
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                      value={formData.jenis_dokumen}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jenis_dokumen: e.target.value,
                        })
                      }
                    >
                      <option value="Faktur Pajak">Faktur Pajak</option>
                      <option value="Invoice">Invoice</option>
                      <option value="Pengumuman">Pengumuman</option>
                      <option value="Surat Perintah Kerja">
                        Surat Perintah Kerja
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Nomor Dokumen
                    </label>
                    <input
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                      value={formData.no_dokumen}
                      onChange={(e) =>
                        setFormData({ ...formData, no_dokumen: e.target.value })
                      }
                      placeholder="INV/2025/..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Tanggal Dokumen
                    </label>
                    <input
                      type="date"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-slate-500 outline-none"
                      value={formData.tanggal_dokumen}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggal_dokumen: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </section>

              <div className="pt-6 flex gap-3 border-t border-slate-100 sticky bottom-0 bg-white z-10">
                <button
                  onClick={(e) => handleSubmit(e, "Draft")}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Simpan Draft"
                  )}
                </button>
                <button
                  onClick={(e) => handleSubmit(e, "Terbit")}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-all shadow-md flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Simpan & Terbitkan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI DELETE --- */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Hapus Data?
                </h3>
                <p className="text-sm text-slate-500">
                  Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak
                  dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 text-slate-700 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={onConfirmDelete}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 shadow-md transition-colors"
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
