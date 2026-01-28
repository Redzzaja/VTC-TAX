"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- ACTION 1: GET DATA (READ) ---
export async function getBillingListAction() {
  try {
    // UPDATE: Mengambil data dari tabel 'billing_data'
    const result = await query(
      "SELECT * FROM billing_data ORDER BY created_at DESC",
    );

    return result.rows.map((row) => ({
      id: row.id.toString(),
      kode_jenis: `${row.kode_jenis_pajak} / ${row.kode_jenis_setoran}`, // KAP / KJS
      masa_tahun: `${row.masa_pajak} ${row.tahun_pajak}`,
      nominal: Number(row.nominal || 0),
      uraian: row.uraian || "-",
      id_billing: row.id_billing,
      // Format Tanggal Expired (Masa Aktif)
      masa_aktif: row.masa_aktif
        ? new Date(row.masa_aktif).toLocaleDateString("id-ID")
        : "-",
      // Format Tanggal Pembuatan
      tanggal: new Date(row.created_at).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  } catch (error) {
    console.error("Gagal ambil list billing:", error);
    return [];
  }
}

// --- ACTION 2: CREATE BILLING (WRITE) ---
export async function createBillingAction(formData: any) {
  try {
    // 1. Generate ID Billing 15 Digit (Acak, diawali angka 8)
    const idBilling = "8" + Math.random().toString().slice(2, 16);

    // 2. Hitung Masa Aktif (30 Hari kedepan)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // 3. Simpan ke Database Neon (Tabel: billing_data)
    await query(
      `INSERT INTO billing_data 
       (id_billing, npwp, nama_wp, kode_jenis_pajak, kode_jenis_setoran, masa_pajak, tahun_pajak, nominal, uraian, masa_aktif, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Belum Bayar')`,
      [
        idBilling, // $1
        formData.npwp, // $2
        formData.nama, // $3
        formData.kap, // $4
        formData.kjs, // $5
        formData.masa, // $6
        formData.tahun, // $7
        formData.nominal, // $8
        formData.uraian, // $9
        expiryDate, // $10
      ],
    );

    revalidatePath("/dashboard/billing");

    return {
      success: true,
      message: "Kode Billing berhasil dibuat!",
      id_billing: idBilling,
    };
  } catch (error) {
    console.error("Gagal buat billing:", error);
    return { success: false, message: "Terjadi kesalahan server." };
  }
}
