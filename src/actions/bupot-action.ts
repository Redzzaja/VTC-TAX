"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- ACTION 1: AMBIL DATA (READ) ---
export async function getBupotListAction() {
  try {
    // Ambil data urut dari yang terbaru
    const result = await query(
      "SELECT * FROM bupot_21_logs ORDER BY created_at DESC",
    );

    return result.rows.map((row) => ({
      id: row.id,
      bupot_id: row.bupot_id,
      jenis_bupot: row.jenis_bupot || "BP-21", // BP-21 atau BPPU
      masa: row.masa_pajak,
      status: row.status, // 'Draft' atau 'Terbit'
      identitas: {
        npwp: row.npwp || "-",
        nama: row.nama_wp,
      },
      kode_objek: row.kode_objek,
      bruto: Number(row.bruto),
      tarif: row.tarif,
      pph: Number(row.pph_amount),
      tanggal: new Date(row.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));
  } catch (error) {
    console.error("Gagal ambil data Bupot:", error);
    return [];
  }
}

// --- ACTION 2: BUAT/SIMPAN BUKTI POTONG (CREATE) ---
export async function createBupotAction(formData: any) {
  try {
    const prefix = formData.jenis_bupot === "BPPU" ? "UN-" : "BP-";
    const bupotId = prefix + Date.now().toString().slice(-6);
    const masaLengkap = `${formData.masa} ${formData.tahun}`;

    // Parsing Angka
    const bruto = parseFloat(formData.bruto || "0"); // BPPU: Dasar Pengenaan Pajak, BP21: Bruto
    const tarifPersen = parseFloat(formData.tarif || "0");
    const pph = parseFloat(formData.pph || "0"); // Kita ambil langsung dari input (auto-calc di frontend)
    const persentaseDpp = parseFloat(formData.persentase_dpp || "100");

    const statusAwal = formData.status || "Draft";

    await query(
      `INSERT INTO bupot_21_logs 
       (bupot_id, jenis_bupot, masa_pajak, status, npwp, nama_wp, kode_objek, bruto, dpp, tarif, pph_amount, no_dokumen, 
        nitku, status_bupot, jenis_dokumen, tanggal_dokumen, status_ptkp, fasilitas_pajak, persentase_dpp) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        bupotId, // $1
        formData.jenis_bupot, // $2
        masaLengkap, // $3
        statusAwal, // $4
        formData.npwp, // $5
        formData.nama, // $6
        formData.kode, // $7
        bruto, // $8
        bruto, // $9 (Simpan sama dulu untuk simplicity)
        `${tarifPersen}%`, // $10
        pph, // $11
        formData.no_dokumen || "-", // $12
        formData.nitku, // $13
        formData.status_bupot || "Normal", // $14
        formData.jenis_dokumen, // $15
        formData.tanggal_dokumen || null, // $16
        formData.status_ptkp, // $17 (Khusus BP21)
        formData.fasilitas_pajak, // $18 (Khusus BPPU)
        persentaseDpp, // $19 (Khusus BP21)
      ],
    );

    revalidatePath("/dashboard/ebupot21");
    return {
      success: true,
      message: `Bukti Potong (${statusAwal}) Berhasil Disimpan!`,
    };
  } catch (error) {
    console.error("Error create Bupot:", error);
    return { success: false, message: "Terjadi kesalahan server." };
  }
}

export async function approveBupotAction(id: number) {
  try {
    // Ubah status menjadi 'Terbit'
    await query("UPDATE bupot_21_logs SET status = 'Terbit' WHERE id = $1", [
      id,
    ]);

    revalidatePath("/dashboard/ebupot21");
    // Pesan sukses yang akan ditampilkan di Sonner
    return {
      success: true,
      message: "Bukti Potong berhasil diposting dan diterbitkan!",
    };
  } catch (error) {
    console.error("Gagal approve:", error);
    // Pesan error
    return {
      success: false,
      message: "Terjadi kesalahan saat memposting data.",
    };
  }
}

// --- ACTION 3: HAPUS BUPOT (DELETE) - Opsional biar lengkap ---
export async function deleteBupotAction(id: number) {
  try {
    await query("DELETE FROM bupot_21_logs WHERE id = $1", [id]);
    revalidatePath("/dashboard/ebupot21");
    return { success: true, message: "Data berhasil dihapus" };
  } catch (error) {
    return { success: false, message: "Gagal menghapus data" };
  }
}
