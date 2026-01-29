"use client";

import { useState, useEffect } from "react";
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
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SptPage() {
  const router = useRouter();

  // --- STATE ---
  const [view, setView] = useState<"LIST" | "WIZARD" | "DETAIL">("LIST");
  const [dataList, setDataList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Modal Popup

  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    type: "",
    month: "Januari",
    year: "2025",
    model: "Normal",
  });

  // Detail State
  const [detailData, setDetailData] = useState<any>(null);
  const [selectedSpt, setSelectedSpt] = useState<any>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<"INDUK" | "L1">(
    "INDUK",
  );

  // Load Data Awal
  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    setIsLoading(true);
    const res = await getSptListAction();
    setDataList(res);
    setIsLoading(false);
  };

  const handleWizardFinish = async () => {
    const payload = {
      jenisPajak: wizardData.type,
      masa: wizardData.month,
      tahun: wizardData.year,
      pembetulan: wizardData.model === "Pembetulan" ? 1 : 0,
    };

    const promise = saveSptDraftAction(payload);

    toast.promise(promise, {
      loading: "Menghitung & Menyinkronkan...",
      success: (res) => {
        if (res.success) {
          loadList();
          setView("LIST");
          setWizardStep(1);
          return res.message;
        } else {
          throw new Error(res.message);
        }
      },
      error: (err) => `Gagal: ${err.message}`,
    });
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

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus SPT ini?")) return;
    const res = await deleteSptAction(id);
    if (res.success) {
      toast.success("Terhapus");
      loadList();
    } else {
      toast.error("Gagal menghapus");
    }
  };

  // --- LOGIKA INTEGRASI BILLING ---
  const handleProceedToBilling = () => {
    if (!selectedSpt) return;

    // 1. Tentukan KAP/KJS berdasarkan Jenis SPT (Simple mapping)
    let kap = "411121"; // Default PPh 21
    let kjs = "100";

    if (selectedSpt.jenis.includes("PPN")) kap = "411211";
    if (selectedSpt.jenis.includes("Badan")) kap = "411126"; // Contoh

    // 2. Buat URL dengan Query Params
    const queryParams = new URLSearchParams({
      action: "create",
      kap: kap,
      kjs: kjs,
      masa: selectedSpt.masa,
      tahun: selectedSpt.tahun,
      nominal: selectedSpt.nominal.toString(),
    }).toString();

    // 3. Redirect ke Billing
    router.push(`/dashboard/billing?${queryParams}`);
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      {/* TAMPILAN 1: LIST SPT */}
      {view === "LIST" && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-emerald-600" /> SPT Masa
              </h1>
              <p className="text-sm text-gray-500">
                Kelola pelaporan Surat Pemberitahuan Pajak (SPT).
              </p>
            </div>
            <button
              onClick={() => {
                setView("WIZARD");
                setWizardStep(1);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Plus size={18} /> Buat SPT
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-xs border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Masa Pajak</th>
                  <th className="px-6 py-4">Jenis SPT</th>
                  <th className="px-6 py-4">Pembetulan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Nominal PPh</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : dataList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      Belum ada Konsep SPT. Silakan buat baru.
                    </td>
                  </tr>
                ) : (
                  dataList.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">
                          {item.masa} {item.tahun}
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.tanggal}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600">
                        {item.jenis}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                          {item.pembetulan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === "Draft" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                        Rp {item.nominal.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center flex justify-center gap-2">
                        <button
                          onClick={() => openDetail(item)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Edit / Detail"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
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

      {/* TAMPILAN 2: WIZARD (CREATE) - Sama seperti sebelumnya, disederhanakan di sini */}
      {view === "WIZARD" && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500">
          <button
            onClick={() => setView("LIST")}
            className="text-gray-500 hover:text-blue-600 flex items-center gap-2 mb-4"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-emerald-600 p-6 text-white flex items-center gap-3">
              <FileText size={28} />
              <h2 className="text-lg font-bold">Wizard Konsep SPT</h2>
            </div>
            {/* Step Content */}
            <div className="p-8">
              {wizardStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["PPN", "PPh Pasal 21/26", "PPh Unifikasi", "PPh Badan"].map(
                    (type) => (
                      <div
                        key={type}
                        onClick={() => setWizardData({ ...wizardData, type })}
                        className={`p-4 rounded-xl border-2 cursor-pointer ${wizardData.type === type ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-emerald-200"}`}
                      >
                        <div className="font-bold text-center">{type}</div>
                      </div>
                    ),
                  )}
                  <div className="col-span-2 flex justify-end pt-6">
                    <button
                      disabled={!wizardData.type}
                      onClick={() => setWizardStep(2)}
                      className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold disabled:opacity-50"
                    >
                      Lanjut
                    </button>
                  </div>
                </div>
              )}
              {wizardStep === 2 && (
                <div className="grid grid-cols-2 gap-6">
                  <select
                    className="border p-3 rounded-lg"
                    value={wizardData.month}
                    onChange={(e) =>
                      setWizardData({ ...wizardData, month: e.target.value })
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
                    className="border p-3 rounded-lg"
                    value={wizardData.year}
                    onChange={(e) =>
                      setWizardData({ ...wizardData, year: e.target.value })
                    }
                  />
                  <div className="col-span-2 flex justify-between pt-6">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="text-gray-400 font-bold"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => setWizardStep(3)}
                      className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold"
                    >
                      Lanjut
                    </button>
                  </div>
                </div>
              )}
              {wizardStep === 3 && (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">{wizardData.type}</h3>
                  <p className="text-emerald-600 font-mono">
                    {wizardData.month} {wizardData.year}
                  </p>
                  <select
                    className="border p-3 rounded-lg w-full"
                    value={wizardData.model}
                    onChange={(e) =>
                      setWizardData({ ...wizardData, model: e.target.value })
                    }
                  >
                    <option value="Normal">Normal</option>
                    <option value="Pembetulan">Pembetulan</option>
                  </select>
                  <div className="flex justify-between pt-6">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="text-gray-400 font-bold"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleWizardFinish}
                      className="bg-emerald-600 text-white px-8 py-2.5 rounded-lg font-bold"
                    >
                      Buat Konsep
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAMPILAN 3: DETAIL */}
      {view === "DETAIL" && (
        <div className="space-y-6 animate-in zoom-in-95 duration-200">
          <button
            onClick={() => setView("LIST")}
            className="text-gray-500 hover:text-blue-600 flex items-center gap-2 mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Kembali ke Daftar
          </button>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h5 className="text-gray-800 font-bold uppercase">
                  {selectedSpt?.jenis || "SPT MASA"}
                </h5>
                <p className="text-sm text-gray-500">
                  Masa: {selectedSpt?.masa} {selectedSpt?.tahun}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase">
                  Total PPh Terutang
                </p>
                <p className="text-xl font-bold text-emerald-600">
                  Rp {selectedSpt?.nominal.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="px-6 pt-4 border-b border-gray-200 flex gap-4">
              <button
                onClick={() => setActiveDetailTab("INDUK")}
                className={`px-4 py-3 font-bold text-sm border-b-2 ${activeDetailTab === "INDUK" ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500"}`}
              >
                Induk SPT
              </button>
              <button
                onClick={() => setActiveDetailTab("L1")}
                className={`px-4 py-3 font-bold text-sm border-b-2 ${activeDetailTab === "L1" ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500"}`}
              >
                Lampiran 1721-I
              </button>
            </div>

            <div className="p-8 min-h-[400px]">
              {activeDetailTab === "INDUK" && (
                <div className="space-y-6 animate-in fade-in">
                  {/* Summary Content */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 font-bold text-gray-700 text-sm border-b border-gray-200">
                      Rincian PPh
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          1. Pegawai Tetap
                        </span>
                        <span className="font-mono font-medium">
                          Rp{" "}
                          {detailData?.pegawaiTetap?.toLocaleString("id-ID") ||
                            0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          2. Penerima Pensiun
                        </span>
                        <span className="font-mono font-medium">
                          Rp {detailData?.pensiun?.toLocaleString("id-ID") || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          3. Pegawai Tidak Tetap
                        </span>
                        <span className="font-mono font-medium">
                          Rp{" "}
                          {detailData?.tidakTetap?.toLocaleString("id-ID") || 0}
                        </span>
                      </div>
                    </div>
                    <div className="bg-emerald-50 p-3 flex justify-between items-center border-t border-emerald-100">
                      <span className="text-emerald-800 font-bold text-sm">
                        TOTAL
                      </span>
                      <span className="text-emerald-800 font-bold">
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
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold text-sm"
                    >
                      Simpan Draft
                    </button>
                    {/* BUTTON OPEN CUSTOM MODAL */}
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm"
                    >
                      <CreditCard size={16} /> Bayar & Lapor
                    </button>
                  </div>
                </div>
              )}
              {activeDetailTab === "L1" && (
                <div className="animate-in fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h6 className="text-gray-700 font-bold flex items-center gap-2">
                      <Table size={16} /> DAFTAR PEMOTONGAN
                    </h6>
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded font-bold">
                      Auto-Sync
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-xs text-left text-gray-600">
                      <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3">No</th>
                          <th className="px-4 py-3">NPWP</th>
                          <th className="px-4 py-3">Nama</th>
                          <th className="px-4 py-3 text-right">Bruto (Rp)</th>
                          <th className="px-4 py-3 text-right">PPh (Rp)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {!detailData?.listBuktiPotong?.length ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-8 text-center text-gray-400"
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
                                <td className="px-4 py-3 font-bold text-gray-800">
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

      {/* --- CUSTOM MODAL POPUP (PEMBAYARAN) --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Lanjutkan ke Pembayaran?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
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
                className="flex-1 py-2.5 text-gray-500 font-bold text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleProceedToBilling}
                className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 shadow-md"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
