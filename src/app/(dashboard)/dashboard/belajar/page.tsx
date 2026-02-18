import { cookies } from "next/headers";
import { getLevelsAndProgressAction } from "@/actions/quiz-action";
import LearningMap from "@/components/LearningMap";
import { GraduationCap } from "lucide-react";

export default async function BelajarPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");
  const user = session ? JSON.parse(session.value) : null;

  if (!user) return <div>Access Denied</div>;

  const res = await getLevelsAndProgressAction(user.username);
  const levels = res?.levels || [];

  return (
    <div className="animate-in fade-in duration-500 pb-20">
       <div className="mb-10 text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
             <GraduationCap className="w-10 h-10 text-yellow-500" />
             PETUALANGAN PAJAK
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
             Selesaikan setiap level untuk membuka tantangan berikutnya dan menjadi ahli perpajakan!
          </p>
       </div>

       <LearningMap levels={levels} />
    </div>
  );
}
