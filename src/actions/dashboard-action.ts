"use server";

import { query } from "@/lib/db";

// 1. Definisi Tipe Data
type Activity = {
  type: "TER" | "BILL";
  date: string;
  desc: string;
  amount: string | number;
};

// Helper: Penanganan Tanggal Aman
function safeDate(value: any) {
  if (!value) return new Date().toISOString(); // Jika kosong, pakai waktu sekarang
  const date = new Date(value);
  if (isNaN(date.getTime())) return new Date().toISOString(); // Jika error, pakai waktu sekarang
  return date.toISOString();
}

export async function getDashboardStatsAction() {
  try {
    // 2. Ambil data secara paralel dari Database NEON
    const [terRes, billRes, sptRes, relawanRes, recentTer, recentBill] =
      await Promise.all([
        // A. Statistik TER
        query(
          "SELECT COUNT(*) as count, SUM(pph_amount) as total FROM ter_logs",
        ),

        // B. Statistik Billing
        query(
          "SELECT COUNT(*) as count, SUM(CASE WHEN status = 'Belum Bayar' THEN 1 ELSE 0 END) as unpaid FROM billing_data",
        ),

        // C. Statistik SPT
        query(
          "SELECT COUNT(*) as count, SUM(CASE WHEN status = 'DILAPORKAN' OR status = 'Lapor' THEN 1 ELSE 0 END) as lapor FROM spt_logs",
        ),

        // D. Statistik Relawan
        query("SELECT COUNT(*) as count FROM volunteer_logs"),

        // E. Aktivitas Terakhir
        query(
          "SELECT nama_pegawai, pph_amount, created_at FROM ter_logs ORDER BY created_at DESC LIMIT 5",
        ),
        query(
          "SELECT nama_wp, nominal, created_at FROM billing_data ORDER BY created_at DESC LIMIT 5",
        ),
      ]);

    // 3. Parsing Data (Safe Access)
    const terStat = terRes.rows[0] || { count: 0, total: 0 };
    const billStat = billRes.rows[0] || { count: 0, unpaid: 0 };
    const sptStat = sptRes.rows[0] || { count: 0, lapor: 0 };
    const relawanStat = relawanRes.rows[0] || { count: 0 };

    // 4. Gabungkan & Sortir Aktivitas Terakhir (TER + Billing)
    const terActivities: Activity[] = recentTer.rows.map((row) => ({
      type: "TER",
      desc: `Hitung PPh: ${row.nama_pegawai || "Tanpa Nama"}`,
      date: safeDate(row.created_at), // Gunakan fungsi safeDate
      amount: Number(row.pph_amount || 0),
    }));

    const billActivities: Activity[] = recentBill.rows.map((row) => ({
      type: "BILL",
      desc: `Billing: ${row.nama_wp || "Tanpa Nama"}`,
      date: safeDate(row.created_at), // Gunakan fungsi safeDate
      amount: Number(row.nominal || 0),
    }));

    // Gabung, Sortir (Terbaru diatas), dan Ambil 5 teratas
    const allRecents = [...terActivities, ...billActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((item) => ({
        ...item,
        // Format ulang tanggal untuk tampilan (dd/mm/yyyy)
        date: new Date(item.date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      }));

    // 5. Return Data ke Frontend
    return {
      success: true,
      data: {
        ter: {
          count: Number(terStat.count || 0),
          total: Number(terStat.total || 0),
        },
        bill: {
          count: Number(billStat.count || 0),
          unpaid: Number(billStat.unpaid || 0),
          paid: 0,
          total: 0,
        },
        spt: {
          count: Number(sptStat.count || 0),
          lapor: Number(sptStat.lapor || 0),
        },
        relawan: {
          count: Number(relawanStat.count || 0),
        },
        recents: allRecents,
      },
    };
  } catch (error) {
    console.error("Dashboard Load Error:", error);
    // Return data 0 agar dashboard tetap tampil walau database error
    return {
      success: true,
      data: {
        ter: { count: 0, total: 0 },
        bill: { count: 0, unpaid: 0, paid: 0, total: 0 },
        spt: { count: 0, lapor: 0 },
        relawan: { count: 0 },
        recents: [],
      },
    };
  }
}
