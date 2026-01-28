"use server";

import { query } from "@/lib/db";

// --- 1. AMBIL BANK SOAL ---
export async function getQuestionsAction() {
  try {
    // Ambil semua soal dari tabel 'bank_soal'
    // ORDER BY RANDOM() akan mengacak urutan langsung dari database
    const result = await query("SELECT * FROM bank_soal ORDER BY RANDOM()");

    if (result.rows.length === 0) return { success: false, data: [] };

    // Mapping format Database ke format Frontend
    const questions = result.rows.map((row) => ({
      id: row.id,
      question: row.question,
      options: {
        A: row.option_a,
        B: row.option_b,
        C: row.option_c,
        D: row.option_d,
      },
      correct: row.correct_answer?.trim().toUpperCase(),
    }));

    return { success: true, data: questions };
  } catch (error) {
    console.error("Error get questions:", error);
    return { success: false, data: [] };
  }
}

// --- 2. CEK STATUS (SUDAH UJIAN BELUM?) ---
export async function checkStatusAction(nim: string) {
  try {
    // Cek apakah NIM ini sudah ada di tabel 'exam_results'
    const result = await query(
      "SELECT id FROM exam_results WHERE nim = $1 LIMIT 1",
      [nim],
    );

    return { hasTaken: result.rowCount ? result.rowCount > 0 : false };
  } catch (error) {
    console.error("Error check status:", error);
    return { hasTaken: false };
  }
}

// --- 3. SIMPAN HASIL UJIAN ---
export async function submitExamAction(data: any) {
  try {
    // Tentukan Status Lulus/Tidak (Passing Grade 70)
    const statusKelulusan = data.score >= 70 ? "LULUS" : "TIDAK LULUS";

    // Simpan ke database Neon
    await query(
      `INSERT INTO exam_results (nama, nim, skor, status_lulus) 
       VALUES ($1, $2, $3, $4)`,
      [data.nama, data.nim, data.score, statusKelulusan],
    );

    return { success: true, message: "Jawaban tersimpan." };
  } catch (error) {
    console.error("Submit Exam Error:", error);
    return { success: false, message: "Terjadi kesalahan server." };
  }
}
