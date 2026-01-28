"use server";

import { appendSheetData, getSheetData } from "@/lib/google";
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
    const rows = await getSheetData("Data SPT!A2:I");
    if (!rows) return [];

    return rows
      .map((row) => {
        let extraData = {
          jenis_surat: "-",
          no_objek: "-",
          id_billing: "-",
          bpe: "-", // Bukti Penerimaan Elektronik
          nominal: "0",
        };

        try {
          if (row[8]) extraData = JSON.parse(row[8]);
        } catch (e) {}

        return {
          id: row[0],
          jenis_pajak: row[1],
          jenis_surat: extraData.jenis_surat || "-",
          periode:
            row[2] === "Tahunan" ? `Tahunan ${row[3]}` : `${row[2]} ${row[3]}`,
          tahun: row[3],
          no_objek: extraData.no_objek || "-",
          model: row[5] === "0" ? "NORMAL" : `PEMBETULAN ${row[5]}`,
          id_billing: extraData.id_billing || "-",
          bpe: extraData.bpe || "-",
          status: (row[4] || "KONSEP").toUpperCase().replace(" ", "_"),
          nominal: parseFloat(extraData.nominal || row[7] || "0"),
          tanggal: row[6],
        };
      })
      .reverse();
  } catch (error) {
    return [];
  }
}

// --- ACTION 2: BUAT SPT (CREATE) ---
export async function createSptAction(data: SptFormData) {
  try {
    const timestamp = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
    const id = "SPT-" + Date.now().toString().slice(-6);

    // Cek apakah ini "Lapor Langsung" atau "Konsep"
    const statusAwal = data.status || "Konsep";

    // Jika Lapor Langsung, Generate BPE
    let bpe = "-";
    if (statusAwal === "DILAPORKAN") {
      const rand = Math.floor(10000000 + Math.random() * 90000000);
      bpe = `S-${rand}/${data.tahun}`;
    }

    const extraData = {
      jenis_surat: data.jenisSurat,
      no_objek: data.noObjek,
      id_billing: "-",
      bpe: bpe,
      nominal: data.nominal || "0",
      source: "Next.js Integrated",
    };

    const newRow = [
      id,
      data.jenisPajak,
      data.masa,
      data.tahun,
      statusAwal, // Status Dinamis
      data.pembetulan || "0",
      timestamp,
      data.nominal || "0", // Total PPh
      JSON.stringify(extraData),
    ];

    const result = await appendSheetData("Data SPT!A:I", [newRow]);

    if (result) {
      revalidatePath("/dashboard/spt");
      revalidatePath("/dashboard/simulasi/coretax");
      return { success: true, message: "Data Berhasil Disimpan!", bpe: bpe };
    } else {
      return { success: false, message: "Gagal koneksi ke Google Sheets." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan server." };
  }
}
