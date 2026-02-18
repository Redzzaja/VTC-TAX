import { getAdminDashboardStatsAction } from "@/actions/relawan-action";
import AdminDashboardCharts from "@/components/AdminDashboardCharts";
import { Users, UserCheck, UserX, Activity } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const res = await getAdminDashboardStatsAction();
  const stats = (res.success && res.stats) ? res.stats : { pending: 0, approved: 0, rejected: 0, total: 0 };
  const scores = (res.success && res.scores) ? res.scores : [];
  const recent = (res.success && res.recent) ? res.recent : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
           <p className="text-sm text-slate-500">Pantau seleksi relawan dan statistik pengguna.</p>
        </div>
        <div className="hidden md:block bg-yellow-50 p-3 rounded-full">
            <Activity size={32} className="text-yellow-600"/>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Users size={24} />
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Pendaftar</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.total}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                    <Activity size={24} />
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Menunggu Seleksi</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.pending}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                    <UserCheck size={24} />
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Diterima</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.approved}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                    <UserX size={24} />
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Ditolak</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.rejected}</h3>
        </div>
      </div>

      {/* Charts */}
      <AdminDashboardCharts stats={stats} scores={scores} />

      {/* Recent Activity / Selection Results Link */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Peserta Tes Terbaru</h3>
            <Link href="/dashboard/admin/seleksi" className="text-sm font-bold text-blue-600 hover:text-blue-800 underline">
                Lihat Semua Hasil
            </Link>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3">Nama</th>
                        <th className="px-6 py-3">NIM</th>
                        <th className="px-6 py-3">Skor</th>
                        <th className="px-6 py-3">Waktu Tes</th>
                    </tr>
                </thead>
                <tbody>
                    {recent.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-400">Belum ada data tes.</td></tr>
                    ) : (
                        recent.map((r: any, idx: number) => (
                            <tr key={idx} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{r.nama_lengkap}</td>
                                <td className="px-6 py-4 text-slate-600">{r.nim}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        r.selection_score >= 70 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}>
                                        {r.selection_score}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(r.test_taken_at).toLocaleDateString("id-ID", {
                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
