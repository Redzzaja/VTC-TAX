"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSptListAction,
  saveSptDraftAction,
  deleteSptAction,
  getSptDetailAction,
  updateSptContentAction,
} from "@/actions/spt-action";
import {
  FileText,
  Wallet,
  Send,
  XCircle,
  Ban,
  ArrowLeft,
  PlusCircle,
  Search,
  Eye,
  Trash2,
  Pencil,
  Save,
  CreditCard,
  Loader2,
  Plus,
  X,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

// --- UTILS ---
const formatRupiah = (value: number | string) => {
  if (!value) return "0";
  const numberString = value.toString().replace(/[^,\d]/g, "");
  const split = numberString.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
};

const parseRupiah = (value: string | number) => {
  if (!value) return 0;
  if (typeof value === "number") return value;
  return parseInt(value.replace(/\./g, "").replace(/,/g, "")) || 0;
};

// --- LOGIKA HITUNG PAJAK PROGRESIF ---
const hitungPPhTerutang = (pkp: number) => {
  if (pkp <= 0) return 0;

  let sisaPKP = pkp;
  let pajak = 0;

  // Tier 1: 0 - 60jt (5%)
  if (sisaPKP > 0) {
    const kenapajak = Math.min(sisaPKP, 60_000_000);
    pajak += kenapajak * 0.05;
    sisaPKP -= kenapajak;
  }
  // Tier 2: 60jt - 250jt (15%)
  if (sisaPKP > 0) {
    const kenapajak = Math.min(sisaPKP, 190_000_000);
    pajak += kenapajak * 0.15;
    sisaPKP -= kenapajak;
  }
  // Tier 3: 250jt - 500jt (25%)
  if (sisaPKP > 0) {
    const kenapajak = Math.min(sisaPKP, 250_000_000);
    pajak += kenapajak * 0.25;
    sisaPKP -= kenapajak;
  }
  // Tier 4: 500jt - 5M (30%)
  if (sisaPKP > 0) {
    const kenapajak = Math.min(sisaPKP, 4_500_000_000);
    pajak += kenapajak * 0.3;
    sisaPKP -= kenapajak;
  }
  // Tier 5: > 5M (35%)
  if (sisaPKP > 0) {
    pajak += sisaPKP * 0.35;
  }

  return pajak;
};

// --- WIZARD COMPONENT (MODAL STYLE) ---
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
        {/* Header Modal - Slate 900 */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <PlusCircle size={20} className="text-yellow-500" />
              Konsep SPT
            </h3>
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
                  "PPh Orang Pribadi",
                  "PPh Pasal 21/26",
                  "PPh Unifikasi",
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
              className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center gap-2"
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

// --- MAIN PAGE ---
export default function CoretaxDashboard() {
  const router = useRouter();

  // State Utama
  const [view, setView] = useState<"LIST" | "DETAIL">("LIST");
  const [activeTab, setActiveTab] = useState<
    "KONSEP" | "MENUNGGU_BAYAR" | "DILAPORKAN" | "DITOLAK" | "DIBATALKAN"
  >("KONSEP");
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Detail & Form States
  const [selectedSpt, setSelectedSpt] = useState<any>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<"INDUK" | "L1" | "L2">(
    "INDUK",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    induk: {
      tahun_pajak: "",
      status_spt: "Normal",
      pembukuan: "Pencatatan",
      identitas: { npwp: "", nama: "", hp: "", email: "", status_si: "KK" },
      penghasilan: {
        neto_dn: 0,
        neto_luar: 0,
        ptkp: "TK/0",
        pkp: 0,
        terutang: 0,
      },
      kredit: { dipotong_pihak_lain: 0, pph25: 0 },
      kurang_bayar: 0,
    },
    l1: {
      harta: [],
      utang: [],
      keluarga: [],
      bukti_potong: [],
      penghasilan_lain: [],
    },
    l2: {},
  });

  const loadData = async () => {
    setIsLoading(true);
    const data = await getSptListAction();
    setDrafts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openDetail = async (item: any) => {
    setView("DETAIL");
    setSelectedSpt(item);
    setActiveDetailTab("INDUK");

    if (item.data_json && Object.keys(item.data_json).length > 0) {
      setFormData(item.data_json);
    } else {
      const res = await getSptDetailAction(item.masa, item.tahun);
      let listBupot: any[] = [];
      if (res.success && res.data?.listBuktiPotong) {
        listBupot = res.data.listBuktiPotong;
      }
      setFormData({
        induk: {
          tahun_pajak: item.tahun,
          status_spt: item.pembetulan > 0 ? "Pembetulan" : "Normal",
          pembukuan: "Pencatatan",
          identitas: { npwp: "", nama: "", hp: "", email: "", status_si: "KK" },
          penghasilan: {
            neto_dn: 0,
            neto_luar: 0,
            ptkp: "TK/0",
            pkp: 0,
            terutang: item.nominal || 0,
          },
          kredit: { dipotong_pihak_lain: 0, pph25: 0 },
          kurang_bayar: 0,
        },
        l1: {
          harta: [],
          utang: [],
          keluarga: [],
          bukti_potong: listBupot,
          penghasilan_lain: [],
        },
        l2: {},
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedSpt) return;
    setIsSaving(true);
    const res = await updateSptContentAction(selectedSpt.id, formData);
    setIsSaving(false);
    if (res.success) {
      toast.success("Draft berhasil disimpan");
      loadData();
    } else {
      toast.error("Gagal menyimpan");
    }
  };

  const onDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    const res = await deleteSptAction(deleteId);
    setDeleteId(null);
    if (res.success) {
      toast.success("Terhapus");
      loadData();
    } else {
      toast.error("Gagal menghapus");
    }
  };

  const filteredData = drafts.filter((d) => {
    if (activeTab === "KONSEP") return d.status === "Draft";
    if (activeTab === "MENUNGGU_BAYAR")
      return d.status === "Menunggu Pembayaran" || d.status === "Siap Lapor";
    if (activeTab === "DILAPORKAN") return d.status === "Lapor";
    if (activeTab === "DITOLAK") return d.status === "Ditolak";
    if (activeTab === "DIBATALKAN") return d.status === "Dibatalkan";
    return false;
  });

  // --- REVISI: HEADER STYLE MONOKROM ---
  const getHeaderStyle = () => {
    switch (activeTab) {
      case "KONSEP":
        return {
          color: "bg-slate-900 border-l-4 border-yellow-500",
          title: "Konsep SPT",
          icon: FileText,
        };
      case "MENUNGGU_BAYAR":
        return {
          color: "bg-slate-800 border-l-4 border-yellow-500",
          title: "SPT Menunggu Pembayaran",
          icon: Wallet,
        };
      case "DILAPORKAN":
        return {
          color: "bg-slate-900 border-l-4 border-yellow-500",
          title: "SPT Dilaporkan",
          icon: Send,
        };
      case "DITOLAK":
        return {
          color: "bg-slate-800 border-l-4 border-yellow-500",
          title: "SPT Ditolak",
          icon: XCircle,
        };
      case "DIBATALKAN":
        return {
          color: "bg-slate-900 border-l-4 border-yellow-500",
          title: "SPT Dibatalkan",
          icon: Ban,
        };
      default:
        return { color: "bg-slate-900", title: "SPT", icon: FileText };
    }
  };
  const header = getHeaderStyle();
  const HeaderIcon = header.icon;

  if (view === "DETAIL") {
    return (
      <div className="space-y-6 animate-in zoom-in-95 duration-200 pb-20">
        {/* Header Detail */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 py-4 px-6 -mx-6 shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("LIST")}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800 uppercase">
                SPT TAHUNAN {selectedSpt?.jenis}
              </h1>
              <div className="flex gap-2 text-xs">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">
                  DRAFT
                </span>
                <span className="text-slate-500 border-l pl-2 border-slate-300">
                  Masa: {selectedSpt?.masa} {selectedSpt?.tahun}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-md transition-colors"
            >
              <CreditCard size={16} /> Bayar
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Simpan
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-300">
          {[
            { id: "INDUK", label: "INDUK" },
            { id: "L1", label: "LAMPIRAN I (L-1)" },
            { id: "L2", label: "LAMPIRAN II (L-2)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDetailTab(tab.id as any)}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeDetailTab === tab.id
                  ? "border-slate-900 text-slate-900 bg-slate-50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm min-h-[600px] p-8">
          {activeDetailTab === "INDUK" && (
            <TabInduk formData={formData} setFormData={setFormData} />
          )}
          {activeDetailTab === "L1" && (
            <TabLampiran1 formData={formData} setFormData={setFormData} />
          )}
          {activeDetailTab === "L2" && (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-500">LAMPIRAN II (L-2)</h3>
              <p className="text-slate-400 text-sm">
                Tidak ada data yang perlu diisi pada bagian ini.
              </p>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Lanjutkan ke Pembayaran?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Anda akan diarahkan ke halaman <b>Billing</b> untuk membuat ID
                Billing dengan nominal{" "}
                <span className="font-bold text-slate-900">
                  Rp {selectedSpt?.nominal?.toLocaleString("id-ID") || 0}
                </span>
                .
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 py-2.5 text-slate-500 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => router.push("/dashboard/billing")}
                  className="flex-1 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 shadow-md"
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

  // --- LIST VIEW ---
  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[85vh] animate-in fade-in duration-500">
      {/* Sidebar */}
      <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-16 bg-slate-900 flex items-center px-4">
            <h2 className="text-white font-bold text-lg tracking-wide">
              SobatVTC
            </h2>
          </div>
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <div className="font-bold text-slate-800 text-sm">
              3276021102840016
            </div>
            <div className="text-xs text-slate-500 mt-1">
              NPWP: 09.254.294.3-404.000
            </div>
          </div>
          <nav className="flex flex-col p-2 space-y-1">
            {[
              { id: "KONSEP", label: "Konsep SPT" },
              { id: "MENUNGGU_BAYAR", label: "SPT Menunggu Pembayaran" },
              { id: "DILAPORKAN", label: "SPT Dilaporkan" },
              { id: "DITOLAK", label: "SPT Ditolak" },
              { id: "DIBATALKAN", label: "SPT Dibatalkan" },
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveTab(menu.id as any)}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === menu.id
                    ? "bg-slate-100 text-slate-900 font-bold border-l-4 border-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
                }`}
              >
                {menu.label}
              </button>
            ))}
          </nav>
        </div>
        <Link
          href="/dashboard/simulasi"
          className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-slate-500 hover:text-slate-800 bg-white border border-slate-300 rounded-lg transition-colors hover:shadow-sm"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div
          className={`rounded-xl p-6 flex justify-between items-center text-white shadow-lg transition-colors duration-300 ${header.color}`}
        >
          <div>
            <h1 className="text-2xl font-bold">{header.title}</h1>
            <p className="opacity-90 text-sm">Simulasi Data Coretax System</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <HeaderIcon size={32} />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari..."
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-sm w-64 focus:ring-2 focus:ring-slate-500 outline-none shadow-sm"
            />
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-slate-400"
            />
          </div>
          {activeTab === "KONSEP" && (
            <button
              onClick={() => setIsWizardOpen(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 active:scale-95 transition-all shadow-md"
            >
              <PlusCircle size={16} className="text-yellow-500" /> Buat SPT
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-20 text-center">AKSI</th>
                <th className="px-6 py-4">JENIS PAJAK</th>
                <th className="px-6 py-4">JENIS SURAT</th>
                <th className="px-6 py-4">PERIODE</th>
                <th className="px-6 py-4">NO. OBJEK</th>
                <th className="px-6 py-4">MODEL</th>
                <th className="px-6 py-4">TGL DIBUAT</th>
                <th className="px-6 py-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    Memuat Data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={40} className="text-slate-200" />
                      <p>
                        Belum ada data pada menu {header.title.toLowerCase()}.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 group transition-colors"
                  >
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {activeTab === "KONSEP" ? (
                          <>
                            <button
                              onClick={() => openDetail(item)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                              title="Edit Draft"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => onDeleteClick(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                              title="Hapus Draft"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <button className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold hover:bg-slate-200 transition-colors mx-auto">
                            <Eye size={14} /> LIHAT
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {item.jenis}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      SPT Tahunan {item.jenis}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.tahun} {item.masa} - Desember
                    </td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center">
                      {item.pembetulan === 0
                        ? "NORMAL"
                        : `PEMBETULAN-${item.pembetulan}`}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {item.tanggal}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${item.status === "Draft" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateSptWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={loadData}
      />

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

// =================================================================
// TAB INDUK - Full Calculation Logic (A-K)
// =================================================================
function TabInduk({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  const updateInduk = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      induk: {
        ...prev.induk,
        [section]:
          section === "root"
            ? { ...prev.induk, [field]: value }
            : { ...prev.induk[section], [field]: value },
      },
    }));
  };

  const updateRoot = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      induk: { ...prev.induk, [field]: value },
    }));
  };

  // Auto Calculation
  useEffect(() => {
    const neto = parseRupiah(formData.induk.penghasilan.neto_dn);
    const ptkpCode = formData.induk.penghasilan.ptkp;

    let nilaiPtkp = 54000000;
    const ptkpMap: any = {
      "TK/0": 54000000,
      "TK/1": 58500000,
      "TK/2": 63000000,
      "TK/3": 67500000,
      "K/0": 58500000,
      "K/1": 63000000,
      "K/2": 67500000,
      "K/3": 72000000,
      "KI/0": 112500000,
      "KI/1": 117000000,
      "KI/2": 121500000,
      "KI/3": 126000000,
    };
    if (ptkpMap[ptkpCode]) nilaiPtkp = ptkpMap[ptkpCode];

    let pkp = neto - nilaiPtkp;
    if (pkp < 0) pkp = 0;
    pkp = Math.floor(pkp / 1000) * 1000;

    const terutang = hitungPPhTerutang(pkp);
    const kredit = parseRupiah(formData.induk.kredit.pph25 || 0);
    const kurangBayar = terutang - kredit;

    if (
      formData.induk.penghasilan.pkp !== pkp ||
      formData.induk.penghasilan.terutang !== terutang ||
      formData.induk.kurang_bayar !== kurangBayar
    ) {
      setFormData((prev: any) => ({
        ...prev,
        induk: {
          ...prev.induk,
          penghasilan: { ...prev.induk.penghasilan, pkp, terutang },
          kurang_bayar: kurangBayar,
        },
      }));
    }
  }, [
    formData.induk.penghasilan.neto_dn,
    formData.induk.penghasilan.ptkp,
    formData.induk.kredit.pph25,
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-sm text-slate-700">
      <Section title="HEADER">
        <div className="grid grid-cols-2 gap-6">
          <InputGroup
            label="Tahun Pajak"
            value={formData.induk.tahun_pajak || ""}
            onChange={(e: any) => updateRoot("tahun_pajak", e.target.value)}
          />
          <InputGroup label="Status" value="Normal" readOnly />
        </div>
        <div className="mt-4">
          <label className="font-bold block mb-2 text-xs uppercase text-slate-500">
            Metode Pembukuan / Pencatatan
          </label>
          <div className="flex gap-6">
            <Radio
              label="Pencatatan"
              name="pembukuan"
              checked={formData.induk.pembukuan === "Pencatatan"}
              onChange={() => updateRoot("pembukuan", "Pencatatan")}
            />
            <Radio
              label="Pembukuan Stelsel Akrual"
              name="pembukuan"
              checked={formData.induk.pembukuan === "Akrual"}
              onChange={() => updateRoot("pembukuan", "Akrual")}
            />
            <Radio
              label="Pembukuan Stelsel Kas"
              name="pembukuan"
              checked={formData.induk.pembukuan === "Kas"}
              onChange={() => updateRoot("pembukuan", "Kas")}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="font-bold block mb-2 text-xs uppercase text-slate-500">
            Sumber Penghasilan
          </label>
          <div className="flex gap-6">
            <Checkbox label="Pekerjaan" checked={true} onChange={() => {}} />
            <Checkbox
              label="Kegiatan Usaha"
              checked={false}
              onChange={() => {}}
            />
            <Checkbox
              label="Pekerjaan Bebas"
              checked={false}
              onChange={() => {}}
            />
          </div>
        </div>
      </Section>

      <Section title="A. IDENTITAS WAJIB PAJAK">
        <div className="grid grid-cols-2 gap-4">
          <InputGroup
            label="NPWP/NIK"
            value={formData.induk.identitas.npwp}
            onChange={(e: any) =>
              updateInduk("identitas", "npwp", e.target.value)
            }
            placeholder="Isi NPWP/NIK"
          />
          <InputGroup
            label="Nama"
            value={formData.induk.identitas.nama}
            onChange={(e: any) =>
              updateInduk("identitas", "nama", e.target.value)
            }
            placeholder="Nama Wajib Pajak"
          />
          <InputGroup label="Jenis ID" value="KTP" readOnly />
          <InputGroup
            label="No. Telepon"
            value={formData.induk.identitas.hp}
            onChange={(e: any) =>
              updateInduk("identitas", "hp", e.target.value)
            }
            placeholder="08xxx"
          />
          <InputGroup
            label="Email"
            value={formData.induk.identitas.email}
            onChange={(e: any) =>
              updateInduk("identitas", "email", e.target.value)
            }
            placeholder="email@contoh.com"
          />
        </div>
        <div className="mt-4">
          <label className="font-bold block mb-2 text-xs uppercase text-slate-500">
            Status Suami/Istri
          </label>
          <div className="flex gap-4 flex-wrap">
            <Radio
              label="KK - Kepala Keluarga"
              name="status_si"
              checked={formData.induk.identitas.status_si === "KK"}
              onChange={() => updateInduk("identitas", "status_si", "KK")}
            />
            <Radio
              label="PH - Pisah Harta"
              name="status_si"
              checked={formData.induk.identitas.status_si === "PH"}
              onChange={() => updateInduk("identitas", "status_si", "PH")}
            />
            <Radio
              label="MT - Memilih Terpisah"
              name="status_si"
              checked={formData.induk.identitas.status_si === "MT"}
              onChange={() => updateInduk("identitas", "status_si", "MT")}
            />
          </div>
        </div>
      </Section>

      <Section title="B. IKHTISAR PENGHASILAN NETO">
        <div className="p-4 bg-slate-50 rounded border border-slate-200 text-center text-slate-500 italic">
          Bagian ini terisi otomatis dari Lampiran I & II
        </div>
      </Section>

      <Section title="C. PERHITUNGAN PAJAK TERUTANG">
        <InputCurrency
          label="2. Penghasilan neto setahun"
          value={formData.induk.penghasilan.neto_dn}
          onChange={(val: any) => updateInduk("penghasilan", "neto_dn", val)}
        />
        <YesNoQuestion
          label="3. Apakah terdapat pengurang penghasilan neto (Kompensasi/Zakat)?"
          note="Tidak, lanjutkan ke pertanyaan berikutnya"
        />
        <InputCurrency
          label="4. Penghasilan neto setelah pengurang (2-3)"
          value={formData.induk.penghasilan.neto_dn}
          readOnly
          className="bg-slate-50 text-slate-500"
        />
        <div className="mt-4">
          <label className="font-bold block mb-1 text-slate-700">5. PTKP</label>
          <select
            className="w-full border border-slate-300 rounded p-2 bg-white"
            value={formData.induk.penghasilan.ptkp}
            onChange={(e) => updateInduk("penghasilan", "ptkp", e.target.value)}
          >
            <option value="TK/0">TK/0 - Rp 54.000.000</option>
            <option value="TK/1">TK/1 - Rp 58.500.000</option>
            <option value="K/0">K/0 - Rp 58.500.000</option>
            <option value="K/1">K/1 - Rp 63.000.000</option>
            <option value="K/2">K/2 - Rp 67.500.000</option>
            <option value="K/3">K/3 - Rp 72.000.000</option>
            <option value="KI/0">KI/0 - Rp 112.500.000</option>
            <option value="KI/1">KI/1 - Rp 117.000.000</option>
            <option value="KI/2">KI/2 - Rp 121.500.000</option>
            <option value="KI/3">KI/3 - Rp 126.000.000</option>
          </select>
        </div>
        <InputCurrency
          label="6. Penghasilan Kena Pajak (4-5)"
          value={formData.induk.penghasilan.pkp}
          readOnly
          className="bg-slate-50 font-bold"
        />
        <InputCurrency
          label="7. PPh terutang"
          value={formData.induk.penghasilan.terutang}
          readOnly
          className="bg-slate-100 font-bold text-slate-800 border-l-4 border-slate-800"
        />
        <YesNoQuestion
          label="8. Apakah terdapat Pengurang PPh terutang?"
          note="Tidak, lanjut"
        />
        <InputCurrency
          label="9. PPh terutang setelah pengurang (7-8)"
          value={formData.induk.penghasilan.terutang}
          readOnly
          className="bg-slate-50 text-slate-500"
        />
      </Section>

      <Section title="D. KREDIT PAJAK">
        <YesNoQuestion
          label="10a. PPh yang dipotong/dipungut pihak lain?"
          defaultYes
        />
        <InputCurrency
          label="10b. Angsuran PPh Pasal 25"
          value={formData.induk.kredit.pph25}
          onChange={(val: any) => updateInduk("kredit", "pph25", val)}
        />
        <InputCurrency
          label="10c. STP PPh Pasal 25 (Pokok)"
          value={0}
          onChange={() => {}}
        />
        <YesNoQuestion label="10d. Pengembalian/pengurangan kredit PPh luar negeri?" />
      </Section>

      <Section title="E. PPh KURANG/LEBIH BAYAR">
        <InputCurrency
          label="11a. PPh Kurang/Lebih Bayar (9 - 10)"
          value={formData.induk.kurang_bayar}
          readOnly
          className={`font-bold ${formData.induk.kurang_bayar > 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
        />
        <YesNoQuestion label="11b. Angsuran/Penundaan Bayar?" />
        <InputCurrency
          label="11c. PPh yang masih harus dibayar"
          value={
            formData.induk.kurang_bayar > 0 ? formData.induk.kurang_bayar : 0
          }
          readOnly
        />
      </Section>

      <Section title="F. PEMBETULAN">
        <div className="bg-slate-50 p-4 text-center text-slate-500 italic">
          Bagian ini terkunci karena Status SPT adalah Normal.
        </div>
      </Section>
      <Section title="G. PERMOHONAN PENGEMBALIAN">
        <p className="mb-2 font-medium">
          PPh lebih bayar pada 11a atau 12b mohon:
        </p>
        <div className="space-y-2">
          <Radio
            label="Dikembalikan (Restitusi)"
            name="restitusi"
            checked={false}
            onChange={() => {}}
          />
          <Radio
            label="Diperhitungkan dengan Utang Pajak"
            name="restitusi"
            checked={false}
            onChange={() => {}}
          />
        </div>
      </Section>
      <Section title="H. ANGSURAN PPh PASAL 25 TAHUN BERIKUTNYA">
        <YesNoQuestion label="13a. Apakah Anda hanya menerima penghasilan teratur?" />
        <YesNoQuestion label="13b. Apakah Anda menyusun perhitungan tersendiri?" />
        <YesNoQuestion label="13c. Apakah Anda membayar angsuran OPPT?" />
      </Section>
      <Section title="I. PERNYATAAN TRANSAKSI LAINNYA">
        <InputCurrency
          label="14a. Harta pada akhir Tahun Pajak"
          value={0}
          onChange={() => {}}
        />
        <YesNoQuestion label="14b. Apakah Anda memiliki utang pada akhir tahun pajak?" />
        <YesNoQuestion label="14c. Apakah Anda menerima penghasilan final?" />
        <YesNoQuestion label="14d. Apakah Anda menerima penghasilan bukan objek pajak?" />
        <YesNoQuestion label="14e. Apakah Anda melaporkan biaya penyusutan?" />
      </Section>

      <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
        <h3 className="font-bold text-slate-800 mb-2">K. PERNYATAAN</h3>
        <p className="mb-4 text-justify leading-relaxed text-slate-600">
          Dengan menyadari sepenuhnya akan segala akibatnya... saya menyatakan
          bahwa apa yang telah saya beritahukan di atas beserta
          lampiran-lampirannya adalah{" "}
          <span className="font-bold"> benar, lengkap dan jelas.</span>
        </p>
        <div className="flex items-center gap-4 mt-4 border-t border-slate-200 pt-4">
          <label className="font-bold text-slate-800">Penandatangan *</label>
          <div className="flex gap-4">
            <Radio
              label="Wajib Pajak"
              name="signer"
              checked={true}
              onChange={() => {}}
            />
            <Radio
              label="Kuasa"
              name="signer"
              checked={false}
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// TAB LAMPIRAN I - Modal & Auto Format
// =================================================================
function TabLampiran1({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>({});

  const totalHarta =
    formData.l1.harta?.reduce(
      (acc: number, item: any) => acc + (parseInt(item.harga) || 0),
      0,
    ) || 0;

  const handleDeleteItem = (category: string, index: number) => {
    if (!confirm("Hapus data ini?")) return;
    const newData = [...formData.l1[category]];
    newData.splice(index, 1);
    setFormData({ ...formData, l1: { ...formData.l1, [category]: newData } });
  };

  const openModal = (type: string) => {
    setModalType(type);
    setModalData({});
  };

  const handleSaveModal = () => {
    let category = "";
    if (modalType === "HARTA") category = "harta";
    if (modalType === "UTANG") category = "utang";
    if (modalType === "KELUARGA") category = "keluarga";
    if (modalType === "PENGHASILAN") {
      category = "penghasilan_lain";
      const bruto = parseInt(modalData.bruto) || 0;
      const pengurang = parseInt(modalData.pengurang) || 0;
      modalData.neto = bruto - pengurang;
    }
    if (modalType === "BUKTI_POTONG") category = "bukti_potong";

    if (category) {
      const currentList = formData.l1[category] || [];
      setFormData({
        ...formData,
        l1: { ...formData.l1, [category]: [...currentList, modalData] },
      });
    }
    setModalType(null);
    toast.success("Data berhasil ditambahkan");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-sm text-slate-700">
      <div className="bg-slate-100 p-4 rounded mb-6 border border-slate-200">
        <h2 className="font-bold text-lg text-slate-800">HEADER LAMPIRAN I</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <InputGroup
            label="Tahun Pajak"
            value={formData.induk.tahun_pajak}
            readOnly
          />
          <InputGroup label="NPWP/NIK" placeholder="Sesuai Induk" readOnly />
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold text-slate-700 text-xs uppercase">
            A. HARTA PADA AKHIR TAHUN PAJAK
          </span>
          <button
            onClick={() => openModal("HARTA")}
            className="flex items-center gap-1 text-xs bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-slate-500 text-xs uppercase border-b border-slate-200">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Kode</th>
              <th className="px-4 py-3">Nama Aset</th>
              <th className="px-4 py-3">Tahun</th>
              <th className="px-4 py-3 text-right">Nilai (Rp)</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {formData.l1.harta?.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-400 italic bg-slate-50/50"
                >
                  Belum ada data
                </td>
              </tr>
            ) : (
              formData.l1.harta.map((item: any, i: number) => (
                <tr
                  key={i}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 font-mono text-xs">{item.kode}</td>
                  <td className="px-4 py-2 font-bold">{item.nama}</td>
                  <td className="px-4 py-2">{item.tahun}</td>
                  <td className="px-4 py-2 text-right">
                    Rp {formatRupiah(item.harga)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteItem("harta", i)}
                      className="text-slate-400 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex justify-between items-center shadow-sm">
        <div>
          <span className="font-bold text-slate-700 block">
            7. IKHTISAR HARTA
          </span>
          <span className="text-xs text-slate-400 uppercase">DESKRIPSI</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase">
            TOTAL NILAI SAAT INI
          </div>
          <div className="font-bold text-slate-900 text-lg">
            Rp {formatRupiah(totalHarta)}
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold text-slate-700 text-xs uppercase">
            B. UTANG PADA AKHIR TAHUN PAJAK
          </span>
          <button
            onClick={() => openModal("UTANG")}
            className="flex items-center gap-1 text-xs bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-slate-500 text-xs uppercase border-b border-slate-200">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Kode</th>
              <th className="px-4 py-3">Pemberi Pinjaman</th>
              <th className="px-4 py-3">Tahun</th>
              <th className="px-4 py-3 text-right">Saldo (Rp)</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {formData.l1.utang?.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-400 italic bg-slate-50/50"
                >
                  Belum ada data
                </td>
              </tr>
            ) : (
              formData.l1.utang.map((item: any, i: number) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 font-mono text-xs">{item.kode}</td>
                  <td className="px-4 py-2">{item.pemberi}</td>
                  <td className="px-4 py-2">{item.tahun}</td>
                  <td className="px-4 py-2 text-right">
                    Rp {formatRupiah(item.jumlah)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteItem("utang", i)}
                      className="text-slate-400 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold text-slate-700 text-xs uppercase">
            C. DAFTAR ANGGOTA KELUARGA
          </span>
          <button
            onClick={() => openModal("KELUARGA")}
            className="flex items-center gap-1 text-xs bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-slate-500 text-xs uppercase border-b border-slate-200">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">NIK</th>
              <th className="px-4 py-3">Hubungan</th>
              <th className="px-4 py-3">Pekerjaan</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {formData.l1.keluarga?.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-400 italic bg-slate-50/50"
                >
                  Belum ada data
                </td>
              </tr>
            ) : (
              formData.l1.keluarga.map((item: any, i: number) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{item.nama}</td>
                  <td className="px-4 py-2">{item.nik}</td>
                  <td className="px-4 py-2">{item.hubungan}</td>
                  <td className="px-4 py-2">{item.pekerjaan}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteItem("keluarga", i)}
                      className="text-slate-400 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold text-slate-700 text-xs uppercase">
            D. PENGHASILAN NETO DALAM NEGERI DARI PEKERJAAN
          </span>
          <button
            onClick={() => openModal("PENGHASILAN")}
            className="flex items-center gap-1 text-xs bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-slate-500 text-xs uppercase border-b border-slate-200">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Pemberi Kerja</th>
              <th className="px-4 py-3 text-right">Bruto (Rp)</th>
              <th className="px-4 py-3 text-right">Pengurang (Rp)</th>
              <th className="px-4 py-3 text-right">Neto (Rp)</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {formData.l1.penghasilan_lain?.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-400 italic bg-slate-50/50"
                >
                  Belum ada data
                </td>
              </tr>
            ) : (
              formData.l1.penghasilan_lain.map((item: any, i: number) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{item.pemberi}</td>
                  <td className="px-4 py-2 text-right">
                    {formatRupiah(item.bruto)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatRupiah(item.pengurang)}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-slate-800">
                    {formatRupiah(item.neto)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteItem("penghasilan_lain", i)}
                      className="text-slate-400 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold text-slate-700 text-xs uppercase">
            E. DAFTAR BUKTI PEMOTONGAN / PEMUNGUTAN PPh
          </span>
          <button
            onClick={() => openModal("BUKTI_POTONG")}
            className="flex items-center gap-1 text-xs bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-slate-500 text-xs uppercase border-b border-slate-200">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Pemotong</th>
              <th className="px-4 py-3">Jenis Pajak</th>
              <th className="px-4 py-3 text-right">DPP (Rp)</th>
              <th className="px-4 py-3 text-right">PPh Dipotong (Rp)</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {formData.l1.bukti_potong?.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-400 italic bg-slate-50/50"
                >
                  Belum ada data
                </td>
              </tr>
            ) : (
              formData.l1.bukti_potong.map((item: any, i: number) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{item.pemotong}</td>
                  <td className="px-4 py-2">{item.jenis}</td>
                  <td className="px-4 py-2 text-right">
                    {formatRupiah(item.dpp)}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-slate-800">
                    {formatRupiah(item.pph)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteItem("bukti_potong", i)}
                      className="text-slate-400 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold">Tambah Data {modalType}</h3>
              <button
                onClick={() => setModalType(null)}
                className="hover:text-slate-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* FORM HARTA */}
              {modalType === "HARTA" && (
                <>
                  <InputGroup
                    label="Kode Harta"
                    value={modalData.kode}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, kode: e.target.value })
                    }
                    placeholder="Contoh: 061 (Emas)"
                  />
                  <InputGroup
                    label="Nama Aset"
                    value={modalData.nama}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, nama: e.target.value })
                    }
                    placeholder="Misal: Emas Perhiasan"
                  />
                  <InputGroup
                    label="Tahun Perolehan"
                    type="number"
                    value={modalData.tahun}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, tahun: e.target.value })
                    }
                  />
                  <InputCurrency
                    label="Nilai Perolehan"
                    value={modalData.harga}
                    onChange={(val: any) =>
                      setModalData({ ...modalData, harga: val })
                    }
                  />
                </>
              )}

              {/* FORM UTANG */}
              {modalType === "UTANG" && (
                <>
                  <InputGroup
                    label="Kode Utang"
                    value={modalData.kode}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, kode: e.target.value })
                    }
                    placeholder="Contoh: 101"
                  />
                  <InputGroup
                    label="Nama Pemberi Pinjaman"
                    value={modalData.pemberi}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, pemberi: e.target.value })
                    }
                  />
                  <InputGroup
                    label="Tahun Peminjaman"
                    type="number"
                    value={modalData.tahun}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, tahun: e.target.value })
                    }
                  />
                  <InputCurrency
                    label="Saldo Utang (Akhir Tahun)"
                    value={modalData.jumlah}
                    onChange={(val: any) =>
                      setModalData({ ...modalData, jumlah: val })
                    }
                  />
                </>
              )}

              {/* FORM KELUARGA */}
              {modalType === "KELUARGA" && (
                <>
                  <InputGroup
                    label="Nama Anggota Keluarga"
                    value={modalData.nama}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, nama: e.target.value })
                    }
                  />
                  <InputGroup
                    label="NIK"
                    value={modalData.nik}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, nik: e.target.value })
                    }
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Hubungan Keluarga
                    </label>
                    <select
                      className="w-full border border-slate-300 rounded p-2"
                      onChange={(e) =>
                        setModalData({ ...modalData, hubungan: e.target.value })
                      }
                    >
                      <option value="">- Pilih -</option>
                      <option value="Istri">Istri</option>
                      <option value="Suami">Suami</option>
                      <option value="Anak">Anak</option>
                    </select>
                  </div>
                  <InputGroup
                    label="Pekerjaan"
                    value={modalData.pekerjaan}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, pekerjaan: e.target.value })
                    }
                  />
                </>
              )}

              {/* FORM PENGHASILAN */}
              {modalType === "PENGHASILAN" && (
                <>
                  <InputGroup
                    label="Nama Pemberi Kerja"
                    value={modalData.pemberi}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, pemberi: e.target.value })
                    }
                  />
                  <InputCurrency
                    label="Penghasilan Bruto"
                    value={modalData.bruto}
                    onChange={(val: any) =>
                      setModalData({ ...modalData, bruto: val })
                    }
                  />
                  <InputCurrency
                    label="Pengurang"
                    value={modalData.pengurang}
                    onChange={(val: any) =>
                      setModalData({ ...modalData, pengurang: val })
                    }
                  />
                  <div className="bg-slate-100 p-3 rounded text-center">
                    <span className="text-xs text-slate-500 block">
                      Neto (Otomatis)
                    </span>
                    <span className="font-bold text-lg text-slate-800">
                      Rp{" "}
                      {formatRupiah(
                        parseInt(modalData.bruto || 0) -
                          parseInt(modalData.pengurang || 0),
                      )}
                    </span>
                  </div>
                </>
              )}

              {/* FORM BUKTI POTONG */}
              {modalType === "BUKTI_POTONG" && (
                <>
                  <InputGroup
                    label="Nama Pemotong/Pemungut"
                    value={modalData.pemotong}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, pemotong: e.target.value })
                    }
                  />
                  <InputGroup
                    label="Jenis Pajak"
                    value={modalData.jenis}
                    onChange={(e: any) =>
                      setModalData({ ...modalData, jenis: e.target.value })
                    }
                    placeholder="Misal: PPh 21"
                  />
                  <InputCurrency
                    label="DPP (Dasar Pengenaan Pajak)"
                    value={modalData.dpp}
                    onChange={(val: any) =>
                      setModalData({ ...modalData, dpp: val })
                    }
                  />
                  <InputCurrency
                    label="PPh yang Dipotong"
                    value={modalData.pph}
                    onChange={(val: any) =>
                      setModalData({ ...modalData, pph: val })
                    }
                  />
                </>
              )}

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2 border rounded hover:bg-slate-50 font-bold text-slate-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveModal}
                  className="flex-1 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 font-bold shadow-md"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// REUSABLE COMPONENTS
// =================================================================

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2">
        <span className="bg-slate-900 w-1 h-4 rounded-full"></span>
        {title}
      </div>
      <div className="p-6 bg-white">{children}</div>
    </div>
  );
}

function InputGroup({ label, ...props }: any) {
  return (
    <div>
      <label className="block font-bold mb-1 text-slate-500 text-xs uppercase tracking-wide">
        {label}
      </label>
      <input
        className="w-full border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-slate-500 outline-none transition-shadow text-slate-800 bg-white"
        {...props}
      />
    </div>
  );
}

function InputCurrency({
  label,
  value,
  onChange,
  className = "",
  readOnly = false,
}: any) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(formatRupiah(value || 0));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    const numVal = parseInt(rawVal || "0", 10);
    setDisplayValue(formatRupiah(rawVal));
    if (onChange) onChange(numVal);
  };

  return (
    <div className="mt-3">
      <label className="block font-medium mb-1 text-slate-700">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-2 text-slate-400 font-mono">
          Rp
        </span>
        <input
          type="text"
          readOnly={readOnly}
          className={`w-full border border-slate-300 rounded pl-10 pr-3 py-2 text-right font-mono text-slate-800 focus:ring-2 focus:ring-slate-500 outline-none ${className} ${readOnly ? "bg-slate-100 cursor-not-allowed" : "bg-white"}`}
          value={displayValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

function Radio({ label, name, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="radio"
        name={name}
        className="w-4 h-4 text-slate-900 focus:ring-slate-500"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-slate-700 group-hover:text-slate-900">{label}</span>
    </label>
  );
}

function Checkbox({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        className="w-4 h-4 text-slate-900 rounded focus:ring-slate-500"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-slate-700 group-hover:text-slate-900">{label}</span>
    </label>
  );
}

function YesNoQuestion({ label, note, defaultYes = false }: any) {
  const [val, setVal] = useState(defaultYes ? "Ya" : "Tidak");
  return (
    <div className="mb-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <p className="mb-2 font-medium text-slate-800">{label}</p>
      <div className="flex gap-6">
        <Radio
          label="Ya"
          name={label}
          checked={val === "Ya"}
          onChange={() => setVal("Ya")}
        />
        <Radio
          label="Tidak"
          name={label}
          checked={val === "Tidak"}
          onChange={() => setVal("Tidak")}
        />
      </div>
      {note && <p className="text-xs text-slate-400 mt-1 italic">{note}</p>}
    </div>
  );
}
