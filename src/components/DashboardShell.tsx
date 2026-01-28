"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; role: string };
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Desktop Sidebar (Hidden di Mobile, Flex di LG) */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50">
        <Sidebar />
      </div>

      {/* 2. Mobile Sidebar (Overlay + Slide) */}
      {/* Overlay Background Gelap */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile yang meluncur */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onMobileClose={() => setSidebarOpen(false)} />
      </div>

      {/* 3. Konten Utama */}
      {/* lg:ml-64 memberikan margin kiri HANYA saat layar besar */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Header Navbar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Tombol Hamburger (Hanya muncul di Mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <Menu size={24} />
            </button>

            {/* Judul di Mobile (Opsional) */}
            <span className="lg:hidden font-bold text-gray-800 text-sm">
              VTC SYSTEM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <h1 className="text-sm font-semibold text-gray-700">
                Hi, <span className="text-blue-600 font-bold">{user.name}</span>
              </h1>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-blue-100">
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
