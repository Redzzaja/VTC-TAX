"use client";

import { useState } from "react";
import { registerRelawanAction } from "@/actions/relawan-action";
import {
  UserPlus,
  School,
  BookOpen,
  Send,
  User,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function RelawanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    universitas: "",
    jurusan: "",
    semester: "1",
    whatsapp: "",
    email: "",
    alasan: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await registerRelawanAction(formData);

    setIsLoading(false);
    if (res.success) {
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Gagal: " + res.message);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Pendaftaran Berhasil!
        </h2>
        <p className="text-gray-500 mb-8">
          Terima kasih telah mendaftar sebagai Calon Relawan Pajak. <br />
          Data Anda telah kami terima dan sedang dalam proses verifikasi
          administratif.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 mb-8">
          Silakan pantau email atau WhatsApp Anda secara berkala untuk informasi
          jadwal wawancara dan seleksi selanjutnya.
        </div>
        <button
          onClick={() => {
            setIsSuccess(false);
            setFormData({ ...formData, nama: "" });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Daftar Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <UserPlus size={24} className="text-yellow-400" />
            </div>
            <span className="font-bold text-yellow-400 tracking-wider text-sm">
              REKRUTMEN OPEN
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Pendaftaran Relawan Pajak</h1>
          <p className="text-blue-100 max-w-xl">
            Bergabunglah menjadi bagian dari agen perubahan sadar pajak.
            Dapatkan pengalaman nyata, sertifikat resmi, dan jaringan
            profesional.
          </p>
        </div>
        {/* Dekorasi */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-10" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl" />
      </div>

      {/* Formulir */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 p-6">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600" />
            Formulir Biodata Calon Relawan
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Isi data diri Anda dengan benar dan valid.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Section: Data Diri */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              Identitas Personal
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Sesuai KTM"
                    className="w-full border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  NIM / NPM
                </label>
                <input
                  required
                  type="text"
                  placeholder="Nomor Induk Mahasiswa"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.nim}
                  onChange={(e) =>
                    setFormData({ ...formData, nim: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Email Aktif
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    required
                    type="email"
                    placeholder="email@mahasiswa.ac.id"
                    className="w-full border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  No. WhatsApp
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    required
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    className="w-full border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section: Data Akademik */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              Data Akademik
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Universitas / Perguruan Tinggi
                </label>
                <div className="relative">
                  <School
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Nama Kampus"
                    className="w-full border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.universitas}
                    onChange={(e) =>
                      setFormData({ ...formData, universitas: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Fakultas / Program Studi
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: FEB / Akuntansi"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.jurusan}
                  onChange={(e) =>
                    setFormData({ ...formData, jurusan: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Semester Saat Ini
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section: Essay Singkat */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Motivasi Mengikuti Relawan Pajak
            </label>
            <textarea
              required
              rows={4}
              placeholder="Jelaskan alasan dan komitmen Anda..."
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={formData.alasan}
              onChange={(e) =>
                setFormData({ ...formData, alasan: e.target.value })
              }
            ></textarea>
            <p className="text-xs text-gray-400 mt-1 text-right">
              Min. 50 karakter
            </p>
          </div>

          {/* Tombol Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                "Sedang Mengirim..."
              ) : (
                <>
                  <Send size={18} /> KIRIM PENDAFTARAN
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Dengan mengirim formulir ini, Anda menyatakan data yang diisi
              adalah benar dan siap mengikuti prosedur seleksi.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
