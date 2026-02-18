"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar"; // Pastikan path ini sesuai
import { Menu, UserCircle } from "lucide-react";

export default function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; role: string };
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* 1. Desktop Sidebar (Hidden di Mobile, Flex di LG) */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50">
        <Sidebar userRole={user.role} />
      </div>

      {/* 2. Mobile Sidebar (Overlay + Slide) */}
      {/* Overlay Background Gelap */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile yang meluncur */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onMobileClose={() => setSidebarOpen(false)} userRole={user.role} />
      </div>

      {/* 3. Konten Utama */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Header Navbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Tombol Hamburger (Hanya muncul di Mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Judul di Mobile (Opsional) */}
            <span className="lg:hidden font-bold text-slate-800 text-sm tracking-wider">
              COREVTC
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <h1 className="text-sm text-slate-500">
                Hi,{" "}
                <span className="text-slate-900 font-bold">{user.name}</span>
              </h1>
            </div>

            {/* Role Badge Monokrom */}
            <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase border border-slate-200 flex items-center gap-2">
              <UserCircle size={14} className="text-slate-500" />
              {user.role}
            </div>
          </div>
        </header>

        {/* Area Konten Halaman */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
