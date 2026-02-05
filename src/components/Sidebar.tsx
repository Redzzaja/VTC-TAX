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
  X,
} from "lucide-react";

const menuItems = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
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
  { name: "Seleksi Relawan", href: "/dashboard/seleksi", icon: ClipboardCheck },
  { name: "Ruang Belajar", href: "/dashboard/belajar", icon: GraduationCap },
];

export default function Sidebar({
  onMobileClose,
}: {
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-950 h-full text-white flex flex-col overflow-y-auto border-r border-slate-900 shadow-xl z-50">
      {/* Header / Brand */}
      <div className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-950 sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-yellow-500 tracking-wider flex items-center gap-2">
            COREVTC
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-mono tracking-widest">
            SYSTEM V1.0
          </p>
        </div>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, index) => {
          if (item.type === "header") {
            return (
              <div key={index} className="px-4 pt-6 pb-2">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  {item.name}
                </p>
              </div>
            );
          }

          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={index}
              href={item.href || "#"}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
            >
              {/* Active Indicator (Garis Kuning di Kiri) */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-500 rounded-r-full" />
              )}

              {Icon && (
                <Icon
                  size={18}
                  className={
                    isActive
                      ? "text-yellow-500"
                      : "group-hover:text-slate-300 transition-colors"
                  }
                />
              )}
              <span
                className={`text-sm font-medium ${isActive ? "font-bold" : ""}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-900 mt-auto bg-slate-950">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-950/30 hover:text-red-400 rounded-lg transition-all group text-left"
          >
            <LogOut
              size={18}
              className="group-hover:text-red-500 transition-colors"
            />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
