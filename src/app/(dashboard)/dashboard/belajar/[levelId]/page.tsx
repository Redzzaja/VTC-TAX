import { cookies } from "next/headers";
import Link from "next/link";
import { getLevelsAndProgressAction } from "@/actions/quiz-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, CheckCircle, PlayCircle, ChevronLeft, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function LevelDetailPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId: levelIdStr } = await params;
  const levelId = parseInt(levelIdStr);
  if (isNaN(levelId)) redirect("/dashboard/belajar");

  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");
  const user = session ? JSON.parse(session.value) : null;
  if (!user) redirect("/");

  // Fetch all data (Inefficient but robust essentially)
  const res = await getLevelsAndProgressAction(user.username);
  const levels = res?.levels || [];
  
  const level = levels.find((l: any) => l.id === levelId);

  // If level not found or locked, redirect back
  if (!level) redirect("/dashboard/belajar");
  if (!level.is_unlocked) redirect("/dashboard/belajar");

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
       {/* Header with Back Button */}
       <div className="flex items-center gap-4">
           <Link href="/dashboard/belajar">
               <Button variant="ghost" className="hover:bg-slate-100 rounded-full w-10 h-10 p-0">
                   <ChevronLeft size={24} className="text-slate-700" />
               </Button>
           </Link>
           <div>
               <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                   <span className="bg-yellow-400 text-slate-900 text-xs px-2 py-1 rounded font-black tracking-wider uppercase">
                       Level {level.level_number}
                   </span>
                   {level.title}
               </h1>
               <p className="text-slate-500 text-sm mt-1">{level.description}</p>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {(level.sub_levels || []).map((sub: any, idx: number) => {
               const isLocked = sub.isLocked;
               const isCompleted = sub.isCompleted;

               return (
                   <Card 
                     key={sub.id} 
                     className={cn(
                        "border-0 shadow-sm transition-all duration-300 group overflow-hidden relative",
                        isLocked ? "bg-slate-50 opacity-70" : "bg-white hover:shadow-md hover:-translate-y-1"
                     )}
                   >
                       <div className={cn("h-1 w-full absolute top-0 left-0", 
                           isCompleted ? "bg-green-500" : isLocked ? "bg-slate-200" : "bg-yellow-400"
                       )} />
                       
                       <CardContent className="p-6 flex items-start gap-5">
                           {/* Icon Status */}
                           <div className={cn(
                               "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                               isCompleted ? "bg-green-100 text-green-600" :
                               isLocked ? "bg-slate-100 text-slate-400" :
                               "bg-yellow-50 text-yellow-600"
                           )}>
                               {isCompleted ? <CheckCircle size={24} /> : 
                                isLocked ? <Lock size={20} /> : 
                                <PlayCircle size={24} fill="currentColor" className="text-yellow-400 text-white" strokeWidth={1.5} />
                               }
                           </div>

                           <div className="flex-1 space-y-1">
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                      Part {sub.sub_level_number}
                                  </span>
                                  {sub.score !== undefined && (
                                      <span className={cn(
                                          "text-xs font-bold px-2 py-0.5 rounded-full",
                                          sub.score >= sub.min_score_to_pass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                      )}>
                                          Nilai: {sub.score}
                                      </span>
                                  )}
                               </div>
                               
                               <h3 className={cn("font-bold text-lg leading-tight", isLocked ? "text-slate-400" : "text-slate-800")}>
                                   {sub.title}
                               </h3>
                               
                               <div className="pt-3">
                                   {isLocked ? (
                                       <Button disabled variant="outline" size="sm" className="w-full bg-slate-50 border-slate-200 text-slate-400">
                                           <Lock size={14} className="mr-2" /> Terkunci
                                       </Button>
                                   ) : (
                                       <Link href={`/dashboard/belajar/${level.id}/${sub.id}`}>
                                            <Button className={cn("w-full shadow-sm", isCompleted ? "bg-slate-900 hover:bg-slate-800" : "bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-none")}>
                                                {isCompleted ? "Pelajari Lagi" : "Mulai Belajar"}
                                            </Button>
                                       </Link>
                                   )}
                               </div>
                           </div>
                       </CardContent>
                   </Card>
               );
           })}
           
           {(level.sub_levels || []).length === 0 && (
               <div className="col-span-full text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                   <Flag className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                   <p>Belum ada materi di level ini.</p>
               </div>
           )}
       </div>
    </div>
  );
}
