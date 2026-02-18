import {
  getQuestionsAction,
  submitQuizAction,
  resetQuizAction,
} from "@/actions/quiz-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ levelId: string; subLevelId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { levelId, subLevelId } = await params;
  
  // 1. Fetch Questions
  const questionsRes = await getQuestionsAction(parseInt(subLevelId));
  const questions = questionsRes.success ? questionsRes.data.map((q: any) => {
      let parsedOptions: string[] = [];
      try {
          if (Array.isArray(q.options)) {
              parsedOptions = q.options.map(String);
          } else if (typeof q.options === 'string') {
              const result = JSON.parse(q.options);
              if (Array.isArray(result)) {
                  parsedOptions = result.map(String);
              } else if (typeof result === 'object' && result !== null) {
                  parsedOptions = Object.values(result).map(String);
              } else {
                  parsedOptions = [String(result)];
              }
          }
      } catch (e) {
          if (typeof q.options === 'string') {
              if (q.options.includes(',') || q.options.includes('\n')) {
                 parsedOptions = q.options.split(/[,\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
              } else {
                 parsedOptions = [q.options.trim()];
              }
          }
      }
      return { ...q, options: parsedOptions };
  }) : [];

  // 2. Check for Result Cookie
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");
  if (!session) redirect("/");
  const user = JSON.parse(session.value);

  const resultCookie = cookieStore.get(`quiz_result_${subLevelId}`);
  let resultData = null;
  if (resultCookie?.value) {
      try {
          resultData = JSON.parse(resultCookie.value);
      } catch (e) {
          console.error("Error parsing quiz result cookie:", e);
      }
  }

  // 3. Render Result View if exists
  if (resultData) {
      return (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500 pt-10">
              <Card className={resultData.isPassed ? "border-green-500 shadow-green-100 shadow-lg" : "border-red-500 shadow-red-100 shadow-lg"}>
                  <CardHeader className="text-center">
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${resultData.isPassed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                          {resultData.isPassed ? <CheckCircle2 size={32} /> : <span className="text-2xl font-bold">!</span>}
                      </div>
                      <CardTitle className={resultData.isPassed ? "text-green-600 text-2xl" : "text-red-600 text-2xl"}>
                          {resultData.isPassed ? "Selamat! Anda Lulus" : "Maaf, Anda Belum Lulus"}
                      </CardTitle>
                      <CardDescription>
                          Skor Anda: <span className="text-4xl font-black text-slate-800 block mt-2">{resultData.score}</span>
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="text-center text-slate-600 mb-6">
                          <p>Anda menjawab <strong>{resultData.correctCount}</strong> benar dari <strong>{resultData.totalQuestions}</strong> soal.</p>
                      </div>

                      {resultData.details && (
                          <div className="space-y-4 text-left">
                              {resultData.details.map((item: any, idx: number) => (
                                  <div key={idx} className={`p-4 rounded-lg border ${item.is_correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                                      <p className="font-semibold text-slate-800 text-sm mb-2">
                                          <span className="mr-2">{idx + 1}.</span> {item.question_text}
                                      </p>
                                      
                                      <div className="flex flex-col gap-1 text-xs">
                                          <div className="flex gap-2">
                                              <span className="font-semibold w-24">Jawaban Anda:</span>
                                              <span className={item.is_correct ? "text-green-700 font-bold" : "text-red-600 font-bold"}>
                                                  {item.user_answer || "Tidak dijawab"} {item.is_correct ? "(Benar)" : "(Salah)"}
                                              </span>
                                          </div>
                                          
                                          {!item.is_correct && (
                                              <div className="flex gap-2">
                                                  <span className="font-semibold w-24">Jawaban Benar:</span>
                                                  <span className="text-green-700 font-bold">{item.correct_answer}</span>
                                              </div>
                                          )}

                                          {item.explanation && (
                                              <div className="mt-2 pt-2 border-t border-slate-200/50">
                                                  <span className="font-bold text-slate-700 block mb-1">Penjelasan:</span>
                                                  <p className="text-slate-600 leading-relaxed italic">
                                                      "{item.explanation}"
                                                  </p>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </CardContent>
                  <CardFooter className="flex justify-center gap-4 pb-8">
                      <Link href={`/dashboard/belajar/${levelId}`}>
                        <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 outline-none">
                            Kembali ke Level
                        </Button>
                      </Link>
                      <form action={async () => {
                          "use server";
                          await resetQuizAction(parseInt(subLevelId));
                      }}>
                         <Button type="submit" variant="outline" className={resultData.isPassed 
                             ? "border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 outline-none" 
                             : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 outline-none"}>
                             {resultData.isPassed ? "Ulangi Kuis" : "Coba Lagi"}
                         </Button>
                      </form>

                      {resultData.isPassed && (
                          <Link href={`/dashboard/belajar/${levelId}`}>
                             <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 outline-none">
                                 Lanjut Materi
                             </Button>
                          </Link>
                      )}
                  </CardFooter>
              </Card>
          </div>
      )
  }

  // 4. Render Quiz Form (Default)
  return (
    <div className="max-w-3xl mx-auto py-10 animate-in fade-in duration-500">
      <div className="mb-6">
         <Link href={`/dashboard/belajar/${levelId}`} className="text-sm text-slate-500 hover:text-slate-800 mb-2 block">
            &larr; Kembali ke Materi
         </Link>
         <h1 className="text-2xl font-bold text-slate-900">Kuis Evaluasi</h1>
         <p className="text-slate-500">Jawab pertanyaan berikut untuk menyelesaikan sub-level ini.</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <form
            action={async (formData: FormData) => {
              "use server";
              const answers: any = {};
              questions.forEach((q: any) => {
                 answers[q.id] = formData.get(`q-${q.id}`);
              });
              
              const res = await submitQuizAction(user.username, parseInt(subLevelId), answers);
              if (res.success) {
                  redirect(`/dashboard/belajar/${levelId}/${subLevelId}`);
              }
            }}
            className="space-y-8"
          >
            {questions.map((q: any, idx: number) => (
              <div key={q.id} className="space-y-4 border-b border-slate-100 pb-6 last:border-0">
                <h3 className="font-semibold text-lg text-slate-800">
                  <span className="inline-block bg-slate-100 text-slate-600 rounded px-2 py-0.5 text-sm mr-2">{idx + 1}</span>
                  {q.question_text}
                </h3>
                <RadioGroup name={`q-${q.id}`} className="space-y-3">
                  {q.options.map((opt: string, optIdx: number) => {
                    const letter = ['A', 'B', 'C', 'D'][optIdx];
                    return (
                      <div key={optIdx} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                        <RadioGroupItem value={letter} id={`q-${q.id}-${letter}`} />
                        <Label htmlFor={`q-${q.id}-${letter}`} className="flex-1 cursor-pointer font-medium text-slate-700">
                          <span className="font-bold text-slate-900 mr-2">{letter}.</span>
                          {opt}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}
            
            {questions.length > 0 ? (
                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 text-lg">
                Kirim Jawaban
                </Button>
            ) : (
                <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">Belum ada soal untuk materi ini.</p>
                    <Link href={`/dashboard/belajar/${levelId}`}>
                        <Button variant="outline">Kembali</Button>
                    </Link>
                </div>
            )}
           
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
