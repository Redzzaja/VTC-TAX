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
} from "lucide-react";

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
  const [timeLeft, setTimeLeft] = useState(3600); // 60 Menit dalam detik

  // --- TAHAP 1: START UJIAN ---
  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.nama || !user.nim) return alert("Lengkapi data diri!");

    setStage("loading");

    // 1. Cek apakah sudah pernah ujian?
    const status = await checkStatusAction(user.nim);
    if (status.hasTaken) {
      alert(
        "Anda sudah pernah mengerjakan ujian ini! Data Anda sudah tersimpan."
      );
      setStage("intro");
      return;
    }

    // 2. Ambil Soal
    const res = await getQuestionsAction();
    if (res.success && res.data.length > 0) {
      setQuestions(res.data);
      setStage("exam");
    } else {
      alert("Gagal memuat soal atau Bank Soal kosong. Hubungi Admin.");
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

  // Format Waktu (MM:SS)
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

  // --- TAHAP 3: SELESAI & HITUNG SKOR ---
  const finishExam = async () => {
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
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Seleksi Kompetensi Dasar</h1>
          <p className="text-slate-400">Relawan Pajak Universitas Diponegoro</p>
        </div>
        <div className="p-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800 flex gap-3">
            <AlertCircle className="shrink-0" />
            <div>
              <strong>Perhatian:</strong>
              <ul className="list-disc ml-4 mt-1 space-y-1">
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
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                className="w-full border rounded-lg px-4 py-2.5"
                value={user.nama}
                onChange={(e) => setUser({ ...user, nama: e.target.value })}
                placeholder="Nama sesuai KTM"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                NIM
              </label>
              <input
                type="text"
                required
                className="w-full border rounded-lg px-4 py-2.5"
                value={user.nim}
                onChange={(e) => setUser({ ...user, nim: e.target.value })}
                placeholder="Nomor Induk Mahasiswa"
              />
            </div>
            <button
              type="submit"
              disabled={stage === "loading"}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2 mt-4"
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
    );
  }

  // 2. RESULT SCREEN
  if (stage === "result") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center animate-in zoom-in duration-300">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            score >= 70
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Ujian Selesai!</h2>
        <p className="text-gray-500 mb-6">Terima kasih telah berpartisipasi.</p>

        <div className="bg-slate-50 p-6 rounded-xl mb-6">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
            Skor Akhir Anda
          </p>
          <div
            className={`text-5xl font-extrabold ${
              score >= 70 ? "text-green-600" : "text-red-600"
            }`}
          >
            {score}
          </div>
          <p
            className={`text-xs font-bold mt-2 px-3 py-1 rounded-full inline-block ${
              score >= 70
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {score >= 70 ? "LULUS PASSING GRADE" : "TIDAK LULUS"}
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="text-sm text-gray-500 hover:text-blue-600 underline"
        >
          Kembali ke Halaman Utama
        </button>
      </div>
    );
  }

  // 3. EXAM SCREEN
  const currentQ = questions[currentIndex];
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Kolom Kiri: Soal */}
      <div className="lg:col-span-3 space-y-6">
        {/* Header Soal */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
          <span className="font-bold text-gray-500">
            Soal No. {currentIndex + 1}
          </span>
          <div
            className={`flex items-center gap-2 font-mono font-bold px-3 py-1 rounded-lg ${
              timeLeft < 300
                ? "bg-red-100 text-red-600 animate-pulse"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <Clock size={16} /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Isi Soal */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
          <h3 className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {Object.entries(currentQ.options).map(
              ([key, val]: any) =>
                val && (
                  <div
                    key={key}
                    onClick={() => handleAnswer(key)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                      answers[currentQ.id] === key
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                        answers[currentQ.id] === key
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-500 border-gray-300"
                      }`}
                    >
                      {key}
                    </div>
                    <span className="text-gray-700">{val}</span>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Navigasi */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 font-bold disabled:opacity-50 hover:bg-gray-50"
          >
            Sebelumnya
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={() => {
                if (confirm("Yakin ingin mengakhiri ujian?")) finishExam();
              }}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 flex items-center gap-2"
            >
              <Save size={18} /> SELESAI & KUMPULKAN
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2"
            >
              Selanjutnya <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Kolom Kanan: Navigasi Nomor */}
      <div className="lg:col-span-1">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-6">
          <h4 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">
            Navigasi Soal
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`aspect-square rounded flex items-center justify-center text-sm font-bold border ${
                  currentIndex === idx
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : answers[q.id]
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
              <span className="text-xs text-gray-500">Sudah Dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded-sm"></div>
              <span className="text-xs text-gray-500">Belum Dijawab</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
