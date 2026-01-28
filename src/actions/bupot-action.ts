"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- ACTION 1: AMBIL DATA (READ) ---
export async function getBupotListAction() {
  try {
    // Ambil data dari tabel bupot_21_logs, urutkan dari yang terbaru
    const result = await query(
      "SELECT * FROM bupot_21_logs ORDER BY created_at DESC",
    );

    return result.rows.map((row) => ({
      id: row.bupot_id, // ID Kustom (BP-...)
      masa: row.masa_pajak,
      status: row.status,
      identitas: {
        npwp: row.npwp || "-",
        nama: row.nama_wp,
      },
      kode_objek: row.kode_objek,
      bruto: Number(row.bruto),
      tarif: row.tarif,
      pph: Number(row.pph_amount),
      // Format Tanggal
      tanggal: new Date(row.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  } catch (error) {
    console.error("Gagal ambil data Bupot:", error);
    return [];
  }
}

// --- ACTION 2: BUAT BUKTI POTONG (CREATE) ---
export async function createBupotAction(formData: any) {
  try {
    // 1. Persiapan Data
    const id = "BP-" + Date.now().toString().slice(-6);
    const masaLengkap = `${formData.masa} ${formData.tahun}`;

    // Hitung Pajak Otomatis
    const bruto = parseFloat(formData.bruto || "0");
    const tarifPersen = parseFloat(formData.tarif || "0");
    const tarifDesimal = tarifPersen / 100;
    const pph = Math.floor(bruto * tarifDesimal);

    // 2. Simpan ke Database Neon
    await query(
      `INSERT INTO bupot_21_logs 
       (bupot_id, masa_pajak, status, npwp, nama_wp, kode_objek, bruto, dpp, tarif, pph_amount, no_dokumen) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id, // $1 bupot_id
        masaLengkap, // $2 masa_pajak
        "Belum Lapor", // $3 status
        formData.npwp, // $4 npwp
        formData.nama, // $5 nama_wp
        formData.kode, // $6 kode_objek
        bruto, // $7 bruto
        bruto, // $8 dpp (Asumsi sama dengan bruto)
        `${tarifPersen}%`, // $9 tarif (String)
        pph, // $10 pph_amount
        "-", // $11 no_dokumen
      ],
    );

    revalidatePath("/dashboard/ebupot21");

    return { success: true, message: "Bukti Potong Berhasil Dibuat!" };
  } catch (error) {
    console.error("Error create Bupot:", error);
    return {
      success: false,
      message: "Terjadi kesalahan server saat menyimpan data.",
    };
  }
}
