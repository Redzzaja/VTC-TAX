/**
 * ============================================================
 *  VTC-TAX  —  Setup Database (Single Script)
 * ============================================================
 *  Script ini membuat SEMUA tabel yang dibutuhkan aplikasi.
 *  Cukup jalankan sekali saja:
 *
 *    npx ts-node src/scripts/setup-db.ts
 *
 *  ⚠️  Aman dijalankan berulang kali karena menggunakan
 *      CREATE TABLE IF NOT EXISTS & ADD COLUMN IF NOT EXISTS.
 * ============================================================
 */

import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function setupDatabase() {
  const client = await pool.connect();

  try {
    console.log("🚀 Memulai Setup Database...\n");

    // ─────────────────────────────────────────────
    // 1. users — Akun Login & Gamifikasi
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        level INT DEFAULT 1,
        xp INT DEFAULT 0,
        badges JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✅ Tabel 'users' siap.");

    // ─────────────────────────────────────────────
    // 2. volunteer_logs — Data Mahasiswa/Relawan
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS volunteer_logs (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        nim VARCHAR(20) UNIQUE,
        nama_lengkap VARCHAR(100),
        email VARCHAR(100),
        jurusan VARCHAR(100),
        angkatan VARCHAR(4),
        status_seleksi VARCHAR(20) DEFAULT 'Pending',
        aktivitas_terakhir TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✅ Tabel 'volunteer_logs' siap.");

    // ─────────────────────────────────────────────
    // 3. bank_soal — Bank Soal Ujian
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS bank_soal (
        id SERIAL PRIMARY KEY,
        pertanyaan TEXT NOT NULL,
        opsi_a VARCHAR(255),
        opsi_b VARCHAR(255),
        opsi_c VARCHAR(255),
        opsi_d VARCHAR(255),
        kunci_jawaban CHAR(1),
        kategori VARCHAR(50) DEFAULT 'Umum',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✅ Tabel 'bank_soal' siap.");

    // ─────────────────────────────────────────────
    // 4. exam_results — Hasil Ujian/Seleksi
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS exam_results (
        id SERIAL PRIMARY KEY,
        user_id INT,
        nama_peserta VARCHAR(100),
        skor_akhir INT DEFAULT 0,
        jumlah_benar INT DEFAULT 0,
        jumlah_salah INT DEFAULT 0,
        tanggal_ujian TIMESTAMP DEFAULT NOW(),
        status_kelulusan VARCHAR(20)
      );
    `);
    console.log("  ✅ Tabel 'exam_results' siap.");

    // ─────────────────────────────────────────────
    // 5. spt_logs — Simulasi Coretax SPT
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS spt_logs (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        jenis_spt VARCHAR(100) NOT NULL,
        masa VARCHAR(20) NOT NULL,
        tahun VARCHAR(10) NOT NULL,
        pembetulan INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Draft',
        nominal NUMERIC(15, 2) DEFAULT 0,
        data_json JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✅ Tabel 'spt_logs' siap.");

    // ─────────────────────────────────────────────
    // 6. billing_data — Simulasi E-Billing
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS billing_data (
        id SERIAL PRIMARY KEY,
        id_billing VARCHAR(20) UNIQUE NOT NULL,
        npwp VARCHAR(20),
        nama_wp VARCHAR(100),
        kode_jenis_pajak VARCHAR(10),
        kode_jenis_setoran VARCHAR(10),
        masa_pajak VARCHAR(20),
        tahun_pajak VARCHAR(4),
        nominal NUMERIC(15, 2),
        uraian TEXT,
        masa_aktif TIMESTAMP,
        status VARCHAR(20) DEFAULT 'Belum Bayar',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✅ Tabel 'billing_data' siap.");

    // ─────────────────────────────────────────────
    // 7. faktur_logs — Simulasi E-Faktur
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS faktur_logs (
        id SERIAL PRIMARY KEY,
        nsfp VARCHAR(30) UNIQUE NOT NULL,
        lawan_transaksi VARCHAR(100),
        tanggal DATE,
        dpp NUMERIC(15, 2),
        ppn NUMERIC(15, 2),
        total NUMERIC(15, 2),
        status VARCHAR(20) DEFAULT 'Approval Sukses',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✅ Tabel 'faktur_logs' siap.");

    // ─────────────────────────────────────────────
    // 8. bupot_21_logs — Simulasi Bukti Potong
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS bupot_21_logs (
        id SERIAL PRIMARY KEY,
        bupot_id VARCHAR(50),
        masa_pajak VARCHAR(20),
        npwp VARCHAR(20),
        nama_wp VARCHAR(100),
        kode_objek VARCHAR(20),
        bruto NUMERIC(15, 2),
        pph_amount NUMERIC(15, 2),
        status VARCHAR(20) DEFAULT 'Terbit',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✅ Tabel 'bupot_21_logs' siap.");

    // ─────────────────────────────────────────────
    // 9. ter_logs — Riwayat Kalkulator TER
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS ter_logs (
        id SERIAL PRIMARY KEY,
        gaji_bruto NUMERIC(15, 2) NOT NULL,
        status_ptkp VARCHAR(10),
        kategori_ter VARCHAR(5),
        tarif NUMERIC(5, 2),
        potongan_pph NUMERIC(15, 2),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✅ Tabel 'ter_logs' siap.");

    // ─────────────────────────────────────────────
    // 10. materials — Materi Belajar
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        type VARCHAR(50),
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("  ✅ Tabel 'materials' siap.");

    // ─────────────────────────────────────────────
    // 11. quiz_levels — Level Kuis
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_levels (
        id SERIAL PRIMARY KEY,
        level_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(level_number)
      );
    `);
    console.log("  ✅ Tabel 'quiz_levels' siap.");

    // ─────────────────────────────────────────────
    // 12. quiz_sub_levels — Sub-Level Kuis
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_sub_levels (
        id SERIAL PRIMARY KEY,
        level_id INT REFERENCES quiz_levels(id) ON DELETE CASCADE,
        sub_level_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        min_score_to_pass INT DEFAULT 70,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(level_id, sub_level_number)
      );
    `);
    console.log("  ✅ Tabel 'quiz_sub_levels' siap.");

    // ─────────────────────────────────────────────
    // 13. quiz_questions — Soal Kuis
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        sub_level_id INT REFERENCES quiz_sub_levels(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_answer VARCHAR(255) NOT NULL,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("  ✅ Tabel 'quiz_questions' siap.");

    // ─────────────────────────────────────────────
    // 14. user_progress — Progres Kuis Pengguna
    // ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        sub_level_id INT REFERENCES quiz_sub_levels(id) ON DELETE CASCADE,
        score INT,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        UNIQUE(user_id, sub_level_id)
      );
    `);
    console.log("  ✅ Tabel 'user_progress' siap.");

    // ═════════════════════════════════════════════
    //  SEED DATA — Isi data awal jika tabel kosong
    // ═════════════════════════════════════════════
    const levelCheck = await client.query("SELECT COUNT(*) FROM quiz_levels");
    if (parseInt(levelCheck.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO quiz_levels (level_number, title, description) VALUES
        (1, 'Dasar Perpajakan', 'Pengenalan dasar-dasar perpajakan di Indonesia.'),
        (2, 'PPh 21', 'Pendalaman mengenai Pajak Penghasilan Pasal 21.');
      `);
      console.log("\n  🌱 Seed: Level kuis awal berhasil ditambahkan.");

      const lvl1 = await client.query("SELECT id FROM quiz_levels WHERE level_number = 1");
      const lvl1Id = lvl1.rows[0].id;

      const subLevelsValues = [];
      for (let i = 1; i <= 10; i++) {
        subLevelsValues.push(`(${lvl1Id}, ${i}, 'Materi Dasar ${i}', 70)`);
      }
      await client.query(`
        INSERT INTO quiz_sub_levels (level_id, sub_level_number, title, min_score_to_pass)
        VALUES ${subLevelsValues.join(", ")}
      `);
      console.log("  🌱 Seed: Sub-level untuk Level 1 berhasil ditambahkan.");
    }

    console.log("\n════════════════════════════════════════════");
    console.log("  ✅ SUKSES: Semua 14 tabel berhasil dibuat!");
    console.log("════════════════════════════════════════════\n");
  } catch (err) {
    console.error("\n❌ Setup Database Gagal:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
