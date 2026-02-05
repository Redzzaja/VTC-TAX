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
  CreditCard,
  Calculator,
  MessageSquare,
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
      {/* 1. Welcome Banner Responsive (Monokrom) */}
      <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Selamat Datang, Admin VTC! 👋
          </h1>
          <p className="text-slate-400 text-sm lg:text-base max-w-xl">
            Sistem informasi perpajakan terintegrasi siap digunakan. Pantau
            aktivitas secara real-time.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10 text-white">
          <TrendingUp size={150} />
        </div>
      </div>

      {/* 2. Stats Grid - Responsive Columns (Slate Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Card 1: PPh 21 TER */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
              <Wallet size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
              <ArrowUpRight size={12} /> +{stats?.ter.count}
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1 font-medium">
            Total PPh 21 (TER)
          </p>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-800">
            Rp{" "}
            {(stats?.ter.total || 0).toLocaleString("id-ID", {
              notation: "compact",
            })}
          </h3>
        </div>

        {/* Card 2: Billing */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
              <FileText size={24} />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
              {stats?.bill.unpaid} Belum Bayar
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1 font-medium">
            Billing Dibuat
          </p>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-800">
            {stats?.bill.count} Dokumen
          </h3>
        </div>

        {/* Card 3: SPT Tahunan */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
              <Activity size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
              {stats?.spt.lapor} Terlapor
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1 font-medium">SPT Tahunan</p>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-800">
            {stats?.spt.count} SPT
          </h3>
        </div>

        {/* Card 4: Relawan */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
              <Users size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-1 font-medium">
            Pendaftar Relawan
          </p>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-800">
            {stats?.relawan.count} Org
          </h3>
        </div>
      </div>

      {/* 3. Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6">
          <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <Activity size={20} className="text-slate-500" /> Aktivitas Terakhir
          </h3>
          <div className="space-y-4">
            {stats?.recents.length === 0 ? (
              <p className="text-slate-400 text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                Belum ada aktivitas.
              </p>
            ) : (
              stats?.recents.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all border border-slate-100 hover:border-slate-200"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                        item.type === "TER"
                          ? "bg-white text-slate-700 border-slate-300"
                          : "bg-slate-900 text-white border-slate-900"
                      }`}
                    >
                      {item.type}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">
                        {item.desc}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} /> {item.date}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-700 text-sm sm:text-right mt-2 sm:mt-0">
                    Rp {parseFloat(item.amount).toLocaleString("id-ID")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kolom Kanan: Akses Cepat */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6">
            <h3 className="font-bold text-slate-800 text-lg mb-4">
              Akses Cepat
            </h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/ter"
                className="group block w-full text-left p-3 rounded-lg hover:bg-slate-900 hover:text-white text-slate-600 font-medium text-sm border border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Calculator
                    size={18}
                    className="text-slate-500 group-hover:text-white transition-colors"
                  />
                  Hitung PPh 21
                </div>
              </Link>
              <Link
                href="/dashboard/billing"
                className="group block w-full text-left p-3 rounded-lg hover:bg-slate-900 hover:text-white text-slate-600 font-medium text-sm border border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <CreditCard
                    size={18}
                    className="text-slate-500 group-hover:text-white transition-colors"
                  />
                  Buat Billing
                </div>
              </Link>
              <Link
                href="/dashboard/tanya-agent"
                className="group block w-full text-left p-3 rounded-lg hover:bg-slate-900 hover:text-white text-slate-600 font-medium text-sm border border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare
                    size={18}
                    className="text-slate-500 group-hover:text-white transition-colors"
                  />
                  Tanya AI
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
