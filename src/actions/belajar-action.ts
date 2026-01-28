"use server";

import { getSheetData, appendSheetData } from "@/lib/google";

// --- 1. AMBIL SOAL TANDING/LATIHAN ---
export async function getLatihanSoalAction() {
  try {
    // Ambil data dari sheet 'Bank Soal Tanding'
    // Kolom: [ID, Pertanyaan, Opsi A, Opsi B, Opsi C, Opsi D, Kunci]
    const rows = await getSheetData("Bank Soal Tanding!A2:G");

    if (!rows || rows.length === 0) return { success: false, data: [] };

    const questions = rows.map((row) => ({
      id: row[0],
      question: row[1],
      options: {
        A: row[2],
        B: row[3],
        C: row[4],
        D: row[5],
      },
      correct: row[6]?.trim().toUpperCase(),
      discussion:
        "Pembahasan untuk soal ini dapat dipelajari pada Modul PPh Pasal 21.", // Simulasi pembahasan
    }));

    // Acak soal untuk variasi
    return { success: true, data: questions.sort(() => Math.random() - 0.5) };
  } catch (error) {
    console.error("Error get latihan:", error);
    return { success: false, data: [] };
  }
}

// --- 2. SIMPAN SKOR TANDING ---
export async function submitTandingAction(data: any) {
  try {
    const timestamp = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });

    // Kolom: [Timestamp, Nama Peserta, NIM, Skor Akhir, Pelanggaran, Status]
    const newRow = [
      timestamp,
      data.nama,
      `'${data.nim}`,
      data.score,
      "-", // Pelanggaran
      "Selesai Tanding",
    ];

    await appendSheetData("Hasil Tanding VTC!A:F", [newRow]);
    return { success: true, message: "Skor tanding berhasil disimpan!" };
  } catch (error) {
    return { success: false, message: "Gagal menyimpan skor." };
  }
}
