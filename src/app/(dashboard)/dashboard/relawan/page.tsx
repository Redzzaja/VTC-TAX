"use client";

import { useActionState } from "react"; // Hook wajib untuk action server
import { registerRelawanAction } from "@/actions/relawan-action";
import { UploadCloud, Send } from "lucide-react";

const initialState = {
  success: false,
  message: "",
};

export default function RelawanPage() {
  // Gunakan hook ini agar cocok dengan signature action (prevState, formData)
  const [state, formAction, isPending] = useActionState(
    registerRelawanAction,
    initialState,
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pendaftaran Relawan Pajak 🚀
        </h1>
        <p className="text-gray-500">
          Bergabunglah menjadi bagian dari Relawan Pajak untuk Negeri.
        </p>

        {/* Tampilkan Pesan Sukses/Gagal */}
        {state?.message && (
          <div
            className={`mt-4 p-4 rounded-lg text-sm font-medium ${
              state.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                name="nama"
                type="text"
                required
                placeholder="Sesuai KTP"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* NIM */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">NIM</label>
              <input
                name="nim"
                type="text"
                required
                placeholder="Nomor Induk Mahasiswa"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Universitas */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Asal Kampus
              </label>
              <input
                name="universitas"
                type="text"
                required
                placeholder="Nama Universitas"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Jurusan */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Jurusan / Prodi
              </label>
              <input
                name="jurusan"
                type="text"
                required
                placeholder="Contoh: D3 Perpajakan"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Semester Saat Ini
              </label>
              <select
                name="semester"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="3">Semester 3</option>
                <option value="5">Semester 5</option>
                <option value="7">Semester 7</option>
                <option value="Akhir">Tingkat Akhir</option>
              </select>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nomor WhatsApp
              </label>
              <input
                name="whatsapp"
                type="text"
                required
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Alamat Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="email@mahasiswa.ac.id"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Motivasi */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Motivasi Bergabung
            </label>
            <textarea
              name="alasan"
              rows={4}
              required
              placeholder="Ceritakan mengapa Anda ingin menjadi Relawan Pajak..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            ></textarea>
          </div>

          {/* Upload File Dummy (Hiasan UI) */}
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Upload CV & Transkrip Nilai (Opsional)
              </p>
              <p className="text-xs text-gray-400">
                Format PDF, Maksimal 2MB (Fitur belum aktif)
              </p>
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                "Mengirim..."
              ) : (
                <>
                  <Send size={18} /> Kirim Pendaftaran
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
