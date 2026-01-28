"use client";

import Link from "next/link";
import {
  FileSpreadsheet,
  Send,
  CreditCard,
  Receipt,
  UserSquare2,
  ArrowRight,
} from "lucide-react";

const simulationFeatures = [
  {
    id: "ebupot",
    title: "E-Bupot 21/26",
    desc: "Pembuatan Bukti Potong PPh 21",
    icon: FileSpreadsheet,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    href: "/dashboard/ebupot21", // ✅ Sudah Benar
  },
  {
    id: "spt",
    title: "SPT Tahunan",
    desc: "Pelaporan SPT Tahunan/Masa",
    icon: Send,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    href: "/dashboard/spt", // ✅ PERBAIKAN: Dulu /dashboard/simulasi/spt
  },
  {
    id: "billing",
    title: "E-Billing",
    desc: "Pembuatan Kode Billing",
    icon: CreditCard,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    href: "/dashboard/billing", // ✅ Sudah Benar
  },
  {
    id: "efaktur",
    title: "E-Faktur",
    desc: "Administrasi Faktur Pajak",
    icon: Receipt,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    href: "/dashboard/efaktur", // ✅ Sudah Benar
  },
  {
    id: "coretax",
    title: "Simulasi Coretax",
    desc: "Simulasi Coretax Orang Pribadi",
    icon: UserSquare2,
    color: "text-red-500",
    bgColor: "bg-red-50",
    href: "/dashboard/simulasi/coretax", // ✅ Sudah Benar
  },
];

export default function CoreSimulationPage() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="inline-flex p-4 bg-slate-800 rounded-full mb-4 border border-slate-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <UserSquare2 size={48} className="text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            SIMULASI CORE VTC
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Pusat simulasi sistem perpajakan terintegrasi. Silakan pilih fitur
            perpajakan yang ingin Anda simulasikan di bawah ini.
          </p>
        </div>

        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      {/* Grid Menu Fitur */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulationFeatures.map((feat) => (
          <Link
            key={feat.id}
            href={feat.href}
            className="group block bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div
                className={`w-14 h-14 rounded-xl ${feat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
              >
                <feat.icon size={28} className={feat.color} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feat.desc}
              </p>
            </div>

            {/* Tombol Panah Hover */}
            <div className="mt-6 flex items-center text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              AKSES FITUR <ArrowRight size={16} className="ml-2" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
