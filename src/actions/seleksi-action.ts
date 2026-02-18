"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
    console.error("Error submitting exam:", error);
    return { success: false, message: "Terjadi kesalahan server." };
  }
}

// --- 4. CRUD BANK SOAL (ADMIN) ---

export async function createQuestionAction(data: any) {
  try {
    await query(
      `INSERT INTO bank_soal (question, option_a, option_b, option_c, option_d, correct_answer)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        data.question,
        data.option_a,
        data.option_b,
        data.option_c,
        data.option_d,
        data.correct_answer,
      ]
    );
    revalidatePath("/dashboard/admin/seleksi-soal");
    return { success: true, message: "Soal berhasil ditambahkan." };
  } catch (error) {
    console.error("Error creating question:", error);
    return { success: false, message: "Gagal menambahkan soal." };
  }
}

export async function updateQuestionAction(id: number, data: any) {
  try {
    await query(
      `UPDATE bank_soal 
       SET question = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_answer = $6
       WHERE id = $7`,
      [
        data.question,
        data.option_a,
        data.option_b,
        data.option_c,
        data.option_d,
        data.correct_answer,
        id,
      ]
    );
    revalidatePath("/dashboard/admin/seleksi-soal");
    return { success: true, message: "Soal berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating question:", error);
    return { success: false, message: "Gagal memperbarui soal." };
  }
}

export async function deleteQuestionAction(id: number) {
  try {
    await query("DELETE FROM bank_soal WHERE id = $1", [id]);
    revalidatePath("/dashboard/admin/seleksi-soal");
    return { success: true, message: "Soal berhasil dihapus." };
  } catch (error) {
    console.error("Error deleting question:", error);
    return { success: false, message: "Gagal menghapus soal." };
  }
}

