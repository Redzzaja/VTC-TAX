"use server";

import { appendSheetData, getSheetData } from "@/lib/google";
import { revalidatePath } from "next/cache";

// --- ACTION 1: AMBIL DATA (READ) ---
export async function getLaporSptListAction() {
  try {
    // Ambil data dari sheet "Lapor SPT" (Range A2:H)
    const rows = await getSheetData("Lapor SPT!A2:H");
    if (!rows) return [];

    return rows
      .map((row) => ({
        id: row[0],
        jenis_spt: row[1], // 1770, 1770 S, 1770 SS
        tahun: row[2],
        status: row[3], // Nihil / Kurang Bayar / Lebih Bayar
        nominal: parseFloat(row[4]) || 0,
        tanggal: row[5],
        bpe: row[6], // Bukti Penerimaan Elektronik
        sumber: row[7], // E-Filing / E-Form
      }))
      .reverse();
  } catch (error) {
    return [];
  }
}

// --- ACTION 2: LAPOR SPT (CREATE) ---
export async function createLaporSptAction(formData: any) {
  try {
    const timestamp = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
    const id = "SPT-" + Date.now().toString().slice(-6);

    // Generate BPE (Bukti Penerimaan Elektronik) Dummy
    // Format: S-01234567/2025
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    const bpe = `S-${randomNum}/${formData.tahun}`;

    const newRow = [
      id,
      formData.jenisSpt,
      formData.tahun,
      formData.status,
      formData.nominal,
      timestamp,
      bpe,
      "E-Filing",
    ];

    const result = await appendSheetData("Lapor SPT!A:H", [newRow]);

    if (result) {
      revalidatePath("/dashboard/spt");
      return { success: true, message: "SPT Berhasil Dilaporkan!", bpe: bpe };
    } else {
      return { success: false, message: "Gagal koneksi database." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan server." };
  }
}
