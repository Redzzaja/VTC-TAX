"use server";

import { appendSheetData, getSheetData } from "@/lib/google";
import { revalidatePath } from "next/cache";

// --- ACTION 1: GET DATA (READ) ---
export async function getBillingListAction() {
  try {
    // Ambil data dari sheet "Data Billing"
    const rows = await getSheetData("Data Billing!A2:L");
    if (!rows) return [];

    return rows
      .map((row) => ({
        id: row[0],
        kode_jenis: `${row[3]} / ${row[4]}`, // KAP / KJS
        masa_tahun: `${row[5]} ${row[6]}`,
        nominal: parseFloat(row[7]) || 0,
        uraian: row[8],
        id_billing: row[9],
        masa_aktif: row[10],
        tanggal: row[11],
      }))
      .reverse();
  } catch (error) {
    return [];
  }
}

// --- ACTION 2: CREATE BILLING (WRITE) ---
export async function createBillingAction(formData: any) {
  try {
    const timestamp = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
    const id = "BILL-" + Date.now().toString().slice(-6);

    // Generate ID Billing 15 Digit (Acak, diawali angka 8)
    const idBilling = "8" + Math.random().toString().slice(2, 16);

    // Masa Aktif (30 Hari kedepan)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const expiryStr = expiryDate.toLocaleDateString("id-ID");

    // Kolom: [ID, NPWP, Nama, KAP, KJS, Masa, Tahun, Nominal, Uraian, ID Billing, Masa Aktif, Tanggal]
    const newRow = [
      id,
      formData.npwp,
      formData.nama,
      formData.kap,
      formData.kjs,
      formData.masa,
      formData.tahun,
      formData.nominal,
      formData.uraian,
      idBilling,
      expiryStr,
      timestamp,
    ];

    const result = await appendSheetData("Data Billing!A:L", [newRow]);

    if (result) {
      revalidatePath("/dashboard/billing");
      return {
        success: true,
        message: "Kode Billing berhasil dibuat!",
        id_billing: idBilling,
      };
    } else {
      return { success: false, message: "Gagal koneksi database." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan server." };
  }
}
