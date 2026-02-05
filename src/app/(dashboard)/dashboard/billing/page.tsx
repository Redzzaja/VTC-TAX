"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeftRight,
  QrCode,
  Receipt,
  Hourglass,
  Banknote,
  Percent,
  Droplets,
  History,
  X,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import {
  createBillingAction,
  getBillingListAction,
} from "@/actions/billing-action";
import { toast } from "sonner";
import Link from "next/link";

// --- DATA MENU (PROFESIONAL MONOKROM) ---
const billingServices = [
  {
    code: "PBK",
    title: "Permohonan Pbk",
    desc: "Permohonan Pemindahbukuan Setoran",
    icon: ArrowLeftRight,
    action: "pbk",
  },
  {
    code: "Billing",
    title: "Kode Billing Mandiri",
    desc: "Layanan Mandiri Pembuatan Kode Billing",
    icon: QrCode,
    action: "create",
  },
  {
    code: "Tagihan",
    title: "Billing Tagihan",
    desc: "Pembuatan Kode Billing atas Tagihan Pajak",
    icon: Receipt,
    action: "tagihan",
  },
  {
    code: "Unpaid",
    title: "Billing Belum Bayar",
    desc: "Daftar Kode Billing Belum Dibayar",
    icon: Hourglass,
    action: "list",
  },
  {
    code: "Restitusi",
    title: "Restitusi Pajak",
    desc: "Formulir Pengajuan Pengembalian Pajak",
    icon: Banknote,
    action: "restitusi",
  },
  {
    code: "Bunga",
    title: "Imbalan Bunga",
    desc: "Permohonan Pemberian Imbalan Bunga",
    icon: Percent,
    action: "bunga",
  },
  {
    code: "DTP",
    title: "PPh DTP PDAM",
    desc: "Permohonan PPh DTP atas Penghasilan PDAM",
    icon: Droplets,
    action: "pdam",
  },
  {
    code: "History",
    title: "Riwayat Pembayaran",
    desc: "Log dan Arsip Bukti Penerimaan Negara",
    icon: History,
    action: "history",
  },
];

function BillingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);

  const [activeView, setActiveView] = useState("menu");
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

  useEffect(() => {
    if (isInitialized.current) return;
    const action = searchParams.get("action");
    if (action === "create") {
      setActiveView("create");
      const paramNominal = searchParams.get("nominal");
      if (paramNominal) {
        setFormData((prev) => ({
          ...prev,
          kap: searchParams.get("kap") || "411121",
          kjs: searchParams.get("kjs") || "100",
          masa: searchParams.get("masa") || "Januari",
          tahun: searchParams.get("tahun") || "2025",
          nominal: paramNominal || "",
          uraian: "Pembayaran SPT Masa via Integrasi",
        }));
        toast.info("Data Billing otomatis diisi dari SPT");
        window.history.replaceState({}, "", window.location.pathname);
      }
      isInitialized.current = true;
    } else if (action === "list") {
      handleOpenList();
      window.history.replaceState({}, "", window.location.pathname);
      isInitialized.current = true;
    }
  }, [searchParams]);

  const handleOpenList = async () => {
    setIsLoading(true);
    setActiveView("list");
    const res = await getBillingListAction();
    setData(res);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createBillingAction(formData);
    setIsLoading(false);

    if (res.success) {
      toast.success("Kode Billing Berhasil Dibuat!", {
        description: `ID Billing: ${res.id_billing}`,
        duration: 5000,
      });
      setActiveView("list");
      handleOpenList();
    } else {
      toast.error("Gagal Membuat Billing", { description: res.message });
    }
  };

  // --- TAMPILAN 1: MENU UTAMA ---
  if (activeView === "menu") {
    return (
      <div className="space-y-8 animate-in fade-in">
        {/* Tombol Kembali */}
        <div>
          <Link
            href="/dashboard/simulasi"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm mb-2"
          >
            <ArrowLeft size={18} /> Kembali ke Menu Simulasi
          </Link>
        </div>

        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            PAYMENT SERVICE
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Layanan Pembayaran dan Administrasi Perpajakan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {billingServices.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between h-full hover:border-slate-300"
                onClick={() => {
                  if (item.action === "create") {
                    setActiveView("create");
                  } else if (
                    item.action === "list" ||
                    item.action === "history"
                  ) {
                    handleOpenList();
                  } else {
                    toast.info(`Menu ${item.title} segera hadir...`);
                  }
                }}
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-slate-50 border border-slate-100 group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300 shadow-sm">
                    <IconComponent
                      size={28}
                      className="text-slate-600 group-hover:text-yellow-500 transition-colors duration-300"
                    />
                  </div>

                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    PAYMENT SERVICE
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 text-lg leading-tight group-hover:text-slate-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 group-hover:border-slate-300 group-hover:text-slate-800">
                  AKSES LAYANAN <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: FORM CREATE (MODAL STYLE) ---
  if (activeView === "create") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
          <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white border-b border-slate-800">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <QrCode size={20} className="text-yellow-500" /> Kode Billing
              Mandiri
            </h2>
            <button
              onClick={() => setActiveView("menu")}
              className="hover:text-slate-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    Identitas Penyetor
                  </label>
                  <div className="flex gap-4">
                    <input
                      required
                      type="text"
                      placeholder="NPWP"
                      className="w-1/3 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
                      value={formData.npwp}
                      onChange={(e) =>
                        setFormData({ ...formData, npwp: e.target.value })
                      }
                    />
                    <input
                      required
                      type="text"
                      placeholder="Nama Lengkap"
                      className="w-2/3 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    Jenis Pajak (KAP)
                  </label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500 bg-white"
                    value={formData.kap}
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
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    Jenis Setoran (KJS)
                  </label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500 bg-white"
                    value={formData.kjs}
                    onChange={(e) =>
                      setFormData({ ...formData, kjs: e.target.value })
                    }
                  >
                    <option value="100">100 - Masa</option>
                    <option value="200">200 - Tahunan</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    Nominal Setor (Rp)
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-500"
                    value={formData.nominal}
                    onChange={(e) =>
                      setFormData({ ...formData, nominal: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveView("menu")}
                  className="flex-1 py-3 text-slate-500 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 shadow-md transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    "MEMPROSES..."
                  ) : (
                    <>
                      <CreditCard size={18} /> BUAT KODE BILLING
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 3: LIST (Billing Belum Bayar) ---
  if (activeView === "list") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Banknote className="text-slate-600" /> Daftar Kode Billing
          </h2>
          <button
            onClick={() => setActiveView("menu")}
            className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <ArrowRight className="rotate-180" size={16} /> Kembali ke Menu
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ID Billing</th>
                <th className="px-6 py-4">KAP/KJS</th>
                <th className="px-6 py-4">Masa</th>
                <th className="px-6 py-4 text-right">Nominal</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada data tagihan.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() =>
                      toast.info(`Detail Billing ${item.id_billing}`)
                    }
                  >
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      {item.id_billing}
                    </td>
                    <td className="px-6 py-4">{item.kode_jenis}</td>
                    <td className="px-6 py-4">{item.masa_tahun}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      Rp {item.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded font-bold border border-orange-200">
                        BELUM BAYAR
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

export default function BillingMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">
          Memuat Billing Service...
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}
