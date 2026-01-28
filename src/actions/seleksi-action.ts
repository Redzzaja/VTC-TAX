"use server";

import { getSheetData, appendSheetData } from "@/lib/google";

// --- 1. AMBIL BANK SOAL ---
export async function getQuestionsAction() {
  try {
    // Ambil data dari sheet 'Bank Soal' range A2:G (ID, Tanya, A, B, C, D, Kunci)
    const rows = await getSheetData("Bank Soal!A2:G");

    if (!rows || rows.length === 0) return { success: false, data: [] };

    // Format data agar mudah dipakai di frontend
    const questions = rows.map((row) => ({
      id: row[0],
      question: row[1],
      options: {
        A: row[2],
        B: row[3],
        C: row[4],
        D: row[5],
      },
      correct: row[6]?.trim().toUpperCase(), // Kunci Jawaban (misal: "A")
    }));

    // Acak urutan soal (Optional, biar tidak nyontek urutan)
    return { success: true, data: questions.sort(() => Math.random() - 0.5) };
  } catch (error) {
    console.error("Error get questions:", error);
    return { success: false, data: [] };
  }
}

// --- 2. CEK STATUS (SUDAH UJIAN BELUM?) ---
export async function checkStatusAction(nim: string) {
  try {
    // Cek di sheet 'Hasil Seleksi Relawan'
    const rows = await getSheetData("Hasil Seleksi Relawan!A2:B");
    if (!rows) return { hasTaken: false };

    // Cek apakah NIM ada di kolom Identitas (Format: "Nama - NIM")
    const found = rows.some((row) => row[1]?.includes(nim));

    return { hasTaken: found };
  } catch (error) {
    return { hasTaken: false };
  }
}

// --- 3. SIMPAN HASIL UJIAN ---
export async function submitExamAction(data: any) {
  try {
    const timestamp = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });

    // Tentukan Status Lulus/Tidak (Passing Grade misal 70)
    const statusKelulusan = data.score >= 70 ? "LULUS" : "TIDAK LULUS";

    // Kolom: [Timestamp, Identitas, Skor Akhir, Status Kelulusan, Jml Pelanggaran, Keterangan]
    const newRow = [
      timestamp,
      `${data.nama} - ${data.nim}`, // Format Identitas gabung
      data.score,
      statusKelulusan,
      "0", // Default pelanggaran 0
      "Selesai Ujian Online",
    ];

    const result = await appendSheetData("Hasil Seleksi Relawan!A:F", [newRow]);

    if (result) {
      return { success: true, message: "Jawaban tersimpan." };
    } else {
      return { success: false, message: "Gagal koneksi database." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan server." };
  }
}
