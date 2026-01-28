"use server";

import { getSheetData } from "@/lib/google";

// 1. Definisi Tipe Data (Supaya TypeScript tidak error)
type Activity = {
  type: "TER" | "BILL";
  date: string;
  desc: string;
  amount: string | number;
};

type DashboardStats = {
  ter: { count: number; total: number };
  bill: { count: number; unpaid: number; paid: number; total: number };
  spt: { count: number; lapor: number };
  relawan: { count: number };
  recents: Activity[];
};

export async function getDashboardStatsAction() {
  try {
    // 2. Ambil data secara paralel
    const [terData, billData, sptData, relawanData] = await Promise.all([
      getSheetData("Data TER!A2:H"),
      getSheetData("Data Billing!A2:K"),
      getSheetData("Data SPT!A2:I"),
      getSheetData("Data Relawan!A2:K"),
    ]);

    // --- LOGIKA HITUNG STATISTIK ---

    // A. TER
    let terCount = 0;
    let terTotal = 0;
    if (terData) {
      terCount = terData.length;
      terTotal = terData.reduce(
        (sum, row) => sum + (parseFloat(row[7]) || 0),
        0
      );
    }

    // B. Billing
    let billCount = 0;
    let billUnpaid = 0;
    let billPaid = 0;
    let billTotal = 0;
    if (billData) {
      billCount = billData.length;
      billData.forEach((row) => {
        const nominal = parseFloat(row[6]) || 0;
        billTotal += nominal;
        if (row[7] === "Sudah Bayar") billPaid++;
        else billUnpaid++;
      });
    }

    // C. SPT
    let sptCount = 0;
    let sptLapor = 0;
    if (sptData) {
      sptCount = sptData.length;
      sptLapor = sptData.filter((row) => row[4] === "Lapor").length;
    }

    // D. Relawan
    let relawanCount = relawanData ? relawanData.length : 0;

    // E. Aktivitas Terakhir (SOLUSI ERROR DISINI)
    // Kita deklarasikan array dengan tipe Activity[] secara eksplisit
    const recentActivities: Activity[] = [];

    if (terData) {
      // Ambil 3 data terakhir dari TER
      terData
        .slice(-3)
        .reverse()
        .forEach((r) =>
          recentActivities.push({
            type: "TER",
            date: r[1] || "-",
            desc: `Hitung PPh: ${r[2]}`,
            amount: r[7] || 0,
          })
        );
    }

    if (billData) {
      // Ambil 3 data terakhir dari Billing
      billData
        .slice(-3)
        .reverse()
        .forEach((r) =>
          recentActivities.push({
            type: "BILL",
            date: r[9] || "-",
            desc: `Billing: ${r[2]}`,
            amount: r[6] || 0,
          })
        );
    }

    // Sort by date (desc) dan ambil 5 teratas
    // Asumsi format tanggal string standar, jika format Indonesia mungkin perlu parsing khusus
    // Di sini kita gunakan sort sederhana dulu
    const recents = recentActivities.slice(0, 5);

    const stats: DashboardStats = {
      ter: { count: terCount, total: terTotal },
      bill: {
        count: billCount,
        unpaid: billUnpaid,
        paid: billPaid,
        total: billTotal,
      },
      spt: { count: sptCount, lapor: sptLapor },
      relawan: { count: relawanCount },
      recents: recents,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Dashboard Error:", error);
    return { success: false, message: "Gagal memuat data dashboard." };
  }
}
