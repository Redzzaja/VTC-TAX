"use server";

import { query } from "@/lib/db";

// --- 1. AMBIL SOAL TANDING/LATIHAN ---
export async function getLatihanSoalAction() {
  try {
    // Ambil data dari tabel 'bank_soal_tanding'
    // Gunakan ORDER BY RANDOM() untuk mengacak soal langsung dari database
    const result = await query(
      "SELECT * FROM bank_soal_tanding ORDER BY RANDOM() LIMIT 10",
    );

    if (result.rows.length === 0) return { success: false, data: [] };

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
      // Gunakan pembahasan dari database jika ada, atau default text
      discussion:
        row.discussion ||
        "Pembahasan untuk soal ini dapat dipelajari pada Modul PPh Pasal 21.",
    }));

    return { success: true, data: questions };
  } catch (error) {
    console.error("Error get latihan:", error);
    return { success: false, data: [] };
  }
}

// --- 2. SIMPAN SKOR TANDING ---
export async function submitTandingAction(data: any) {
  try {
    // Simpan ke tabel 'hasil_tanding' di Neon
    await query(
      `INSERT INTO hasil_tanding (nama, nim, skor, pelanggaran, status) 
       VALUES ($1, $2, $3, '-', 'Selesai Tanding')`,
      [data.nama, data.nim, data.score],
    );

    return { success: true, message: "Skor tanding berhasil disimpan!" };
  } catch (error) {
    console.error("Gagal simpan skor tanding:", error);
    return { success: false, message: "Gagal menyimpan skor." };
  }
}
