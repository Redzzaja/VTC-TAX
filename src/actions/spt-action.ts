"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- 1. AMBIL LIST SPT ---
export async function getSptListAction() {
  try {
    const res = await query("SELECT * FROM spt_logs ORDER BY created_at DESC");
    return res.rows.map((row) => ({
      id: row.id,
      jenis: row.jenis_spt,
      masa: row.masa,
      tahun: row.tahun,
      pembetulan: row.pembetulan,
      status: row.status,
      nominal: Number(row.nominal),
      tanggal: new Date(row.created_at).toLocaleDateString("id-ID"),
    }));
  } catch (error) {
    console.error("Gagal ambil SPT:", error);
    return [];
  }
}

// --- 2. SIMPAN DRAFT SPT (WIZARD - AUTO SYNC) ---
export async function saveSptDraftAction(data: any) {
  try {
    // A. Cek apakah ada data E-Bupot 'Terbit' di periode ini
    const masaLengkap = `${data.masa} ${data.tahun}`;

    // Hitung total PPh dari tabel bupot_21_logs
    const hitungRes = await query(
      `SELECT SUM(pph_amount) as total 
       FROM bupot_21_logs 
       WHERE masa_pajak = $1 AND status = 'Terbit'`,
      [masaLengkap],
    );

    const totalPph = Number(hitungRes.rows[0].total || 0);

    // B. Simpan Header SPT ke database
    await query(
      `INSERT INTO spt_logs (jenis_spt, masa, tahun, pembetulan, status, nominal)
       VALUES ($1, $2, $3, $4, 'Draft', $5)`,
      [data.jenisPajak, data.masa, data.tahun, data.pembetulan, totalPph],
    );

    revalidatePath("/dashboard/spt");
    return {
      success: true,
      message: `Konsep Terbentuk. Total PPh: Rp ${totalPph.toLocaleString("id-ID")}`,
    };
  } catch (error) {
    console.error("Gagal simpan SPT:", error);
    return { success: false, message: "Gagal menyimpan draft SPT." };
  }
}

// --- 3. HAPUS SPT ---
export async function deleteSptAction(id: number) {
  try {
    await query("DELETE FROM spt_logs WHERE id = $1", [id]);
    revalidatePath("/dashboard/spt");
    return { success: true, message: "SPT berhasil dihapus." };
  } catch (error) {
    return { success: false, message: "Gagal menghapus SPT." };
  }
}

// --- 4. AMBIL DETAIL SPT (UNTUK TABEL LAMPIRAN) ---
export async function getSptDetailAction(masa: string, tahun: string) {
  try {
    const masaLengkap = `${masa} ${tahun}`;

    // Ambil rincian Bukti Potong
    const bupotRes = await query(
      `SELECT * FROM bupot_21_logs 
         WHERE masa_pajak = $1 AND status = 'Terbit'`,
      [masaLengkap],
    );

    const listBuktiPotong = bupotRes.rows.map((row) => ({
      npwp: row.npwp,
      nama: row.nama_wp,
      buktiPotong: row.bupot_id,
      bruto: Number(row.bruto),
      pph: Number(row.pph_amount),
      kode: row.kode_objek,
    }));

    // Hitung Ringkasan untuk Induk
    const pegawaiTetap = listBuktiPotong
      .filter((i) => i.kode === "21-100-01")
      .reduce((sum, i) => sum + i.pph, 0);

    const pensiun = listBuktiPotong
      .filter((i) => i.kode === "21-100-02")
      .reduce((sum, i) => sum + i.pph, 0);

    const tidakTetap = listBuktiPotong
      .filter((i) => i.kode === "21-100-03")
      .reduce((sum, i) => sum + i.pph, 0);

    return {
      success: true,
      data: {
        pegawaiTetap,
        pensiun,
        tidakTetap,
        listBuktiPotong,
      },
    };
  } catch (error) {
    return { success: false, message: "Gagal ambil detail." };
  }
}
