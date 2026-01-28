"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Tipe Data
type SptFormData = {
  jenisPajak: string;
  jenisSurat: string;
  masa: string;
  tahun: string;
  pembetulan: string;
  noObjek: string;
  status?: string; // Opsional: Konsep / Dilaporkan
  nominal?: string; // Opsional: Untuk kurang bayar
};

// --- ACTION 1: AMBIL DATA (READ) ---
export async function getSptListAction() {
  try {
    // Ambil data dari Neon, urutkan dari yang terbaru
    const result = await query(
      "SELECT * FROM spt_logs ORDER BY created_at DESC",
    );

    return result.rows.map((row) => {
      // Format tanggal dari timestamp database
      const tanggalFormatted = new Date(row.created_at).toLocaleString(
        "id-ID",
        {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );

      // Format Periode (Tahunan vs Masa)
      const periodeDisplay =
        row.masa_pajak === "Tahunan"
          ? `Tahunan ${row.tahun_pajak}`
          : `${row.masa_pajak} ${row.tahun_pajak}`;

      // Mapping ke format yang dipakai di Frontend (Page)
      return {
        id: row.id.toString(), // ID database biasanya number, convert ke string
        jenis_pajak: row.jenis_pajak,
        jenis_surat: row.jenis_surat || "-",
        periode: periodeDisplay,
        tahun: row.tahun_pajak,
        no_objek: row.no_objek || "-",
        model: row.pembetulan === 0 ? "NORMAL" : `PEMBETULAN ${row.pembetulan}`,
        id_billing: row.id_billing || "-",
        bpe: row.bpe_number || "-",
        status: (row.status || "KONSEP").toUpperCase().replace(" ", "_"),
        nominal: Number(row.nominal || 0),
        tanggal: tanggalFormatted,
      };
    });
  } catch (error) {
    console.error("Gagal ambil SPT:", error);
    return [];
  }
}

// --- ACTION 2: BUAT SPT (CREATE) ---
export async function createSptAction(data: SptFormData) {
  try {
    // 1. Cek Status & Generate BPE jika 'DILAPORKAN'
    const statusAwal = data.status || "Konsep";
    let bpe = "-";

    if (statusAwal === "DILAPORKAN") {
      const rand = Math.floor(10000000 + Math.random() * 90000000);
      bpe = `S-${rand}/${data.tahun}`;
    }

    // 2. Parse Nominal & Pembetulan
    const nominalVal = parseFloat(data.nominal || "0");
    const pembetulanVal = parseInt(data.pembetulan || "0");

    // 3. Simpan ke Database Neon
    await query(
      `INSERT INTO spt_logs 
       (jenis_pajak, jenis_surat, masa_pajak, tahun_pajak, pembetulan, no_objek, status, nominal, bpe_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        data.jenisPajak,
        data.jenisSurat,
        data.masa,
        data.tahun,
        pembetulanVal,
        data.noObjek,
        statusAwal,
        nominalVal,
        bpe,
      ],
    );

    // 4. Revalidate Cache
    revalidatePath("/dashboard/spt");
    revalidatePath("/dashboard/simulasi/coretax");

    return { success: true, message: "Data Berhasil Disimpan!", bpe: bpe };
  } catch (error) {
    console.error("Error create SPT:", error);
    return { success: false, message: "Terjadi kesalahan server (Database)." };
  }
}
