"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

// --- HELPER FORMATTING (TITIK RIBUAN) ---
const formatCurrency = (value: string | number) => {
  if (!value) return "";
  // Konversi ke string, hapus non-digit, lalu tambah titik
  const rawValue = value.toString().replace(/\D/g, "");
  return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value: string) => {
  // Hapus semua titik untuk mendapatkan nilai angka asli
  return value.replace(/\./g, "");
};

export default function EbupotPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<"BP-21" | "BPPU">("BP-21");
  const [statusTab, setStatusTab] = useState<"Belum Terbit" | "Terbit">(
    "Belum Terbit",
  );

  // State Form
  const [formData, setFormData] = useState({
    masa: "Januari",
    tahun: "2025",
    status_bupot: "Normal",
    npwp: "",
    nama: "",
    nitku: "",

    kode: "",
    tarif: "",
    pph: "", // Disimpan sebagai string angka murni ("100000")

    // BPPU
    fasilitas_pajak: "Tanpa Fasilitas",
    dpp_bppu: "",

    // BP-21
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

  // --- AUTO CALCULATION ---
  useEffect(() => {
    const tarif = parseFloat(formData.tarif) || 0;
    let hitunganPPh = 0;

    if (activeTab === "BPPU") {
      // Rumus BPPU: DPP * Tarif
      // Parse dulu karena state mungkin string kosong
      const dpp = parseFloat(formData.dpp_bppu) || 0;
      hitunganPPh = Math.floor(dpp * (tarif / 100));
    } else {
      // Rumus BP-21: (Bruto * Persen DPP) * Tarif
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
      // Pastikan kirim data angka murni (Server Action parsing parseFloat)
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
    if (!confirm("Posting data ini ke tab Terbit?")) return;
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

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data ini?")) return;
    const promise = deleteBupotAction(id);
    toast.promise(promise, {
      loading: "Menghapus...",
      success: () => {
        loadData();
        return "Terhapus";
      },
      error: "Gagal menghapus",
    });
  };

  // --- HANDLER KHUSUS INPUT KEUANGAN ---
  const handleMoneyChange = (field: string, value: string) => {
    // Hapus titik sebelum simpan ke state
    const cleanValue = parseCurrency(value);
    // Validasi hanya angka
    if (!/^\d*$/.test(cleanValue)) return;

    setFormData({ ...formData, [field]: cleanValue });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-emerald-600" /> e-Bupot 21/26 & Unifikasi
          </h1>
          <p className="text-sm text-gray-500">
            Administrasi Bukti Potong Pajak
          </p>
        </div>

        <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
          <button
            onClick={() => setActiveTab("BP-21")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "BP-21" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Users size={16} /> PPh 21/26
          </button>
          <button
            onClick={() => setActiveTab("BPPU")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "BPPU" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Building2 size={16} /> PPh Unifikasi
          </button>
        </div>
      </div>

      {/* List Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setStatusTab("Belum Terbit")}
            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors flex justify-center items-center gap-2 ${statusTab === "Belum Terbit" ? "border-emerald-500 text-emerald-700 bg-emerald-50/50" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
          >
            <Archive size={18} /> Belum Terbit (Draft)
          </button>
          <button
            onClick={() => setStatusTab("Terbit")}
            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors flex justify-center items-center gap-2 ${statusTab === "Terbit" ? "border-blue-500 text-blue-700 bg-blue-50/50" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
          >
            <CheckCircle2 size={18} /> Sudah Terbit
          </button>
        </div>

        <div className="p-4 flex justify-between items-center bg-gray-50">
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari NPWP / Nama..."
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-emerald-500 outline-none w-64"
            />
          </div>

          {statusTab === "Belum Terbit" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <Plus size={16} /> Rekam {activeTab}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-600 font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">No Bukti Potong</th>
                <th className="px-6 py-3">Masa</th>
                <th className="px-6 py-3">Identitas WP</th>
                <th className="px-6 py-3">Objek Pajak</th>
                <th className="px-6 py-3 text-right">Penghasilan Bruto</th>
                <th className="px-6 py-3 text-right">PPh Dipotong</th>
                {statusTab === "Belum Terbit" && (
                  <th className="px-6 py-3 text-center">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-blue-600">
                      {item.bupot_id}
                    </td>
                    <td className="px-6 py-4">{item.masa}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">
                        {item.identitas.nama}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {item.identitas.npwp}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                        {item.kode_objek}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      Rp {item.bruto.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      Rp {item.pph.toLocaleString("id-ID")}
                    </td>
                    {statusTab === "Belum Terbit" && (
                      <td className="px-6 py-4 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="text-emerald-500 bg-emerald-50 p-2 rounded-lg"
                          title="Posting"
                        >
                          <Stamp size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-gray-400 hover:text-red-500 p-2"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
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
            <div
              className={`px-6 py-4 flex justify-between items-center text-white sticky top-0 z-10 ${activeTab === "BPPU" ? "bg-blue-600" : "bg-emerald-600"}`}
            >
              <h3 className="font-bold text-lg flex items-center gap-2">
                {activeTab === "BPPU" ? (
                  <Building2 size={20} />
                ) : (
                  <Users size={20} />
                )}
                Rekam {activeTab === "BPPU" ? "PPh Unifikasi" : "PPh 21/26"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/20 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <form className="p-8 space-y-8">
              {/* I. INFORMASI UMUM */}
              <section>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">
                  I. Informasi Umum
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="text-xs font-bold text-gray-500">
                        Masa Pajak <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border rounded-lg p-2.5 text-sm mt-1"
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
                      <label className="text-xs font-bold text-gray-500">
                        Tahun
                      </label>
                      <input
                        className="w-full border rounded-lg p-2.5 text-sm mt-1 bg-gray-50"
                        value={formData.tahun}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border rounded-lg p-2.5 text-sm mt-1"
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
                    <label className="text-xs font-bold text-gray-500">
                      NPWP / NIK <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      className="w-full border rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.npwp}
                      onChange={(e) =>
                        setFormData({ ...formData, npwp: e.target.value })
                      }
                      placeholder="00.000.000.0-000.000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">
                      Nama <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      className="w-full border rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500">
                      NITKU / Identitas Sub Unit
                    </label>
                    <input
                      className="w-full border rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
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
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">
                  II. Pajak Penghasilan
                </h4>

                {/* --- KHUSUS BPPU --- */}
                {activeTab === "BPPU" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500">
                        Fasilitas Pajak
                      </label>
                      <select
                        className="w-full border rounded-lg p-2.5 text-sm mt-1"
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
                      <label className="text-xs font-bold text-gray-500">
                        Kode Objek Pajak <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border rounded-lg p-2.5 text-sm mt-1"
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
                      <label className="text-xs font-bold text-gray-500">
                        Dasar Pengenaan Pajak (Rp){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full border rounded-lg p-2.5 text-sm mt-1 font-bold"
                        value={formatCurrency(formData.dpp_bppu)}
                        onChange={(e) =>
                          handleMoneyChange("dpp_bppu", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}

                {/* --- KHUSUS BP-21 --- */}
                {activeTab === "BP-21" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500">
                        Status PTKP <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border rounded-lg p-2.5 text-sm mt-1"
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
                      <label className="text-xs font-bold text-gray-500">
                        Kode Objek Pajak <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border rounded-lg p-2.5 text-sm mt-1"
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
                      <label className="text-xs font-bold text-gray-500">
                        Penghasilan Bruto (Rp){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full border rounded-lg p-2.5 text-sm mt-1 font-bold"
                        value={formatCurrency(formData.bruto_bp21)}
                        onChange={(e) =>
                          handleMoneyChange("bruto_bp21", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500">
                        DPP (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="number"
                        className="w-full border rounded-lg p-2.5 text-sm mt-1"
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

                {/* --- SHARED INPUTS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500">
                      Tarif (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      className="w-full border rounded-lg p-2.5 text-sm mt-1"
                      value={formData.tarif}
                      onChange={(e) =>
                        setFormData({ ...formData, tarif: e.target.value })
                      }
                      placeholder="Contoh: 5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">
                      Pajak Penghasilan (Rp){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full border rounded-lg p-2.5 text-sm mt-1 font-bold bg-gray-50 text-emerald-700"
                      value={formatCurrency(formData.pph)}
                      onChange={(e) => handleMoneyChange("pph", e.target.value)}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      *Otomatis dihitung, dapat diedit
                    </p>
                  </div>
                </div>
              </section>

              {/* III. DOKUMEN REFERENSI */}
              <section>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">
                  III. Dokumen Referensi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500">
                      Jenis Dokumen
                    </label>
                    <select
                      className="w-full border rounded-lg p-2.5 text-sm mt-1"
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
                    <label className="text-xs font-bold text-gray-500">
                      Nomor Dokumen
                    </label>
                    <input
                      className="w-full border rounded-lg p-2.5 text-sm mt-1"
                      value={formData.no_dokumen}
                      onChange={(e) =>
                        setFormData({ ...formData, no_dokumen: e.target.value })
                      }
                      placeholder="INV/2025/..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">
                      Tanggal Dokumen
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded-lg p-2.5 text-sm mt-1"
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

              <div className="pt-6 flex gap-3 border-t border-gray-100 sticky bottom-0 bg-white z-10">
                <button
                  onClick={(e) => handleSubmit(e, "Draft")}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
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
                  className={`flex-1 py-3 text-white font-bold text-sm rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md ${activeTab === "BPPU" ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
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
    </div>
  );
}
