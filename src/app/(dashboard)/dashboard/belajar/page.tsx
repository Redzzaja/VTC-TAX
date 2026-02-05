"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Star,
  Lock,
  Map,
  Play,
} from "lucide-react";

// --- DATA LEVEL (TETAP SAMA) ---
const gameLevels = [
  {
    id: 1,
    title: "Dasar Perpajakan",
    desc: "Pengenalan NPWP & PTKP",
    material:
      "NPWP adalah nomor identitas Wajib Pajak. PTKP adalah pengurang penghasilan bersih.",
    quiz: [
      {
        q: "Singkatan NPWP?",
        a: { A: "Nomor Pokok Wajib Pajak", B: "Nomor Pajak" },
        c: "A",
      },
    ],
  },
  {
    id: 2,
    title: "Subjek & Objek",
    desc: "Subjek Dalam & Luar Negeri",
    material:
      "Subjek Pajak adalah orang/badan yang dikenai pajak. Objek adalah penghasilannya.",
    quiz: [
      { q: "PNS termasuk subjek pajak?", a: { A: "Ya", B: "Tidak" }, c: "A" },
    ],
  },
  {
    id: 3,
    title: "KUP Dasar",
    desc: "Hak & Kewajiban WP",
    material:
      "Kewajiban utama WP adalah Mendaftar, Menghitung, Membayar, dan Melapor.",
    quiz: [
      {
        q: "SPT Tahunan paling lambat?",
        a: { A: "Maret", B: "Januari" },
        c: "A",
      },
    ],
  },
  {
    id: 4,
    title: "PPh Pasal 21",
    desc: "Konsep Pemotongan Gaji",
    material: "PPh 21 dipotong oleh pemberi kerja atas gaji, upah, honorarium.",
    quiz: [
      {
        q: "Siapa pemotong PPh 21?",
        a: { A: "Karyawan", B: "Pemberi Kerja" },
        c: "B",
      },
    ],
  },
  {
    id: 5,
    title: "Tarif TER (PP 58)",
    desc: "Mekanisme Tarif Efektif",
    material:
      "TER digunakan untuk masa Januari-November. Desember pakai tarif Pasal 17.",
    quiz: [
      {
        q: "TER digunakan untuk bulan?",
        a: { A: "Jan-Nov", B: "Desember" },
        c: "A",
      },
    ],
  },
  {
    id: 6,
    title: "PPh Final UMKM",
    desc: "Tarif 0.5% Peredaran Bruto",
    material: "PP 55/2022 mengatur tarif final 0.5% untuk omzet tertentu.",
    quiz: [{ q: "Tarif PPh Final UMKM?", a: { A: "1%", B: "0.5%" }, c: "B" }],
  },
  {
    id: 7,
    title: "PPN Dasar",
    desc: "Barang & Jasa Kena Pajak",
    material: "PPN dikenakan atas konsumsi BKP/JKP di dalam daerah pabean.",
    quiz: [{ q: "Tarif PPN saat ini?", a: { A: "10%", B: "11%" }, c: "B" }],
  },
  {
    id: 8,
    title: "E-Faktur & E-Bupot",
    desc: "Administrasi Digital",
    material: "E-Faktur untuk PPN, E-Bupot untuk PPh. Wajib lapor online.",
    quiz: [
      {
        q: "Aplikasi buat Faktur?",
        a: { A: "E-Bupot", B: "E-Faktur" },
        c: "B",
      },
    ],
  },
  {
    id: 9,
    title: "Pemeriksaan Pajak",
    desc: "Tujuan & Prosedur",
    material:
      "Pemeriksaan bertujuan menguji kepatuhan pemenuhan kewajiban perpajakan.",
    quiz: [
      {
        q: "Tujuan pemeriksaan?",
        a: { A: "Menghukum", B: "Menguji Kepatuhan" },
        c: "B",
      },
    ],
  },
  {
    id: 10,
    title: "Sengketa Pajak",
    desc: "Keberatan & Banding",
    material: "Jika tidak setuju SKP, WP bisa ajukan Keberatan lalu Banding.",
    quiz: [
      {
        q: "Langkah awal sengketa?",
        a: { A: "Banding", B: "Keberatan" },
        c: "B",
      },
    ],
  },
];

export default function RuangBelajarPage() {
  const [progress, setProgress] = useState(1);
  const [activeLevel, setActiveLevel] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"materi" | "kuis">("materi");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFail, setShowFail] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vtc_level_progress");
    if (saved) setProgress(parseInt(saved));
  }, []);

  const handleReset = () => {
    // Idealnya pakai custom modal, sementara pakai confirm agar cepat
    if (confirm("Yakin ingin reset progress ke Level 1?")) {
      setProgress(1);
      localStorage.setItem("vtc_level_progress", "1");
    }
  };

  const openLevel = (lvl: any) => {
    if (lvl.id > progress) return;
    setActiveLevel(lvl);
    setActiveTab("materi");
    setQuizAnswers({});
  };

  const submitQuiz = () => {
    if (!activeLevel) return;

    let correctCount = 0;
    activeLevel.quiz.forEach((q: any, idx: number) => {
      if (quizAnswers[idx] === q.c) correctCount++;
    });

    if (correctCount === activeLevel.quiz.length) {
      setShowSuccess(true);
      if (activeLevel.id === progress && progress < 10) {
        const newProg = progress + 1;
        setProgress(newProg);
        localStorage.setItem("vtc_level_progress", newProg.toString());
      }
    } else {
      setShowFail(true);
    }
  };

  // --- TAMPILAN KONTEN LEVEL (MODAL) ---
  if (activeLevel) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl">
          {/* Header Level - Slate 900 + Aksen Emas Minimalis */}
          <div className="bg-slate-900 p-6 flex justify-between items-center text-white border-b border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Star className="text-yellow-500 fill-yellow-500" />
              LEVEL {activeLevel.id}: {activeLevel.title.toUpperCase()}
            </h2>
            <button
              onClick={() => setActiveLevel(null)}
              className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white"
            >
              <XCircle size={24} />
            </button>
          </div>

          <div className="p-8 min-h-[400px]">
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-100 pb-1">
              <button
                onClick={() => setActiveTab("materi")}
                className={`px-6 py-2.5 font-bold text-sm transition-all border-b-2 ${
                  activeTab === "materi"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                1. PELAJARI MATERI
              </button>
              <button
                onClick={() => setActiveTab("kuis")}
                className={`px-6 py-2.5 font-bold text-sm transition-all border-b-2 ${
                  activeTab === "kuis"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                2. TANTANGAN KUIS
              </button>
            </div>

            {/* Content Materi */}
            {activeTab === "materi" && (
              <div className="animate-in fade-in">
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed text-lg shadow-sm">
                  <h3 className="text-slate-900 font-bold mb-4 text-2xl border-l-4 border-yellow-500 pl-4">
                    {activeLevel.title}
                  </h3>
                  <p>{activeLevel.material}</p>
                </div>
                <div className="mt-6 flex items-start gap-3 text-sm text-slate-500 bg-white border border-slate-100 p-4 rounded-lg">
                  <BookOpen
                    size={18}
                    className="mt-0.5 shrink-0 text-yellow-500"
                  />
                  <p>
                    Baca materi dengan seksama sebelum melanjutkan ke kuis. Poin
                    akan tersimpan jika Anda menjawab benar.
                  </p>
                </div>
              </div>
            )}

            {/* Content Kuis */}
            {activeTab === "kuis" && (
              <div className="space-y-8 animate-in fade-in">
                {activeLevel.quiz.map((q: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                  >
                    <p className="text-slate-800 font-bold mb-6 text-lg border-l-4 border-slate-900 pl-4">
                      {idx + 1}. {q.q}
                    </p>
                    <div className="space-y-3">
                      {Object.entries(q.a).map(([key, val]: any) => (
                        <label
                          key={key}
                          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                            quizAnswers[idx] === key
                              ? "bg-slate-900 border-slate-900 text-white ring-1 ring-slate-900"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${idx}`}
                            value={key}
                            checked={quizAnswers[idx] === key}
                            onChange={() =>
                              setQuizAnswers({ ...quizAnswers, [idx]: key })
                            }
                            className="hidden"
                          />
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-colors ${
                              quizAnswers[idx] === key
                                ? "bg-yellow-500 text-slate-900 border-yellow-500"
                                : "bg-slate-100 text-slate-400 border-slate-300"
                            }`}
                          >
                            {key}
                          </div>
                          <span className="font-medium">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={submitQuiz}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
                >
                  <CheckCircle2 size={20} className="text-yellow-500" /> KIRIM
                  JAWABAN
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Sukses */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in zoom-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200">
              <div className="w-20 h-20 bg-slate-900 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-100">
                <Trophy size={40} className="animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                LUAR BIASA!
              </h3>
              <p className="text-slate-500 mb-8">
                Level {activeLevel.id} Selesai. Lanjut ke level berikutnya?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setActiveLevel(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    openLevel(gameLevels[activeLevel.id] || activeLevel);
                  }}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all"
                >
                  Lanjut Level
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Gagal */}
        {showFail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in zoom-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                JAWABAN SALAH
              </h3>
              <p className="text-slate-500 mb-8">
                Jangan menyerah! Baca materi lagi dan coba jawab ulang.
              </p>
              <button
                onClick={() => setShowFail(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all"
              >
                COBA LAGI
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- TAMPILAN MENU UTAMA (PETA GAME) ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl relative overflow-hidden text-center">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2 flex justify-center items-center gap-3">
            <Map className="text-yellow-500" /> PETA PETUALANGAN PAJAK
          </h1>
          <p className="text-slate-400 text-sm mb-8 max-w-lg mx-auto">
            Selesaikan misi perpajakan untuk membuka level berikutnya. Jadilah
            ahli pajak yang kompeten!
          </p>

          <div className="max-w-lg mx-auto bg-slate-800 h-4 rounded-full overflow-hidden mb-3 border border-slate-700">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]"
              style={{ width: `${(progress / 10) * 100}%` }}
            />
          </div>
          <div className="text-yellow-500 font-bold text-xs tracking-wider">
            LEVEL {progress} / 10 SELESAI
          </div>
        </div>

        {/* Dekorasi Background Halus */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900/50 pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />

        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-slate-600 hover:text-white transition-colors bg-slate-800 p-2 rounded-full hover:bg-slate-700"
          title="Reset Progress"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Grid Map */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto py-4">
        {gameLevels.map((lvl) => {
          const isUnlocked = lvl.id <= progress;
          const isCompleted = lvl.id < progress;
          const isCurrent = lvl.id === progress;

          return (
            <button
              key={lvl.id}
              onClick={() => openLevel(lvl)}
              disabled={!isUnlocked}
              className={`relative flex flex-col items-center group p-6 rounded-2xl transition-all duration-300 border ${
                isUnlocked
                  ? "bg-white border-slate-200 hover:border-slate-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  : "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
              } ${isCurrent ? "border-slate-900 ring-1 ring-slate-900 shadow-md" : ""}`}
            >
              {/* Badge Number */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm mb-4 transition-all ${
                  isCompleted
                    ? "bg-slate-100 text-slate-800"
                    : isCurrent
                      ? "bg-slate-900 text-yellow-500 scale-110 shadow-slate-300"
                      : "bg-slate-50 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={28} className="text-slate-700" />
                ) : isUnlocked ? (
                  lvl.id
                ) : (
                  <Lock size={24} />
                )}
              </div>

              <span
                className={`text-xs font-bold uppercase tracking-wider text-center px-3 py-1.5 rounded-lg ${
                  isCurrent ? "text-slate-900 bg-slate-100" : "text-slate-500"
                }`}
              >
                {lvl.title}
              </span>

              {/* Start Badge (Floating) */}
              {isCurrent && (
                <div className="absolute -top-3 -right-3 bg-slate-900 text-yellow-500 text-[10px] font-bold px-3 py-1 rounded-full shadow-md border-2 border-white animate-bounce flex items-center gap-1">
                  <Play size={10} fill="currentColor" /> START
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
