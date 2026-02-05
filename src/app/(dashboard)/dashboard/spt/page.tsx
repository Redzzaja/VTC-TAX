"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSptListAction,
  saveSptDraftAction,
  deleteSptAction,
  getSptDetailAction,
} from "@/actions/spt-action";
import {
  FileText,
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Table,
  FolderX,
  CreditCard,
  X,
  PlusCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

// --- WIZARD COMPONENT (MODAL STYLE - PROFESIONAL) ---
function CreateSptWizardModal({ isOpen, onClose, onSuccess }: any) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    jenisPajak: "",
    masa: "Januari",
    tahun: "2025",
    pembetulan: "0",
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        jenisPajak: "",
        masa: "Januari",
        tahun: "2025",
        pembetulan: "0",
      });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const payload = {
      jenisPajak: formData.jenisPajak,
      masa: formData.masa,
      tahun: formData.tahun,
      pembetulan: parseInt(formData.pembetulan) || 0,
    };

    const result = await saveSptDraftAction(payload);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      onSuccess();
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  const steps = [
    { num: 1, label: "Jenis" },
    { num: 2, label: "Periode" },
    { num: 3, label: "Simpan" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Menggunakan Slate-900 agar elegan */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <PlusCircle size={20} className="text-yellow-500" />
              Buat SPT Masa
            </h3>
            {/* Indikator Step yang Minimalis */}
            <div className="flex gap-1 mt-1">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className={`h-1 w-8 rounded-full ${step >= s.num ? "bg-yellow-500" : "bg-slate-700"}`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <h4 className="font-bold text-slate-800 text-lg text-center mb-4">
                Pilih Jenis Pajak
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {[
                  "PPh Pasal 21/26",
                  "PPh Unifikasi",
                  "PPN Dalam Negeri",
                  "PPh Badan",
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setFormData({ ...formData, jenisPajak: type })
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${
                      formData.jenisPajak === type
                        ? "border-slate-800 bg-slate-50 text-slate-900 shadow-sm"
                        : "border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="font-bold">{type}</span>
                    {formData.jenisPajak === type && (
                      <CheckCircle2 size={18} className="text-slate-900" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <h4 className="font-bold text-slate-800 text-lg text-center mb-2">
                Tentukan Periode
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Masa Pajak
                  </label>
                  <select
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-500"
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
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Tahun Pajak
                  </label>
                  <input
                    type="number"
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-500"
                    value={formData.tahun}
                    onChange={(e) =>
                      setFormData({ ...formData, tahun: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Status Pembetulan
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-500"
                  value={formData.pembetulan}
                  onChange={(e) =>
                    setFormData({ ...formData, pembetulan: e.target.value })
                  }
                >
                  <option value="0">Normal (0)</option>
                  <option value="1">Pembetulan Ke-1</option>
                  <option value="2">Pembetulan Ke-2</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 text-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText size={32} />
              </div>
              <h4 className="font-bold text-slate-800 text-lg">
                Konfirmasi Data
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Pajak:</span>
                  <span className="font-bold text-slate-800">
                    {formData.jenisPajak}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Masa / Tahun:</span>
                  <span className="font-bold text-slate-800">
                    {formData.masa} {formData.tahun}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-slate-800">
                    {formData.pembetulan === "0"
                      ? "Normal"
                      : `Pembetulan ${formData.pembetulan}`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-800"
            >
              Kembali
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              disabled={!formData.jenisPajak}
              onClick={() => setStep(step + 1)}
              className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
            >
              Lanjut <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}{" "}
              Simpan Konsep
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SptPage() {
  const router = useRouter();

  // --- STATE ---
  const [view, setView] = useState<"LIST" | "DETAIL">("LIST");
  const [dataList, setDataList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Detail State
  const [detailData, setDetailData] = useState<any>(null);
  const [selectedSpt, setSelectedSpt] = useState<any>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<"INDUK" | "L1">(
    "INDUK",
  );

  // Load Data
  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    setIsLoading(true);
    const res = await getSptListAction();
    setDataList(res);
    setIsLoading(false);
  };

  const openDetail = async (item: any) => {
    setView("DETAIL");
    setSelectedSpt(item);
    setDetailData(null);

    const res = await getSptDetailAction(item.masa, item.tahun);
    if (res.success) {
      setDetailData(res.data);
    } else {
      toast.error("Gagal mengambil rincian SPT");
    }
  };

  // --- DELETE DENGAN MODAL ---
  const onDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    const promise = deleteSptAction(deleteId);
    setDeleteId(null);

    toast.promise(promise, {
      loading: "Menghapus...",
      success: () => {
        loadList();
        return "Terhapus";
      },
      error: "Gagal menghapus",
    });
  };

  const handleProceedToBilling = () => {
    if (!selectedSpt) return;
    let kap = "411121"; // Default PPh 21
    let kjs = "100";
    if (selectedSpt.jenis.includes("PPN")) kap = "411211";
    if (selectedSpt.jenis.includes("Badan")) kap = "411126";

    const queryParams = new URLSearchParams({
      action: "create",
      kap: kap,
      kjs: kjs,
      masa: selectedSpt.masa,
      tahun: selectedSpt.tahun,
      nominal: selectedSpt.nominal.toString(),
    }).toString();

    router.push(`/dashboard/billing?${queryParams}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* --- TOMBOL KEMBALI --- */}
      {view === "LIST" && (
        <div>
          <Link
            href="/dashboard/simulasi"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm mb-2"
          >
            <ArrowLeft size={18} /> Kembali ke Menu Simulasi
          </Link>
        </div>
      )}

      {/* TAMPILAN 1: LIST SPT */}
      {view === "LIST" && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-slate-600" /> SPT Masa
              </h1>
              <p className="text-sm text-slate-500">
                Kelola pelaporan Surat Pemberitahuan Pajak (SPT).
              </p>
            </div>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Plus size={18} className="text-yellow-500" /> Buat SPT
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Masa Pajak</th>
                  <th className="px-6 py-4">Jenis SPT</th>
                  <th className="px-6 py-4">Pembetulan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Nominal PPh</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : dataList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      Belum ada Konsep SPT. Silakan buat baru.
                    </td>
                  </tr>
                ) : (
                  dataList.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">
                          {item.masa} {item.tahun}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.tanggal}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {item.jenis}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                          {item.pembetulan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === "Draft" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">
                        Rp {item.nominal.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center flex justify-center gap-2">
                        <button
                          onClick={() => openDetail(item)}
                          className="text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
                          title="Edit / Detail"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => onDeleteClick(item.id)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAMPILAN 3: DETAIL */}
      {view === "DETAIL" && (
        <div className="space-y-6 animate-in zoom-in-95 duration-200">
          <button
            onClick={() => setView("LIST")}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Kembali ke Daftar
          </button>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-white p-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h5 className="text-slate-800 font-bold uppercase text-lg">
                  {selectedSpt?.jenis || "SPT MASA"}
                </h5>
                <p className="text-sm text-slate-500">
                  Masa: {selectedSpt?.masa} {selectedSpt?.tahun}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Total PPh Terutang
                </p>
                <p className="text-xl font-bold text-emerald-600">
                  Rp {selectedSpt?.nominal.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="px-6 border-b border-slate-200 flex gap-6">
              <button
                onClick={() => setActiveDetailTab("INDUK")}
                className={`py-4 font-bold text-sm border-b-2 transition-colors ${activeDetailTab === "INDUK" ? "border-slate-800 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}
              >
                Induk SPT
              </button>
              <button
                onClick={() => setActiveDetailTab("L1")}
                className={`py-4 font-bold text-sm border-b-2 transition-colors ${activeDetailTab === "L1" ? "border-slate-800 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}
              >
                Lampiran 1721-I
              </button>
            </div>

            <div className="p-8 min-h-100">
              {activeDetailTab === "INDUK" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 p-3 font-bold text-slate-700 text-sm border-b border-slate-200">
                      Rincian PPh
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">
                          1. Pegawai Tetap
                        </span>
                        <span className="font-mono font-medium text-slate-800">
                          Rp{" "}
                          {detailData?.pegawaiTetap?.toLocaleString("id-ID") ||
                            0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">
                          2. Penerima Pensiun
                        </span>
                        <span className="font-mono font-medium text-slate-800">
                          Rp {detailData?.pensiun?.toLocaleString("id-ID") || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">
                          3. Pegawai Tidak Tetap
                        </span>
                        <span className="font-mono font-medium text-slate-800">
                          Rp{" "}
                          {detailData?.tidakTetap?.toLocaleString("id-ID") || 0}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-100 p-3 flex justify-between items-center border-t border-slate-200">
                      <span className="text-slate-800 font-bold text-sm">
                        TOTAL
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Rp {selectedSpt?.nominal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      onClick={() => {
                        toast.success("Draft Tersimpan");
                        setView("LIST");
                      }}
                      className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-2 rounded-lg font-bold text-sm transition-colors"
                    >
                      Simpan Draft
                    </button>
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-md transition-all"
                    >
                      <CreditCard size={16} /> Bayar & Lapor
                    </button>
                  </div>
                </div>
              )}
              {activeDetailTab === "L1" && (
                <div className="animate-in fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h6 className="text-slate-700 font-bold flex items-center gap-2">
                      <Table size={16} /> DAFTAR PEMOTONGAN
                    </h6>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-bold border border-slate-200">
                      Auto-Sync
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-xs text-left text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">No</th>
                          <th className="px-4 py-3">NPWP</th>
                          <th className="px-4 py-3">Nama</th>
                          <th className="px-4 py-3 text-right">Bruto (Rp)</th>
                          <th className="px-4 py-3 text-right">PPh (Rp)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {!detailData?.listBuktiPotong?.length ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-8 text-center text-slate-400"
                            >
                              <FolderX
                                className="mx-auto mb-2 opacity-50"
                                size={32}
                              />
                              Tidak ada bukti potong.
                            </td>
                          </tr>
                        ) : (
                          detailData.listBuktiPotong.map(
                            (item: any, i: number) => (
                              <tr key={i}>
                                <td className="px-4 py-3 text-center">
                                  {i + 1}
                                </td>
                                <td className="px-4 py-3 font-mono">
                                  {item.npwp}
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-800">
                                  {item.nama}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {item.bruto.toLocaleString("id-ID")}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-emerald-600">
                                  {item.pph.toLocaleString("id-ID")}
                                </td>
                              </tr>
                            ),
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- WIZARD MODAL --- */}
      <CreateSptWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={loadList}
      />

      {/* --- PAYMENT MODAL --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 bg-blue-50 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Lanjutkan ke Pembayaran?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Anda akan diarahkan ke halaman <b>Billing</b> untuk membuat ID
              Billing dengan nominal{" "}
              <span className="font-bold text-emerald-600">
                Rp {selectedSpt?.nominal.toLocaleString("id-ID")}
              </span>
              .
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="flex-1 py-2.5 text-slate-500 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleProceedToBilling}
                className="flex-1 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-700 shadow-md transition-colors"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI DELETE --- */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Hapus SPT?</h3>
                <p className="text-sm text-slate-500">
                  Apakah Anda yakin ingin menghapus draft SPT ini? Tindakan ini
                  tidak dapat dibatalkan.
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
