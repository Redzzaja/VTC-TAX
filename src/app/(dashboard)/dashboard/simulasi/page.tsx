"use client";

import Link from "next/link";
import {
  FileSpreadsheet,
  Send,
  CreditCard,
  Receipt,
  UserSquare2,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

const simulationFeatures = [
  {
    id: "ebupot",
    title: "E-Bupot 21/26",
    desc: "Pembuatan Bukti Potong PPh 21",
    icon: FileSpreadsheet,
    href: "/dashboard/ebupot21",
  },
  {
    id: "spt",
    title: "SPT Tahunan",
    desc: "Pelaporan SPT Tahunan/Masa",
    icon: Send,
    href: "/dashboard/spt",
  },
  {
    id: "billing",
    title: "E-Billing",
    desc: "Pembuatan Kode Billing",
    icon: CreditCard,
    href: "/dashboard/billing",
  },
  {
    id: "efaktur",
    title: "E-Faktur",
    desc: "Administrasi Faktur Pajak",
    icon: Receipt,
    href: "/dashboard/efaktur",
  },
  {
    id: "coretax",
    title: "Simulasi Coretax",
    desc: "Simulasi Coretax Orang Pribadi",
    icon: UserSquare2,
    href: "/dashboard/simulasi/coretax",
  },
];

export default function CoreSimulationPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner - Tema Gelap Profesional */}
      <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex p-4 bg-slate-800 rounded-full mb-4 border border-slate-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <LayoutDashboard size={40} className="text-yellow-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            SIMULASI CORE VTC
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
            Pusat simulasi sistem perpajakan terintegrasi. Silakan pilih fitur
            perpajakan yang ingin Anda simulasikan di bawah ini.
          </p>
        </div>

        {/* Dekorasi Background Halus */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-800/50 to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Menu Fitur */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulationFeatures.map((feat) => (
          <Link
            key={feat.id}
            href={feat.href}
            className="group block bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 relative overflow-hidden"
          >
            <div className="relative z-10">
              {/* Ikon Seragam (Professional Look) */}
              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:border-slate-900 transition-colors duration-300 shadow-sm">
                <feat.icon
                  size={28}
                  className="text-slate-600 group-hover:text-yellow-500 transition-colors duration-300"
                />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feat.desc}
              </p>
            </div>

            {/* Tombol Akses Fitur (Warna Gelap) */}
            <div className="mt-6 flex items-center text-sm font-bold text-slate-900 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              AKSES FITUR{" "}
              <ArrowRight
                size={16}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
