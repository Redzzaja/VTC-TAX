"use client";

import { useState, useEffect } from "react";
import { getDashboardStatsAction } from "@/actions/dashboard-action";
import {
  Wallet,
  FileText,
  Users,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Calendar,
} from "lucide-react"; //
import Link from "next/link";
// Import komponen Loading agar bisa ditampilkan saat fetching data di client-side
import Loading from "../loading";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const res = await getDashboardStatsAction();
      if (res.success) {
        setStats(res.data);
      }
      setIsLoading(false);
    };
    loadData();
  }, []); //

  if (isLoading) {
    // PERBAIKAN: Return component Loading, bukan null
    return <Loading />;
  }

  return (
    // Class 'animate-in' akan bekerja jika plugin tailwindcss-animate sudah diinstall
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Selamat Datang, Admin VTC! 👋
          </h1>
          <p className="text-blue-100 max-w-xl">
            Sistem informasi perpajakan terintegrasi siap digunakan. Pantau
            aktivitas perpajakan, billing, dan relawan secara real-time hari
            ini.
          </p>
        </div>
        {/* Dekorasi */}
        <div className="absolute right-0 bottom-0 opacity-10">
          <TrendingUp size={200} />
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: PPh 21 TER */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Wallet size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight size={12} /> +{stats?.ter.count} Data
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total PPh 21 (TER)</p>
          <h3 className="text-2xl font-bold text-gray-800">
            Rp{" "}
            {(stats?.ter.total || 0).toLocaleString("id-ID", {
              notation: "compact",
            })}
          </h3>
        </div>

        {/* Card 2: Billing */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <FileText size={24} />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
              {stats?.bill.unpaid} Belum Bayar
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Billing Dibuat</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {stats?.bill.count} Dokumen
          </h3>
        </div>

        {/* Card 3: SPT */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1">
              {stats?.spt.lapor} Terlapor
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total SPT Tahunan</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {stats?.spt.count} SPT
          </h3>
        </div>

        {/* Card 4: Relawan */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              Batch 5
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Pendaftar Relawan</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {stats?.relawan.count} Mahasiswa
          </h3>
        </div>
      </div>

      {/* 3. Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">
              Aktivitas Terakhir
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {stats?.recents.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Belum ada aktivitas.
              </p>
            ) : (
              stats?.recents.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        item.type === "TER"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {item.type}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">
                        {item.desc}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={10} /> {item.date}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-gray-700 text-sm">
                    Rp {parseFloat(item.amount).toLocaleString("id-ID")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kolom Kanan: Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-4">
              Akses Cepat
            </h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/ter"
                className="block w-full text-left p-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-700 font-medium text-sm transition-colors border border-gray-100 hover:border-blue-100"
              >
                🚀 Hitung PPh 21 (TER)
              </Link>
              <Link
                href="/dashboard/billing"
                className="block w-full text-left p-3 rounded-lg hover:bg-purple-50 text-gray-600 hover:text-purple-700 font-medium text-sm transition-colors border border-gray-100 hover:border-purple-100"
              >
                💳 Buat Billing Pajak
              </Link>
              <Link
                href="/dashboard/tanya-agent"
                className="block w-full text-left p-3 rounded-lg hover:bg-yellow-50 text-gray-600 hover:text-yellow-700 font-medium text-sm transition-colors border border-gray-100 hover:border-yellow-100"
              >
                🤖 Tanya AI Consultant
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
            <h4 className="font-bold mb-2">Ingin Belajar Pajak?</h4>
            <p className="text-sm text-slate-300 mb-4">
              Akses materi terbaru dan ikuti kuis interaktif.
            </p>
            <Link
              href="/dashboard/ruang-belajar"
              className="block w-full bg-white text-slate-900 text-center py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors"
            >
              Buka Ruang Belajar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
