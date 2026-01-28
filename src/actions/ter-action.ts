"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Helper: Tentukan Kategori TER berdasarkan PTKP
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

// --- ACTION 1: AMBIL DATA (READ) ---
export async function getTerListAction() {
  try {
    // Ambil data dari tabel 'ter_logs' di Neon
    // Kita urutkan dari yang terbaru (DESC)
    const result = await query(
      "SELECT * FROM ter_logs ORDER BY created_at DESC",
    );

    // Mapping data agar struktur JSON-nya sama dengan yang diharapkan frontend
    return result.rows.map((row) => ({
      id: row.id, // ID dari Serial DB (1, 2, 3...)
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
      // Format ulang tampilan PTKP agar mirip versi Sheet: "TK/0 (TER A)"
      ptkp: `${row.status_ptkp} (TER ${getKategoriTER(row.status_ptkp)})`,
      bruto: Number(row.penghasilan_bruto),
      tarif: `${row.tarif_ter}%`, // Tambahkan '%' agar tampilan di tabel sesuai
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
    // 1. Ambil Input
    const bruto = parseFloat(formData.bruto) || 0;
    const ptkp = formData.ptkp;
    const nama = formData.nama;
    const nik = formData.nik;

    // 2. Tentukan Kategori
    const kategori = getKategoriTER(ptkp);

    // 3. Logika Tarif Sederhana
    let tarifPersen = 0;

    if (kategori === "A") {
      if (bruto <= 5400000) tarifPersen = 0;
      else if (bruto <= 5650000) tarifPersen = 0.25;
      else if (bruto <= 5950000) tarifPersen = 0.5;
      else if (bruto <= 6300000) tarifPersen = 0.75;
      else tarifPersen = 1.5;
      // ... (bisa dilanjutkan sesuai aturan lengkap)
    } else if (kategori === "B") {
      if (bruto <= 6200000) tarifPersen = 0;
      else tarifPersen = 2.0;
    } else {
      // C
      if (bruto <= 6600000) tarifPersen = 0;
      else tarifPersen = 3.0;
    }

    const pph = Math.floor(bruto * (tarifPersen / 100));

    // 4. Simpan ke Database Neon
    // Kita simpan PTKP murni (misal "TK/0") ke kolom status_ptkp
    // agar datanya bersih.
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
