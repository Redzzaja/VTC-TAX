"use server";

import { appendSheetData, getSheetData } from "@/lib/google";
import { revalidatePath } from "next/cache";

export async function getFakturListAction() {
  try {
    const rows = await getSheetData("Data Faktur!A2:J"); // Sesuaikan range
    if (!rows) return [];
    return rows
      .map((row) => ({
        id: row[0],
        jenis: row[1], // Keluaran / Masukan
        lawan_transaksi: row[2],
        nsfp: row[3],
        tanggal: row[4],
        dpp: parseFloat(row[5]) || 0,
        ppn: parseFloat(row[6]) || 0,
        total: parseFloat(row[7]) || 0,
        status: row[8], // Approval Sukses / Reject
      }))
      .reverse();
  } catch (error) {
    return [];
  }
}

export async function createFakturAction(formData: any) {
  try {
    const timestamp = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
    const id = "FK-" + Date.now();

    // Generate NSFP Dummy (010.000-24.xxxxxxxx)
    const nsfp = "010.000-24." + Math.random().toString().slice(2, 10);

    // Hitung PPN (Tarif 11% atau 12%)
    const dpp = parseFloat(formData.dpp);
    const tarif = 0.11; // Default 11%
    const ppn = Math.floor(dpp * tarif);
    const total = dpp + ppn;

    const newRow = [
      id,
      "Faktur Keluaran",
      formData.pembeli,
      nsfp,
      timestamp.split(",")[0], // Tanggal saja
      dpp,
      ppn,
      total,
      "Approval Sukses", // Status
      JSON.stringify({ barang: formData.barang }), // Detail Barang
    ];

    const result = await appendSheetData("Data Faktur!A:J", [newRow]);

    if (result) {
      revalidatePath("/dashboard/efaktur");
      return {
        success: true,
        message: "Faktur Berhasil Diupload!",
        nsfp: nsfp,
      };
    }
    return { success: false, message: "Gagal koneksi." };
  } catch (error) {
    return { success: false, message: "Server Error" };
  }
}
