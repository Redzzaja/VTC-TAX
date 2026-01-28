"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/logout";
import {
  LayoutDashboard,
  MonitorPlay,
  Calculator,
  Percent,
  UserPlus,
  MessageCircle,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LogOut,
} from "lucide-react";

// Definisi Menu Sesuai Permintaan
const menuItems = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },

  // Section Header: Taxation
  { type: "header", name: "Taxation" },

  { name: "Simulasi CoreVTC", href: "/dashboard/simulasi", icon: MonitorPlay },
  { name: "Perhitungan TER", href: "/dashboard/ter", icon: Calculator },
  { name: "Kalkulator Pajak", href: "/dashboard/kalkulator", icon: Percent },
  { name: "Pendaftaran Relawan", href: "/dashboard/relawan", icon: UserPlus },
  {
    name: "Tanya Agent VTC",
    href: "/dashboard/tanya-agent",
    icon: MessageCircle,
  },
  { name: "Materi Perpajakan", href: "/dashboard/materi", icon: BookOpen },
  {
    name: "Seleksi Relawan Pajak",
    href: "/dashboard/seleksi",
    icon: ClipboardCheck,
  },
  {
    name: "Ruang Belajar Pajak",
    href: "/dashboard/belajar",
    icon: GraduationCap,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 h-screen text-white flex flex-col fixed left-0 top-0 overflow-y-auto border-r border-slate-800 z-50">
      {/* Header / Brand */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-yellow-500 tracking-wider">
          COREVTC
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">SYSTEM V1.0</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, index) => {
          // Render Section Header (Taxation)
          if (item.type === "header") {
            return (
              <div key={index} className="px-4 pt-6 pb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {item.name}
                </p>
              </div>
            );
          }

          // Render Menu Item Biasa
          const isActive = pathname === item.href;
          const Icon = item.icon; // Ambil komponen ikon

          return (
            <Link
              key={index}
              href={item.href || "#"}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {Icon && (
                <Icon
                  size={18}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }
                />
              )}
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-900/10 hover:text-red-300 rounded-lg transition-colors text-left"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
