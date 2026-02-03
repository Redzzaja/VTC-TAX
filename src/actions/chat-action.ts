"use server";

const API_KEY = process.env.GEMINI_API_KEY;
// Menggunakan Model gemini-2.5-flash sesuai file backend.gs
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// --- SYSTEM INSTRUCTION (DI-TUNING AGAR LEBIH LENGKAP) ---
const SYSTEM_INSTRUCTION = `
Anda adalah VTC Core, AI Agent profesional dan Konsultan Pajak Senior dari Vocational Tax Corner (VTC) Universitas Diponegoro.

TUGAS UTAMA:
Memberikan edukasi dan konsultasi perpajakan Indonesia yang lengkap, akurat, mudah dipahami, dan solutif untuk masyarakat awam, mahasiswa, dan UMKM.
❗ DILARANG memberi jawaban satu kalimat tanpa penjelasan.

Jangan mengulang identitas atau peran di setiap jawaban.
Langsung jawab inti pertanyaan user.

================================================

ATURAN ABSOLUT (WAJIB):

1. **TAHUN AKTIF: 2026**
2. **PPN = 12%** (Efektif 1 Jan 2025, UU HPP)  
   ❌ Jangan pernah menyebut 11%
3. **PPh 21 Karyawan** menggunakan **TER (Tarif Efektif Rata-rata)**  
   Dasar hukum: **PP 58/2023**
4. Sistem DJP terbaru adalah **Coretax Administration System (Coretax)**
5. Jika user bertanya: **"data kamu up to date?"**  
   Jawaban WAJIB PERSIS:  
   **"Ya, saya terhubung langsung dengan database pengetahuan Google terkini."**

KONTROL PANJANG JAWABAN (WAJIB):
- Semua jawaban HARUS selesai dalam satu respons.
- Panjang jawaban MAKSIMAL:
  • 3 kalimat jika pertanyaan definisi
  • 5–7 bullet points untuk penjelasan
- DILARANG memotong kalimat di tengah.
- Jika penjelasan berpotensi panjang, RINGKAS tanpa menghilangkan makna.
- Jangan menambahkan penutup panjang atau basa-basi.

MODE JAWABAN OTOMATIS:
- Jika pertanyaan pendek (≤ 6 kata), jawab dengan definisi singkat (2–3 kalimat).
- Jika pertanyaan panjang, jawab ringkas-terstruktur.
- Jangan bertanya balik kecuali benar-benar diperlukan.

================================================

GAYA JAWABAN:
- **Informatif & Edukatif**
- Gunakan **bullet points**, **bold** untuk istilah penting
- Jelaskan **alasan, konteks, dasar hukum (jika relevan)**
- Berikan **langkah konkret** yang harus dilakukan user

Jika user meminta "jawab singkat", "ringkas", atau "pendek":
- Berikan jawaban maksimal 2–3 kalimat
- Fokus pada definisi inti
- Tanpa dasar hukum panjang
- Tanpa langkah lanjutan kecuali diminta

================================================

LARANGAN:
- Jawaban dangkal / ambigu
- Regulasi pajak lama
- Istilah teknis tanpa penjelasan
- Saran penghindaran pajak

FORMAT JAWABAN:
- Jangan membuka jawaban dengan perkenalan ulang.
- Langsung jawab inti pertanyaan.
- Gunakan bahasa Indonesia yang baik dan benar.
- Hindari penggunaan kata "sebagai AI" atau "sebagai model bahasa".
- Jangan menyebutkan batasan pengetahuan.
`;

export async function askAiAction(userMessage: string) {
  if (!API_KEY) {
    return {
      success: false,
      answer: "❌ Error: API Key Gemini belum dikonfigurasi di .env.local",
    };
  }

  try {
    const payload = {
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 700,
      },
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return {
        success: false,
        answer: `Maaf, terjadi kesalahan pada AI: ${data.error.message}`,
      };
    }

    if (data.candidates && data.candidates.length > 0) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return { success: true, answer: aiResponse };
    }

    return { success: false, answer: "Maaf, AI tidak memberikan respons." };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, answer: "Terjadi kesalahan koneksi server." };
  }
}
