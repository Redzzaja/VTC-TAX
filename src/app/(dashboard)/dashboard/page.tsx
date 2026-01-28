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
} from "lucide-react";
import Link from "next/link";
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
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. Welcome Banner Responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Selamat Datang, Admin VTC! 👋
          </h1>
          <p className="text-blue-100 text-sm lg:text-base max-w-xl">
            Sistem informasi perpajakan terintegrasi siap digunakan. Pantau
            aktivitas secara real-time.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10">
          <TrendingUp size={150} />
        </div>
      </div>

      {/* 2. Stats Grid - Responsive Columns (1 di HP, 2 di Tablet, 4 di Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Card 1 */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Wallet size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight size={12} /> +{stats?.ter.count}
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total PPh 21 (TER)</p>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Rp{" "}
            {(stats?.ter.total || 0).toLocaleString("id-ID", {
              notation: "compact",
            })}
          </h3>
        </div>

        {/* Card 2, 3, 4 (Pola sama, sesuaikan variabel) */}
        {/* ... (Gunakan pola layout yang sama untuk card lainnya) ... */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <FileText size={24} />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              {stats?.bill.unpaid} Belum Bayar
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Billing Dibuat</p>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            {stats?.bill.count} Dokumen
          </h3>
        </div>

        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {stats?.spt.lapor} Terlapor
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">SPT Tahunan</p>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            {stats?.spt.count} SPT
          </h3>
        </div>

        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Users size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Pendaftar Relawan</p>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            {stats?.relawan.count} Org
          </h3>
        </div>
      </div>

      {/* 3. Recent Activity & Quick Links - Stack di HP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
          <h3 className="font-bold text-gray-800 text-lg mb-4">
            Aktivitas Terakhir
          </h3>
          <div className="space-y-4">
            {stats?.recents.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Belum ada aktivitas.
              </p>
            ) : (
              stats?.recents.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${item.type === "TER" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}
                    >
                      {item.type}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm line-clamp-1">
                        {item.desc}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={10} /> {item.date}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-gray-700 text-sm sm:text-right">
                    Rp {parseFloat(item.amount).toLocaleString("id-ID")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          {/* Akses Cepat */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-4">
              Akses Cepat
            </h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/ter"
                className="block w-full text-left p-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-700 font-medium text-sm border border-gray-100 transition-colors"
              >
                🚀 Hitung PPh 21
              </Link>
              <Link
                href="/dashboard/billing"
                className="block w-full text-left p-3 rounded-lg hover:bg-purple-50 text-gray-600 hover:text-purple-700 font-medium text-sm border border-gray-100 transition-colors"
              >
                💳 Buat Billing
              </Link>
              <Link
                href="/dashboard/tanya-agent"
                className="block w-full text-left p-3 rounded-lg hover:bg-yellow-50 text-gray-600 hover:text-yellow-700 font-medium text-sm border border-gray-100 transition-colors"
              >
                🤖 Tanya AI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
