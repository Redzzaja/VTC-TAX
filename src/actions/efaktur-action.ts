"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- ACTION 1: AMBIL DATA (READ) ---
export async function getFakturListAction() {
  try {
    // Ambil data dari tabel faktur_logs, urutkan dari yang terbaru
    const result = await query(
      "SELECT * FROM faktur_logs ORDER BY created_at DESC",
    );

    return result.rows.map((row) => ({
      id: row.id_faktur, // Menggunakan ID kustom (FK-...)
      jenis: row.jenis,
      lawan_transaksi: row.lawan_transaksi,
      nsfp: row.nsfp,
      // Format tanggal ke string lokal
      tanggal: new Date(row.tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      dpp: Number(row.dpp),
      ppn: Number(row.ppn),
      total: Number(row.total),
      status: row.status,
    }));
  } catch (error) {
    console.error("Gagal ambil data faktur:", error);
    return [];
  }
}

// --- ACTION 2: BUAT FAKTUR (CREATE) ---
export async function createFakturAction(formData: any) {
  try {
    // 1. Generate ID & NSFP Dummy
    const idFaktur = "FK-" + Date.now();
    const nsfp = "010.000-24." + Math.random().toString().slice(2, 10);
    const tanggalSekarang = new Date(); // Untuk kolom tanggal

    // 2. Hitung Angka PPN (11%)
    const dpp = parseFloat(formData.dpp || "0");
    const tarif = 0.11; // 11%
    const ppn = Math.floor(dpp * tarif);
    const total = dpp + ppn;

    // 3. Simpan ke Database Neon
    await query(
      `INSERT INTO faktur_logs 
       (id_faktur, jenis, lawan_transaksi, nsfp, tanggal, dpp, ppn, total, status, detail_barang) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        idFaktur, // $1
        "Faktur Keluaran", // $2
        formData.pembeli, // $3
        nsfp, // $4
        tanggalSekarang, // $5
        dpp, // $6
        ppn, // $7
        total, // $8
        "Approval Sukses", // $9
        JSON.stringify({ barang: formData.barang }), // $10 (Simpan detail barang sebagai text/json)
      ],
    );

    revalidatePath("/dashboard/efaktur");

    return {
      success: true,
      message: "Faktur Berhasil Diupload!",
      nsfp: nsfp,
    };
  } catch (error) {
    console.error("Gagal buat faktur:", error);
    return {
      success: false,
      message: "Terjadi kesalahan server saat menyimpan data.",
    };
  }
}
