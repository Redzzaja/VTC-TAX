import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Wajib untuk Neon/Supabase
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log("🚀 Memulai Inisialisasi Database (9 Tabel Pilihan)...");

    // ===========================================
    // 1. users (Akun Login & Gamifikasi)
    // ===========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user', -- 'admin', 'mahasiswa', 'relawan'
        level INT DEFAULT 1,
        xp INT DEFAULT 0,
        badges JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ===========================================
    // 2. volunteer_logs (Data Mahasiswa/Relawan)
    // ===========================================
    // Menggantikan fungsi tabel 'students'
    await client.query(`
      CREATE TABLE IF NOT EXISTS volunteer_logs (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE, -- Relasi ke users
        nim VARCHAR(20) UNIQUE,
        nama_lengkap VARCHAR(100),
        email VARCHAR(100),
        jurusan VARCHAR(100),
        angkatan VARCHAR(4),
        status_seleksi VARCHAR(20) DEFAULT 'Pending', -- 'Lolos', 'Gagal', 'Pending'
        aktivitas_terakhir TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ===========================================
    // 3. bank_soal (Bank Soal Ujian)
    // ===========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS bank_soal (
        id SERIAL PRIMARY KEY,
        pertanyaan TEXT NOT NULL,
        opsi_a VARCHAR(255),
        opsi_b VARCHAR(255),
        opsi_c VARCHAR(255),
        opsi_d VARCHAR(255),
        kunci_jawaban CHAR(1), -- 'A', 'B', 'C', 'D'
        kategori VARCHAR(50) DEFAULT 'Umum', -- 'PPh', 'PPN', 'KUP'
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ===========================================
    // 4. exam_results (Hasil Ujian/Seleksi)
    // ===========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS exam_results (
        id SERIAL PRIMARY KEY,
        user_id INT, 
        nama_peserta VARCHAR(100),
        skor_akhir INT DEFAULT 0,
        jumlah_benar INT DEFAULT 0,
        jumlah_salah INT DEFAULT 0,
        tanggal_ujian TIMESTAMP DEFAULT NOW(),
        status_kelulusan VARCHAR(20) -- 'Lulus', 'Tidak Lulus'
      );
    `);

    // ===========================================
    // 5. spt_logs (Simulasi Coretax SPT)
    // ===========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS spt_logs (
        id SERIAL PRIMARY KEY,
        jenis_spt VARCHAR(100) NOT NULL,
        masa VARCHAR(20) NOT NULL,
        tahun VARCHAR(10) NOT NULL,
        pembetulan INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Draft',
        nominal NUMERIC(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ===========================================
    // 6. billing_data (Simulasi E-Billing)
    // ===========================================
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

    // ===========================================
    // 7. faktur_logs (Simulasi E-Faktur)
    // ===========================================
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

    // ===========================================
    // 8. bupot_21_logs (Simulasi Bukti Potong)
    // ===========================================
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

    // ===========================================
    // 9. ter_logs (Riwayat Kalkulator TER)
    // ===========================================
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

    console.log("✅ SUKSES: 9 Tabel Pilihan Berhasil Dibuat di PostgreSQL!");
  } catch (err) {
    console.error("❌ Gagal Inisialisasi Database:", err);
  } finally {
    client.release();
  }
}

initializeDatabase();
