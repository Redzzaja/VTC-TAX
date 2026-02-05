"use client";

import { useState, useEffect } from "react";
import {
  getQuestionsAction,
  submitExamAction,
  checkStatusAction,
} from "@/actions/seleksi-action";
import {
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Save,
  X,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SeleksiPage() {
  // State Tahapan: 'intro' | 'loading' | 'exam' | 'result'
  const [stage, setStage] = useState("intro");

  // Data User
  const [user, setUser] = useState({ nama: "", nim: "" });

  // Data Ujian
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 Menit

  // Modal Konfirmasi
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // --- TAHAP 1: START UJIAN ---
  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.nama || !user.nim) return toast.error("Lengkapi data diri!");

    setStage("loading");

    // 1. Cek status
    const status = await checkStatusAction(user.nim);
    if (status.hasTaken) {
      toast.warning("Anda sudah pernah mengerjakan ujian ini!");
      setStage("intro");
      return;
    }

    // 2. Ambil Soal
    const res = await getQuestionsAction();
    if (res.success && res.data.length > 0) {
      setQuestions(res.data);
      setStage("exam");
    } else {
      toast.error("Gagal memuat soal. Hubungi Admin.");
      setStage("intro");
    }
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (stage === "exam" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (stage === "exam" && timeLeft === 0) {
      finishExam(); // Waktu habis
    }
  }, [stage, timeLeft]);

  // Format Waktu
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- TAHAP 2: MENJAWAB SOAL ---
  const handleAnswer = (optionKey: string) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: optionKey });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // --- TAHAP 3: SELESAI ---
  const finishExam = async () => {
    setIsConfirmModalOpen(false); // Tutup modal jika ada

    // Hitung Nilai
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) correctCount++;
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);

    // Simpan ke Server
    await submitExamAction({
      nama: user.nama,
      nim: user.nim,
      score: finalScore,
    });

    setStage("result");
  };

  // --- RENDER UI ---

  // 1. INTRO SCREEN
  if (stage === "intro" || stage === "loading") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
        {/* Tombol Kembali (Opsional jika ingin navigasi) */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm mb-2"
          >
            <ArrowLeft size={18} /> Kembali ke Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white text-center border-b border-slate-800">
            <h1 className="text-2xl font-bold mb-2">
              Seleksi Kompetensi Dasar
            </h1>
            <p className="text-slate-400">
              Relawan Pajak Universitas Diponegoro
            </p>
          </div>
          <div className="p-8">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-sm text-slate-700 flex gap-3">
              <AlertCircle className="shrink-0 text-slate-500" />
              <div>
                <strong>Perhatian:</strong>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-slate-600">
                  <li>
                    Ujian ini hanya dapat dikerjakan{" "}
                    <strong>1 (satu) kali</strong>.
                  </li>
                  <li>Pastikan koneksi internet stabil.</li>
                  <li>Dilarang membuka tab lain atau bekerjasama.</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-500 outline-none transition-all"
                  value={user.nama}
                  onChange={(e) => setUser({ ...user, nama: e.target.value })}
                  placeholder="Nama sesuai KTM"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  NIM
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-500 outline-none transition-all"
                  value={user.nim}
                  onChange={(e) => setUser({ ...user, nim: e.target.value })}
                  placeholder="Nomor Induk Mahasiswa"
                />
              </div>
              <button
                type="submit"
                disabled={stage === "loading"}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex justify-center items-center gap-2 mt-4 shadow-md disabled:opacity-50"
              >
                {stage === "loading" ? (
                  "Memuat Soal..."
                ) : (
                  <>
                    <Play size={18} fill="currentColor" /> MULAI UJIAN
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. RESULT SCREEN
  if (stage === "result") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center animate-in zoom-in duration-300">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            score >= 70
              ? "bg-slate-100 text-slate-800"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {score >= 70 ? <CheckCircle2 size={40} /> : <X size={40} />}
        </div>
        <h2 className="text-xl font-bold text-slate-800">Ujian Selesai!</h2>
        <p className="text-slate-500 mb-6">
          Terima kasih telah berpartisipasi.
        </p>

        <div className="bg-slate-50 p-6 rounded-xl mb-6 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-bold">
            Skor Akhir Anda
          </p>
          <div className="text-5xl font-extrabold text-slate-900">{score}</div>
          <p
            className={`text-[10px] font-bold mt-3 px-3 py-1 rounded-full inline-block uppercase tracking-wider ${
              score >= 70
                ? "bg-slate-900 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {score >= 70 ? "LULUS PASSING GRADE" : "TIDAK LULUS"}
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="text-sm text-slate-500 hover:text-slate-900 font-medium underline transition-colors"
        >
          Kembali ke Halaman Utama
        </button>
      </div>
    );
  }

  // 3. EXAM SCREEN
  const currentQ = questions[currentIndex];
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in">
      {/* Kolom Kiri: Soal */}
      <div className="lg:col-span-3 space-y-6">
        {/* Header Soal */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
          <span className="font-bold text-slate-500 text-sm uppercase tracking-wide">
            Soal No. {currentIndex + 1}
          </span>
          <div
            className={`flex items-center gap-2 font-mono font-bold px-3 py-1 rounded-lg text-sm border ${
              timeLeft < 300
                ? "bg-red-50 text-red-600 border-red-100 animate-pulse"
                : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <Clock size={16} /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Isi Soal */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col">
          <h3 className="text-lg font-medium text-slate-800 mb-8 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-3 flex-1">
            {Object.entries(currentQ.options).map(
              ([key, val]: any) =>
                val && (
                  <div
                    key={key}
                    onClick={() => handleAnswer(key)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-4 group ${
                      answers[currentQ.id] === key
                        ? "border-slate-800 bg-slate-50 ring-1 ring-slate-800"
                        : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-sm font-bold border transition-colors ${
                        answers[currentQ.id] === key
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white text-slate-500 border-slate-300 group-hover:border-slate-400"
                      }`}
                    >
                      {key}
                    </div>
                    <span
                      className={`text-sm ${answers[currentQ.id] === key ? "text-slate-900 font-medium" : "text-slate-600"}`}
                    >
                      {val}
                    </span>
                  </div>
                ),
            )}
          </div>
        </div>

        {/* Navigasi */}
        <div className="flex justify-between pt-2">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-bold disabled:opacity-50 hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Sebelumnya
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2 text-sm shadow-md transition-all"
            >
              <Save size={16} /> SELESAI & KUMPULKAN
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2 text-sm shadow-md transition-all"
            >
              Selanjutnya <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Kolom Kanan: Navigasi Nomor */}
      <div className="lg:col-span-1">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-6">
          <h4 className="font-bold text-slate-700 mb-4 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
            Navigasi Soal
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`aspect-square rounded flex items-center justify-center text-xs font-bold border transition-all ${
                  currentIndex === idx
                    ? "ring-2 ring-slate-800 border-slate-800 text-slate-900"
                    : answers[q.id]
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
              <span className="text-xs text-slate-500">Sudah Dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-50 border border-slate-200 rounded-sm"></div>
              <span className="text-xs text-slate-500">Belum Dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-slate-800 rounded-sm bg-white"></div>
              <span className="text-xs text-slate-500">Sedang Dibuka</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL KONFIRMASI SELESAI --- */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto">
                <Save size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Kumpulkan Jawaban?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Pastikan Anda sudah memeriksa kembali semua jawaban. Aksi ini
                  tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="flex-1 py-2.5 text-slate-700 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Periksa Lagi
                </button>
                <button
                  onClick={finishExam}
                  className="flex-1 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 shadow-md transition-colors"
                >
                  Ya, Kumpulkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
