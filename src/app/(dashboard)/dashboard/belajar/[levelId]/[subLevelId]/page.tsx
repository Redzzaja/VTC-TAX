import {
  getQuestionsAction,
  submitQuizAction,
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
  const searchParamsValue = await searchParams;
  const resultData = searchParamsValue?.result ? JSON.parse(searchParamsValue.result as string) : null;
  
  const questionsRes = await getQuestionsAction(parseInt(subLevelId));
  const questions = questionsRes.success ? questionsRes.data : [];

  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");
  if (!session) redirect("/");
  const user = JSON.parse(session.value);

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
                  <CardContent>
                      <div className="text-center text-slate-600">
                          <p>Anda menjawab <strong>{resultData.correctCount}</strong> benar dari <strong>{resultData.totalQuestions}</strong> soal.</p>
                      </div>
                  </CardContent>
                  <CardFooter className="flex justify-center gap-4 pb-8">
                      <Link href={`/dashboard/belajar/${levelId}`}>
                        <Button variant="outline">Kembali ke Level</Button>
                      </Link>
                      {!resultData.isPassed && (
                          <Link href={`/dashboard/belajar/${levelId}/${subLevelId}`}>
                             <Button>Coba Lagi</Button>
                          </Link>
                      )}
                      {resultData.isPassed && (
                          <Link href={`/dashboard/belajar/${levelId}`}>
                             <Button className="bg-slate-900 text-white">Lanjut Materi</Button>
                          </Link>
                      )}
                  </CardFooter>
              </Card>
          </div>
      )
  }

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
                  redirect(`/dashboard/belajar/${levelId}/${subLevelId}?result=${JSON.stringify(res)}`);
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
                  {JSON.parse(q.options).map((opt: string) => (
                    <div key={opt} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                      <RadioGroupItem value={opt} id={`q-${q.id}-${opt}`} />
                      <Label htmlFor={`q-${q.id}-${opt}`} className="flex-1 cursor-pointer">{opt}</Label>
                    </div>
                  ))}
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
