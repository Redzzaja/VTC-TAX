"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- ACTION 1: AMBIL DATA (READ) ---
export async function getLaporSptListAction() {
  try {
    // Ambil semua data SPT yang sudah ada BPE-nya (Artinya sudah lapor)
    const result = await query(
      "SELECT * FROM spt_logs WHERE bpe_number != '-' ORDER BY created_at DESC",
    );

    return result.rows.map((row) => ({
      id: row.id.toString(),
      jenis_spt: row.jenis_surat || "-", // Mapping ke jenis_surat (1770 S, dll)
      tahun: row.tahun_pajak || "-",
      status: row.status || "Nihil",
      nominal: Number(row.nominal || 0),
      // Format tanggal
      tanggal: new Date(row.created_at).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      bpe: row.bpe_number,
      sumber: row.sumber || "E-Filing",
    }));
  } catch (error) {
    console.error("Gagal ambil list Lapor SPT:", error);
    return [];
  }
}

// --- ACTION 2: LAPOR SPT (CREATE) ---
export async function createLaporSptAction(formData: any) {
  try {
    // Generate BPE (Bukti Penerimaan Elektronik) Dummy
    // Format: S-01234567/2025
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    const bpe = `S-${randomNum}/${formData.tahun}`;

    // Insert ke tabel spt_logs
    // Kita anggap jenis_pajak = 'PPh Tahunan' karena konteks filenya lapor SPT Tahunan
    await query(
      `INSERT INTO spt_logs 
       (jenis_pajak, jenis_surat, tahun_pajak, status, nominal, bpe_number, sumber, masa_pajak) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Tahunan')`,
      [
        "PPh Tahunan", // $1 jenis_pajak
        formData.jenisSpt, // $2 jenis_surat (1770 S, dll)
        formData.tahun, // $3 tahun_pajak
        formData.status, // $4 status (Nihil/Kurang Bayar)
        formData.nominal, // $5 nominal
        bpe, // $6 bpe_number
        "E-Filing", // $7 sumber
      ],
    );

    revalidatePath("/dashboard/spt");

    return { success: true, message: "SPT Berhasil Dilaporkan!", bpe: bpe };
  } catch (error) {
    console.error("Gagal lapor SPT:", error);
    return {
      success: false,
      message: "Terjadi kesalahan server saat menyimpan data.",
    };
  }
}
