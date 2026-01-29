"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeftRight, // PBK
  QrCode, // Billing Mandiri
  Receipt, // Tagihan
  Hourglass, // Belum Bayar
  Banknote, // Restitusi
  Percent, // Bunga
  Droplets, // PDAM (Air)
  History, // Riwayat
  X,
  CreditCard,
} from "lucide-react";
import {
  createBillingAction,
  getBillingListAction,
} from "@/actions/billing-action";
import { toast } from "sonner";

// --- DATA MENU DENGAN WARNA KONTRAS (SAFE MODE) ---
// Menggunakan bg-*-50 untuk background dan text-*-600 untuk icon agar pasti kontras
const billingServices = [
  {
    code: "PBK",
    title: "Permohonan Pbk",
    desc: "Permohonan Pemindahbukuan Setoran",
    icon: ArrowLeftRight,
    style: "bg-blue-50 text-blue-600 border-blue-200",
    action: "pbk",
  },
  {
    code: "Billing",
    title: "Kode Billing Mandiri",
    desc: "Layanan Mandiri Pembuatan Kode Billing",
    icon: QrCode,
    style: "bg-emerald-50 text-emerald-600 border-emerald-200",
    action: "create",
  },
  {
    code: "Tagihan",
    title: "Billing Tagihan",
    desc: "Pembuatan Kode Billing atas Tagihan Pajak",
    icon: Receipt,
    style: "bg-indigo-50 text-indigo-600 border-indigo-200",
    action: "tagihan",
  },
  {
    code: "Unpaid",
    title: "Billing Belum Bayar",
    desc: "Daftar Kode Billing Belum Dibayar",
    icon: Hourglass,
    style: "bg-orange-50 text-orange-600 border-orange-200",
    action: "list",
  },
  {
    code: "Restitusi",
    title: "Restitusi Pajak",
    desc: "Formulir Pengajuan Pengembalian Pajak",
    icon: Banknote,
    style: "bg-purple-50 text-purple-600 border-purple-200",
    action: "restitusi",
  },
  {
    code: "Bunga",
    title: "Imbalan Bunga",
    desc: "Permohonan Pemberian Imbalan Bunga",
    icon: Percent,
    style: "bg-pink-50 text-pink-600 border-pink-200",
    action: "bunga",
  },
  {
    code: "DTP",
    title: "PPh DTP PDAM",
    desc: "Permohonan PPh DTP atas Penghasilan PDAM",
    icon: Droplets,
    style: "bg-cyan-50 text-cyan-600 border-cyan-200",
    action: "pdam",
  },
  {
    code: "History",
    title: "Riwayat Pembayaran",
    desc: "Log dan Arsip Bukti Penerimaan Negara",
    icon: History,
    style: "bg-slate-100 text-slate-600 border-slate-200",
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
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            PAYMENT SERVICE
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Layanan Pembayaran dan Administrasi Perpajakan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {billingServices.map((item, index) => {
            // Render Icon sebagai Component untuk memastikan muncul
            const IconComponent = item.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col justify-between cursor-pointer h-full"
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
                  {/* ICON CONTAINER: Warna Background Terang, Icon Gelap */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 border ${item.style}`}
                  >
                    <IconComponent size={28} />
                  </div>

                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    PAYMENT SERVICE
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group-hover:border-blue-200 group-hover:text-blue-600">
                  AKSES LAYANAN <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: FORM CREATE ---
  if (activeView === "create") {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <QrCode size={20} /> Kode Billing Mandiri
          </h2>
          <button
            onClick={() => setActiveView("menu")}
            className="hover:bg-emerald-700 p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
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
                  className="w-1/3 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.npwp}
                  onChange={(e) =>
                    setFormData({ ...formData, npwp: e.target.value })
                  }
                />
                <input
                  required
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-2/3 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.nama}
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
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1 outline-none bg-white"
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
              <label className="text-xs font-bold text-gray-500 uppercase">
                Jenis Setoran (KJS)
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1 outline-none bg-white"
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
              <label className="text-xs font-bold text-gray-500 uppercase">
                Nominal Setor (Rp)
              </label>
              <input
                required
                type="number"
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1 font-bold text-lg outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.nominal}
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
              className="flex-1 py-3 text-gray-500 font-bold text-sm border rounded-lg hover:bg-gray-50 transition-colors"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 shadow-md transition-all disabled:opacity-50 flex justify-center items-center gap-2"
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
    );
  }

  // --- TAMPILAN 3: LIST (Billing Belum Bayar) ---
  if (activeView === "list") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Banknote className="text-orange-600" /> Daftar Kode Billing
          </h2>
          <button
            onClick={() => setActiveView("menu")}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
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
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Belum ada data tagihan.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      toast.info(`Detail Billing ${item.id_billing}`)
                    }
                  >
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                      {item.id_billing}
                    </td>
                    <td className="px-6 py-4">{item.kode_jenis}</td>
                    <td className="px-6 py-4">{item.masa_tahun}</td>
                    <td className="px-6 py-4 text-right font-bold">
                      Rp {item.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-bold">
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
        <div className="p-8 text-center">Memuat Billing Service...</div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}
