"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- DATA TARIF PP 58 TAHUN 2023 (LENGKAP) ---
const TER_A = [
  { limit: 5400000, rate: 0 },
  { limit: 5650000, rate: 0.25 },
  { limit: 5950000, rate: 0.5 },
  { limit: 6300000, rate: 0.75 },
  { limit: 6750000, rate: 1 },
  { limit: 7500000, rate: 1.5 },
  { limit: 8550000, rate: 2 },
  { limit: 9650000, rate: 2.5 },
  { limit: 11050000, rate: 3 },
  { limit: 12600000, rate: 3.5 },
  { limit: 15100000, rate: 4 },
  { limit: 17700000, rate: 5 },
  { limit: 20750000, rate: 6 },
  { limit: 24050000, rate: 7 },
  { limit: 28500000, rate: 8 },
  { limit: 33250000, rate: 9 },
  { limit: 38650000, rate: 10 },
  { limit: 44850000, rate: 11 },
  { limit: 52050000, rate: 12 },
  { limit: 60400000, rate: 13 },
  { limit: 70850000, rate: 14 },
  { limit: 84600000, rate: 15 },
  { limit: 101400000, rate: 16 },
  { limit: 122950000, rate: 17 },
  { limit: 152050000, rate: 18 },
  { limit: 195400000, rate: 19 },
  { limit: 261200000, rate: 20 },
  { limit: 373100000, rate: 21 },
  { limit: 572350000, rate: 22 },
  { limit: 883600000, rate: 23 },
  { limit: Infinity, rate: 24 },
];

const TER_B = [
  { limit: 6200000, rate: 0 },
  { limit: 6500000, rate: 0.25 },
  { limit: 6850000, rate: 0.5 },
  { limit: 7300000, rate: 0.75 },
  { limit: 7800000, rate: 1 },
  { limit: 8650000, rate: 1.5 },
  { limit: 9850000, rate: 2 },
  { limit: 11150000, rate: 2.5 },
  { limit: 12750000, rate: 3 },
  { limit: 14550000, rate: 3.5 },
  { limit: 17400000, rate: 4 },
  { limit: 20400000, rate: 5 },
  { limit: 23900000, rate: 6 },
  { limit: 27700000, rate: 7 },
  { limit: 32800000, rate: 8 },
  { limit: 38250000, rate: 9 },
  { limit: 44450000, rate: 10 },
  { limit: 51600000, rate: 11 },
  { limit: 59850000, rate: 12 },
  { limit: 69450000, rate: 13 },
  { limit: 81450000, rate: 14 },
  { limit: 97250000, rate: 15 },
  { limit: 116600000, rate: 16 },
  { limit: 141350000, rate: 17 },
  { limit: 174800000, rate: 18 },
  { limit: 224650000, rate: 19 },
  { limit: 300300000, rate: 20 },
  { limit: 429000000, rate: 21 },
  { limit: 658050000, rate: 22 },
  { limit: 1015950000, rate: 23 },
  { limit: Infinity, rate: 24 },
];

const TER_C = [
  { limit: 6600000, rate: 0 },
  { limit: 6950000, rate: 0.25 },
  { limit: 7350000, rate: 0.5 },
  { limit: 7800000, rate: 0.75 },
  { limit: 8300000, rate: 1 },
  { limit: 9250000, rate: 1.5 },
  { limit: 10550000, rate: 2 },
  { limit: 11900000, rate: 2.5 },
  { limit: 13600000, rate: 3 },
  { limit: 15500000, rate: 3.5 },
  { limit: 18550000, rate: 4 },
  { limit: 21750000, rate: 5 },
  { limit: 25500000, rate: 6 },
  { limit: 29550000, rate: 7 },
  { limit: 35000000, rate: 8 },
  { limit: 40800000, rate: 9 },
  { limit: 47400000, rate: 10 },
  { limit: 55050000, rate: 11 },
  { limit: 63850000, rate: 12 },
  { limit: 74100000, rate: 13 },
  { limit: 86900000, rate: 14 },
  { limit: 103750000, rate: 15 },
  { limit: 124400000, rate: 16 },
  { limit: 150850000, rate: 17 },
  { limit: 186550000, rate: 18 },
  { limit: 239750000, rate: 19 },
  { limit: 320500000, rate: 20 },
  { limit: 457850000, rate: 21 },
  { limit: 702300000, rate: 22 },
  { limit: 1084250000, rate: 23 },
  { limit: Infinity, rate: 24 },
];

function getKategoriTER(ptkp: string) {
  const ptkpMap: Record<string, string> = {
    "TK/0": "A",
    "TK/1": "A",
    "K/0": "A",
    "TK/2": "B",
    "TK/3": "B",
    "K/1": "B",
    "K/2": "B",
    "K/3": "C",
  };
  return ptkpMap[ptkp] || "A";
}

function getTarifFromBruto(bruto: number, kategori: string) {
  let table = TER_A;
  if (kategori === "B") table = TER_B;
  if (kategori === "C") table = TER_C;

  // Cari range yang sesuai
  for (const tier of table) {
    if (bruto <= tier.limit) {
      return tier.rate;
    }
  }
  return 34; // Fallback jika melebihi batas (sangat jarang terjadi dengan Infinity)
}

// --- ACTION 1: AMBIL DATA (READ) ---
export async function getTerListAction() {
  try {
    const result = await query(
      "SELECT * FROM ter_logs ORDER BY created_at DESC",
    );

    return result.rows.map((row) => ({
      id: row.id,
      tanggal: new Date(row.created_at).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      nama: row.nama_pegawai,
      nik: row.nik || "-",
      ptkp: `${row.status_ptkp} (TER ${getKategoriTER(row.status_ptkp)})`,
      bruto: Number(row.penghasilan_bruto),
      tarif: `${row.tarif_ter}%`,
      pph: Number(row.pph_amount),
    }));
  } catch (error) {
    console.error("Error get data:", error);
    return [];
  }
}

// --- ACTION 2: HITUNG & SIMPAN (CREATE) ---
export async function calculateTerAction(formData: any) {
  try {
    const bruto = parseFloat(formData.bruto) || 0;
    const ptkp = formData.ptkp;
    const nama = formData.nama;
    const nik = formData.nik;

    const kategori = getKategoriTER(ptkp);
    const tarifPersen = getTarifFromBruto(bruto, kategori);
    const pph = Math.floor(bruto * (tarifPersen / 100));

    await query(
      `INSERT INTO ter_logs 
       (nama_pegawai, nik, status_ptkp, penghasilan_bruto, tarif_ter, pph_amount) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [nama, nik, ptkp, bruto, tarifPersen, pph],
    );

    revalidatePath("/dashboard/ter");

    return {
      success: true,
      message: "Perhitungan Berhasil Disimpan!",
      hasil: { pph: pph, tarif: tarifPersen, kategori: kategori },
    };
  } catch (error) {
    console.error("Server Error:", error);
    return { success: false, message: "Gagal menyimpan ke database." };
  }
}

// --- ACTION 3: RESET HISTORY (DELETE ALL) ---
export async function resetTerHistoryAction() {
  try {
    await query("DELETE FROM ter_logs");
    revalidatePath("/dashboard/ter");
    return { success: true, message: "Seluruh riwayat berhasil dihapus." };
  } catch (error) {
    console.error("Error resetting history:", error);
    return { success: false, message: "Gagal menghapus riwayat." };
  }
}
