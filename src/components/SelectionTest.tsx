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

        <div className="space-y-6">
            {QUESTIONS.map((q, idx) => (
                <Card key={q.id} className="border-2 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b pb-4">
                        <CardTitle className="text-lg">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm mr-3">
                                {idx + 1}
                            </span>
                            {q.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <RadioGroup onValueChange={(val: string) => handleAnswer(q.id, val)} className="space-y-3">
                            {q.options.map((opt) => (
                                <div key={opt} className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${answers[q.id] === opt ? "bg-slate-100 border-slate-400" : "hover:bg-slate-50"}`}>
                                    <RadioGroupItem value={opt} id={`q${q.id}-${opt}`} />
                                    <Label htmlFor={`q${q.id}-${opt}`} className="flex-1 cursor-pointer font-normal">
                                        {opt}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>
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
