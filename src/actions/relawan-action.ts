"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Kita gunakan FormData agar kompatibel dengan 'useActionState' atau <form action>
export async function registerRelawanAction(
  prevState: any,
  formData: FormData,
) {
  try {
    // 0. Ambil Session User
    const cookieStore = await cookies();
    const sessionStr = cookieStore.get("user_session")?.value;
    if (!sessionStr) {
        return { success: false, message: "Anda harus login terlebih dahulu." };
    }
    const session = JSON.parse(sessionStr);

    // 1. Ambil data dari FormData
    const nama = formData.get("nama") as string;
    const nim = formData.get("nim") as string;
    const universitas = formData.get("universitas") as string;
    const jurusan = formData.get("jurusan") as string;
    const semester = formData.get("semester") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const email = formData.get("email") as string;
    const alasan = formData.get("alasan") as string;

    // Validasi sederhana
    if (!nama || !nim || !whatsapp) {
      return {
        success: false,
        message: "Nama, NIM, dan WhatsApp wajib diisi.",
      };
    }

    // 2. Simpan ke Database Neon
    // First get user ID from username
    const userRes = await query("SELECT id FROM users WHERE username = $1", [session.username]);
    if (userRes.rowCount === 0) return { success: false, message: "User tidak ditemukan." };
    const userId = userRes.rows[0].id;

    await query(
      `INSERT INTO volunteer_logs 
       (user_id, nama_lengkap, nim, universitas, jurusan, semester, whatsapp, email, alasan, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'MENUNGGU SELEKSI')`,
      [userId, nama, nim, universitas, jurusan, semester, whatsapp, email, alasan],
    );
    
    // 3. Update Role User menjadi 'relawan'
    await query("UPDATE users SET role = 'relawan' WHERE id = $1", [userId]);
    
    // Update session cookie with new role?
    // Ideally yes, but for now we rely on DB checks or next login.
    // Let's try to update cookie if possible, or just force re-login/refresh?
    // For simplicity, we just update DB. The Sidebar should ideally check DB or refreshed cookie.
    // If Sidebar checks cookie, user needs to re-login to see changes OR we update cookie here.
    const newSession = { ...session, role: 'relawan' };
    cookieStore.set("user_session", JSON.stringify(newSession), {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });

    // 4. Revalidate halaman
    revalidatePath("/dashboard/relawan");
    revalidatePath("/dashboard"); // Sidebar might need update

    return {
      success: true,
      message:
        "Formulir berhasil dikirim! Panitia akan menghubungi Anda via WhatsApp/Email.",
    };
  } catch (error) {
    console.error("Error register relawan:", error);
    return {
      success: false,
      message: "Terjadi kesalahan server saat menyimpan data.",
    };
  }
}

export async function getVolunteersAction(status?: string) {
  try {
    let text = "SELECT * FROM volunteer_logs ORDER BY created_at DESC";
    let params: any[] = [];
    
    if (status) {
      text = "SELECT * FROM volunteer_logs WHERE status = $1 ORDER BY created_at DESC";
      params = [status];
    }

    const res = await query(text, params);
    return { success: true, data: res.rows };
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return { success: false, data: [] };
  }
}

export async function approveVolunteerAction(id: number) {
  try {
    await query("UPDATE volunteer_logs SET status = 'DITERIMA' WHERE id = $1", [id]);
    revalidatePath("/dashboard/admin/approval");
    return { success: true, message: "Relawan diterima." };
  } catch (error) {
    console.error("Error approving volunteer:", error);
    return { success: false, message: "Gagal memproses." };
  }
}

export async function rejectVolunteerAction(id: number) {
  try {
    await query("UPDATE volunteer_logs SET status = 'DITOLAK' WHERE id = $1", [id]);
    revalidatePath("/dashboard/admin/approval");
    return { success: true, message: "Relawan ditolak." };
  } catch (error) {
    console.error("Error rejecting volunteer:", error);
    return { success: false, message: "Gagal memproses." };
  }
}

export async function getVolunteerStatusAction(username: string) {
  try {
    const userRes = await query("SELECT id FROM users WHERE username = $1", [username]);
    if (userRes.rowCount === 0) return { success: false, data: null };
    const userId = userRes.rows[0].id;

    const volRes = await query("SELECT * FROM volunteer_logs WHERE user_id = $1", [userId]);
    if (volRes.rowCount === 0) return { success: true, data: null };

    return { success: true, data: volRes.rows[0] };
  } catch (error) {
    console.error("Error fetching status:", error);
    return { success: false, data: null };
  }
}

export async function submitSelectionTestAction(username: string, score: number) {
  try {
    const userRes = await query("SELECT id FROM users WHERE username = $1", [username]);
    if (userRes.rowCount === 0) return { success: false, message: "User not found" };
    const userId = userRes.rows[0].id;

    await query(
      "UPDATE volunteer_logs SET selection_score = $1, test_taken_at = NOW() WHERE user_id = $2",
      [score, userId]
    );

    revalidatePath("/dashboard/relawan");
    return { success: true, message: "Tes selesai." };
  } catch (error) {
    console.error("Error submitting test:", error);
    return { success: false, message: "Gagal menyimpan hasil tes." };
  }
}

// --- Admin Dashboard Stats ---
export async function getAdminDashboardStatsAction() {
  try {
    // 1. Volunteer Counts by Status
    const statusRes = await query(`
      SELECT status, COUNT(*) as count 
      FROM volunteer_logs 
      GROUP BY status
    `);
    
    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0
    };

    statusRes.rows.forEach(row => {
      if (row.status === 'MENUNGGU SELEKSI') stats.pending = parseInt(row.count);
      if (row.status === 'DITERIMA') stats.approved = parseInt(row.count);
      if (row.status === 'DITOLAK') stats.rejected = parseInt(row.count);
      stats.total += parseInt(row.count);
    });

    // 2. Selection Scores Distribution (Simple buckets)
    const scoreRes = await query(`
        SELECT selection_score FROM volunteer_logs 
        WHERE test_taken_at IS NOT NULL
    `);
    
    // Bucket logic can be done in JS for simplicity or SQL
    const scores = scoreRes.rows.map(r => r.selection_score);

    // 3. Recent Test Takers
    const recentRes = await query(`
        SELECT nama_lengkap, nim, selection_score, test_taken_at 
        FROM volunteer_logs 
        WHERE test_taken_at IS NOT NULL 
        ORDER BY test_taken_at DESC 
        LIMIT 5
    `);

    return { success: true, stats, scores, recent: recentRes.rows };

  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, stats: null };
  }
}
