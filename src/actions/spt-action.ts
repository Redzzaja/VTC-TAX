"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- 1. AMBIL LIST SPT ---
export async function getSptListAction() {
  try {
    const res = await query("SELECT * FROM spt_logs ORDER BY created_at DESC");
    return res.rows.map((row) => ({
      id: row.id,
      jenis: row.jenis_spt, // Mapping snake_case DB ke camelCase UI
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

// --- 2. SIMPAN DRAFT SPT (CREATE) ---
export async function saveSptDraftAction(data: any) {
  try {
    // Validasi Data
    if (!data.jenisPajak || !data.masa || !data.tahun) {
      throw new Error("Data tidak lengkap (Jenis, Masa, atau Tahun kosong)");
    }

    const masaLengkap = `${data.masa} ${data.tahun}`;

    // Hitung Nominal Otomatis dari E-Bupot (Jika ada)
    const hitungRes = await query(
      `SELECT SUM(pph_amount) as total 
       FROM bupot_21_logs 
       WHERE masa_pajak = $1 AND status = 'Terbit'`,
      [masaLengkap],
    );

    const totalPph = Number(hitungRes.rows[0]?.total || 0);

    // Simpan ke Database
    await query(
      `INSERT INTO spt_logs (jenis_spt, masa, tahun, pembetulan, status, nominal)
       VALUES ($1, $2, $3, $4, 'Draft', $5)`,
      [data.jenisPajak, data.masa, data.tahun, data.pembetulan, totalPph],
    );

    // Refresh halaman terkait
    revalidatePath("/dashboard/spt");
    revalidatePath("/dashboard/simulasi/coretax");

    return {
      success: true,
      message: `Konsep Terbentuk. Total PPh: Rp ${totalPph.toLocaleString("id-ID")}`,
    };
  } catch (error: any) {
    console.error("Gagal simpan SPT:", error);
    return {
      success: false,
      message: error.message || "Gagal menyimpan draft SPT.",
    };
  }
}

// --- 3. HAPUS SPT ---
export async function deleteSptAction(id: number) {
  try {
    await query("DELETE FROM spt_logs WHERE id = $1", [id]);
    revalidatePath("/dashboard/spt");
    revalidatePath("/dashboard/simulasi/coretax");
    return { success: true, message: "SPT berhasil dihapus." };
  } catch (error) {
    return { success: false, message: "Gagal menghapus SPT." };
  }
}

// --- 4. AMBIL DETAIL SPT (UNTUK LAMPIRAN & POPUP) ---
// Fungsi ini yang sebelumnya hilang/error
export async function getSptDetailAction(masa: string, tahun: string) {
  try {
    const masaLengkap = `${masa} ${tahun}`;

    // Ambil rincian Bukti Potong dari tabel bupot
    const bupotRes = await query(
      `SELECT * FROM bupot_21_logs 
         WHERE masa_pajak = $1 AND status = 'Terbit'`,
      [masaLengkap],
    );

    const listBuktiPotong = bupotRes.rows.map((row) => ({
      npwp: row.npwp || "-",
      nama: row.nama_wp || "Tanpa Nama",
      buktiPotong: row.bupot_id,
      bruto: Number(row.bruto),
      pph: Number(row.pph_amount),
      kode: row.kode_objek,
    }));

    // Hitung Ringkasan untuk Form Induk
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
    console.error("Gagal detail SPT:", error);
    return { success: false, message: "Gagal ambil detail." };
  }
}
