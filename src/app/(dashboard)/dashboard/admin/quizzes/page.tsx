import {
  addQuestionAction,
  deleteQuestionAction,
  getLevelsAction,
  getSubLevelsAction,
  getQuestionsAction,
} from "@/actions/quiz-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { ClipboardCheck, ChevronRight, PlusCircle, HelpCircle, Trash2 } from "lucide-react";

export default async function AdminQuizPage({
  searchParams,
}: {
  searchParams: Promise<{ levelId?: string; subLevelId?: string }>;
}) {
  const { levelId, subLevelId } = await searchParams;

  const levelsResult = await getLevelsAction();
  const levels = levelsResult.success ? levelsResult.data : [];

  let subLevels: any[] = [];
  if (levelId) {
    const res = await getSubLevelsAction(parseInt(levelId));
    if (res.success) subLevels = res.data;
  }

  let questions: any[] = [];
  if (subLevelId) {
    const res = await getQuestionsAction(parseInt(subLevelId));
    if (res.success) questions = res.data;
  }

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden animate-in fade-in pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="text-slate-700 w-5 h-5 md:w-7 md:h-7 shrink-0" />
            <span>Manajemen Kuis</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 leading-snug">
            Atur bank soal kuis untuk setiap Level dan Sub-Level pembelajaran.
          </p>
        </div>

        {/* Navigation / Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 h-[400px] flex flex-col">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs md:text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                <span>1. PILIH LEVEL</span>
                <span className="text-slate-500 font-normal text-xs">{levels.length} Level</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {levels.length === 0 && <p className="text-slate-400 text-sm italic text-center py-4">Belum ada Level.</p>}
                {levels.map((l: any) => (
                  <a
                    key={l.id}
                    href={`/dashboard/admin/quizzes?levelId=${l.id}`}
                    className={`block w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
                      levelId === String(l.id) 
                        ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                       <span className="font-bold text-sm">Level {l.level_number}</span>
                       {levelId === String(l.id) && <ChevronRight size={16} />}
                    </div>
                    <div className={`text-xs mt-1 ${levelId === String(l.id) ? "text-slate-400" : "text-slate-500"}`}>
                      {l.title}
                    </div>
                  </a>
                ))}
              </div>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 h-[400px] flex flex-col">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs md:text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                <span>2. PILIH SUB-LEVEL</span>
                <span className="text-slate-500 font-normal text-xs">{subLevels.length} Sub-Level</span>
              </div>
              
              {!levelId ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm italic">
                    <HelpCircle className="mb-2 opacity-20" size={48} />
                    Pilih Level terlebih dahulu
                 </div>
              ) : subLevels.length === 0 ? (
                 <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
                    Tidak ada Sub-Level di level ini.
                 </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {subLevels.map((sl: any) => (
                    <a
                      key={sl.id}
                      href={`/dashboard/admin/quizzes?levelId=${levelId}&subLevelId=${sl.id}`}
                      className={`block w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        subLevelId === String(sl.id) 
                          ? "bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${subLevelId === String(sl.id) ? "bg-blue-500" : "bg-slate-300"}`} />
                        <span className="font-medium text-sm">{sl.sub_level_number}. {sl.title}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
           </div>
        </div>

        {/* Question Management Area */}
        {subLevelId && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom duration-500 fade-in">
             {/* List Questions */}
             <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-h-[500px] max-h-[800px] flex flex-col">
                   <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs md:text-sm font-bold text-slate-700 mb-4 flex justify-between items-center">
                      <span>DAFTAR SOAL TERSIMPAN</span>
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono shadow-sm">{questions.length}</span>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {questions.length === 0 && (
                        <div className="text-center py-10 text-slate-400 text-sm">
                          Belum ada soal untuk sub-level ini.
                        </div>
                      )}
                      {questions.map((q: any, idx) => (
                        <div key={q.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all group">
                           <div className="flex justify-between items-start gap-2 mb-2">
                              <span className="font-bold text-slate-900 text-xs bg-slate-200 px-1.5 py-0.5 rounded">Q{idx+1}</span>
                              <form action={async () => {
                                  "use server";
                                  await deleteQuestionAction(q.id);
                              }}>
                                  <button className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Hapus Soal">
                                      <Trash2 size={16} />
                                  </button>
                              </form>
                           </div>
                           <p className="text-xs text-slate-700 font-medium mb-3 line-clamp-3 leading-relaxed">
                             {q.question_text}
                           </p>
                           <div className="grid grid-cols-2 gap-2 text-[10px]">
                              {(() => {
                                  try {
                                      let opts: string[] = [];
                                      if (typeof q.options === 'string') {
                                          opts = JSON.parse(q.options);
                                          if (!Array.isArray(opts)) opts = [];
                                      } else if (Array.isArray(q.options)) {
                                          opts = q.options;
                                      }
                                      
                                      return ['A','B','C','D'].map((label, i) => (
                                         <div key={label} className={`px-2 py-1 rounded border ${
                                            q.correct_answer === label 
                                              ? "bg-green-50 border-green-200 text-green-700 font-bold" 
                                              : "bg-white border-slate-100 text-slate-500"
                                         }`}>
                                            {label}. {opts[i] || '-'}
                                         </div>
                                      ));
                                  } catch (e) {
                                      return <div className="col-span-2 text-red-400">Error displaying options</div>;
                                  }
                              })()}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Form Add Question */}
             <div className="lg:col-span-7">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                   <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                      <PlusCircle className="text-slate-900" size={20} />
                      <h3 className="text-lg font-bold text-slate-900">Buat Soal Baru</h3>
                   </div>
                   
                   <form
                      action={async (formData) => {
                        "use server";
                        await addQuestionAction(null, formData);
                      }}
                      className="space-y-5"
                    >
                      <input type="hidden" name="subLevelId" value={subLevelId} />
                      
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Pertanyaan</Label>
                        <Textarea 
                          name="questionText" 
                          placeholder="Tulis soal lengkap di sini..." 
                          required 
                          className="min-h-[100px] bg-white text-slate-900 border-slate-300 focus:border-slate-500 focus:ring-slate-500 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Opsi A</Label>
                          <Input name="optionA" placeholder="Jawaban A" required className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Opsi B</Label>
                          <Input name="optionB" placeholder="Jawaban B" required className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Opsi C</Label>
                          <Input name="optionC" placeholder="Jawaban C" className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Opsi D</Label>
                          <Input name="optionD" placeholder="Jawaban D" className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Kunci Jawaban</Label>
                        <Select name="correctAnswer">
                          <SelectTrigger className="bg-white text-slate-900 border-slate-300 focus:ring-slate-500">
                              <SelectValue placeholder="Pilih yang benar" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="A">Opsi A</SelectItem>
                              <SelectItem value="B">Opsi B</SelectItem>
                              <SelectItem value="C">Opsi C</SelectItem>
                              <SelectItem value="D">Opsi D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Penjelasan (Opsional)</Label>
                          <Textarea name="explanation" placeholder="Penjelasan kenapa jawaban ini benar..." className="h-20 bg-white text-slate-900 border-slate-300 focus:ring-slate-500 resize-none" />
                      </div>

                      <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm mt-2">
                          Simpan Soal ke Database
                      </Button>
                    </form>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
