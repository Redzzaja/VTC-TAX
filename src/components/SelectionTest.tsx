"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitSelectionTestAction } from "@/actions/relawan-action";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle } from "lucide-react";

// Mock Questions
const QUESTIONS = [
  {
    id: 1,
    question: "Apa kepanjangan dari NPWP?",
    options: [
      "Nomor Pokok Wajib Pajak",
      "Nomor Pajak Wajib Perorangan",
      "Nomor Pokok Wilayah Pajak",
      "Nomor Pendaftaran Wajib Pajak"
    ],
    answer: "Nomor Pokok Wajib Pajak"
  },
  {
    id: 2,
    question: "Batas waktu pelaporan SPT Tahunan Orang Pribadi adalah...",
    options: [
      "31 Maret",
      "30 April",
      "31 Desember",
      "1 Januari"
    ],
    answer: "31 Maret"
  },
  {
    id: 3,
    question: "Apa singkatan dari PPh?",
    options: [
      "Pajak Pembelian",
      "Pajak Penghasilan",
      "Pajak Perusahaan",
      "Pajak Pertambahan Nilai"
    ],
    answer: "Pajak Penghasilan"
  },
    {
    id: 4,
    question: "Apa fungsi dari E-Filing?",
    options: [
      "Membayar pajak secara online",
      "Melaporkan SPT secara online",
      "Membuat kode billing",
      "Mendaftar NPWP"
    ],
    answer: "Melaporkan SPT secara online"
  },
    {
    id: 5,
    question: "Berapa tarif PPN saat ini (2025)?",
    options: [
      "10%",
      "11%",
      "12%",
      "15%"
    ],
    answer: "12%" // Assuming 12% in 2026 context or keeping it generic. Let's use 12% as future proof or 11% if strictly current. Logic: simple test.
  }
];

export default function SelectionTestPage({ user }: { user: any }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (qId: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async () => {
    // Calculate Score
    let correct = 0;
    QUESTIONS.forEach(q => {
        if (answers[q.id] === q.answer) correct++;
    });
    
    const score = (correct / QUESTIONS.length) * 100;

    setIsSubmitting(true);
    try {
        const res = await submitSelectionTestAction(user.username, score);
        if (res.success) {
            toast.success("Tes berhasil dikirim!");
            router.push("/dashboard/relawan"); // Redirect back to dashboard to see result
        } else {
            toast.error(res.message);
        }
    } catch (e) {
        toast.error("Terjadi kesalahan.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const allAnswered = QUESTIONS.every(q => answers[q.id]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Tes Seleksi Relawan</h1>
            <p className="text-muted-foreground">
                Jawab pertanyaan berikut dengan benar untuk menyelesaikan tahap seleksi.
            </p>
        </div>

        <div className="space-y-8">
            {QUESTIONS.map((q, idx) => (
                <div key={q.id} className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    {/* Header Question */}
                    <div className="p-6 md:p-8 border-b border-slate-50 flex gap-5">
                         <div className="shrink-0 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-slate-900/20">
                            {idx + 1}
                         </div>
                         <h3 className="font-bold text-lg text-slate-800 leading-normal pt-1.5">
                            {q.question}
                         </h3>
                    </div>

                    {/* Options */}
                    <div className="p-6 md:p-8 pt-0">
                        <RadioGroup onValueChange={(val: string) => handleAnswer(q.id, val)} className="space-y-3">
                            {q.options.map((opt) => {
                                const isSelected = answers[q.id] === opt;
                                return (
                                    <div 
                                        key={opt} 
                                        onClick={() => handleAnswer(q.id, opt)}
                                        className={`flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 group ${
                                            isSelected 
                                            ? "border-slate-900 bg-slate-50 shadow-sm" 
                                            : "border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            isSelected ? "border-slate-900" : "border-slate-300 group-hover:border-slate-400"
                                        }`}>
                                            {isSelected && <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />}
                                        </div>
                                        <span className={`flex-1 font-medium transition-colors ${
                                            isSelected ? "text-slate-900" : "text-slate-600 group-hover:text-slate-800"
                                        }`}>
                                            {opt}
                                        </span>
                                        <RadioGroupItem value={opt} id={`q${q.id}-${opt}`} className="sr-only" />
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-end pb-10">
            <Button 
                size="lg" 
                onClick={handleSubmit} 
                disabled={!allAnswered || isSubmitting}
                className="w-full md:w-auto min-w-[200px]"
            >
                {isSubmitting ? "Mengirim..." : `Kirim Jawaban (${Object.keys(answers).length}/${QUESTIONS.length})`}
            </Button>
        </div>
    </div>
  );
}
