"use server";

import { appendSheetData, getSheetData } from "@/lib/google";
import { revalidatePath } from "next/cache";

// --- ACTION 1: AMBIL DATA (READ) ---
export async function getBupotListAction() {
  try {
    // Ambil data dari sheet "Data BP21" (Mulai baris 2)
    const rows = await getSheetData("Data BP21!A2:L");
    if (!rows) return [];

    // Mapping Array ke Object
    // Format Kolom Sheet: [ID, Masa, Status, NPWP, Nama, Kode, Bruto, DPP, Tarif, PPh, No Dok, Tanggal]
    return rows
      .map((row) => ({
        id: row[0],
        masa: row[1],
        status: row[2],
        identitas: {
          npwp: row[3]?.replace("'", ""), // Hapus tanda petik jika ada
          nama: row[4],
        },
        kode_objek: row[5],
        bruto: parseFloat(row[6]) || 0,
        tarif: row[8],
        pph: parseFloat(row[9]) || 0,
        tanggal: row[11],
      }))
      .reverse(); // Data terbaru di atas
  } catch (error) {
    return [];
  }
}

// --- ACTION 2: BUAT BUKTI POTONG (CREATE) ---
export async function createBupotAction(formData: any) {
  try {
    const timestamp = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
    const id = "BP-" + Date.now().toString().slice(-6);

    // Hitung Pajak Otomatis
    const bruto = parseFloat(formData.bruto);
    const tarifPersen = parseFloat(formData.tarif); // Misal 5
    const tarifDesimal = tarifPersen / 100; // Jadi 0.05
    const pph = Math.floor(bruto * tarifDesimal);

    // Format Baris untuk Google Sheet
    const newRow = [
      id,
      `${formData.masa} ${formData.tahun}`, // Kolom Masa
      "Belum Lapor", // Status Awal
      `'${formData.npwp}`, // NPWP (pakai ' biar string)
      formData.nama,
      formData.kode, // Kode Objek Pajak
      bruto,
      bruto, // DPP (Anggap sama dgn Bruto untuk PPh 21)
      `${tarifPersen}%`, // Tarif Teks
      pph,
      "-", // No Dokumen (Kosong dulu)
      timestamp,
    ];

    const result = await appendSheetData("Data BP21!A:L", [newRow]);

    if (result) {
      revalidatePath("/dashboard/ebupot21");
      return { success: true, message: "Bukti Potong Berhasil Dibuat!" };
    } else {
      return { success: false, message: "Gagal koneksi database." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan server." };
  }
}
