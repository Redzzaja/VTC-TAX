"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  CheckCircle, 
  PlayCircle, 
  Trophy,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SubLevel = {
  id: number;
  sub_level_number: number;
  title: string;
  min_score_to_pass: number;
  isLocked: boolean;
  isCompleted: boolean;
  score?: number;
};

type Level = {
  id: number;
  level_number: number;
  title: string;
  description: string;
  subLevels: SubLevel[];
  isLocked: boolean;
};

export default function LevelList({ levels }: { levels: Level[] }) {
  // Default expand the first unlocked level, or just the first one.
  // Let's expand all by default or just first? User requested "Click level 1 to show sub levels".
  // So likely start collapsed or first expanded.
  const [expandedLevels, setExpandedLevels] = useState<number[]>([levels[0]?.id]);

  const toggleLevel = (id: number) => {
    setExpandedLevels((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {levels.map((level) => {
        const isExpanded = expandedLevels.includes(level.id);

        return (
          <div 
            key={level.id} 
            className={cn(
              "rounded-2xl border transition-all duration-300 overflow-hidden",
              level.isLocked 
                ? "bg-slate-50 border-slate-200 opacity-75" 
                : "bg-white border-slate-200 shadow-sm hover:shadow-md"
            )}
          >
            {/* Level Header (Clickable) */}
            <div 
              onClick={() => !level.isLocked && toggleLevel(level.id)}
              className={cn(
                "p-6 flex items-center justify-between cursor-pointer select-none",
                level.isLocked ? "cursor-not-allowed" : "cursor-pointer"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm",
                  level.isLocked 
                    ? "bg-slate-100 border-slate-200 text-slate-400" 
                    : "bg-slate-900 border-slate-800 text-yellow-500"
                )}>
                  {level.isLocked ? <Lock size={24} /> : <Trophy size={24} />}
                </div>
                <div>
                  <h2 className={cn(
                    "text-xl font-bold",
                    level.isLocked ? "text-slate-500" : "text-slate-900"
                  )}>
                    Level {level.level_number}: {level.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {level.subLevels.length} Materi Pembelajaran
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 {/* Progress Indicator? */}
                 {level.isLocked && (
                     <Badge variant="secondary" className="flex gap-1">
                        <Lock size={12} /> Terkunci
                     </Badge>
                 )}
                 {!level.isLocked && (
                    <div className={cn(
                        "p-2 rounded-full transition-transform duration-300",
                        isExpanded ? "rotate-180 bg-slate-100" : ""
                    )}>
                        <ChevronDown className="text-slate-500" />
                    </div>
                 )}
              </div>
            </div>

            {/* Sub-levels Grid (Accordion Content) */}
            <div className={cn(
                "border-t border-slate-100 bg-slate-50/50 transition-all duration-300 ease-in-out",
                isExpanded && !level.isLocked ? "block" : "hidden"
            )}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {level.subLevels.map((sub) => (
                  <Link
                    key={sub.id}
                    href={sub.isLocked ? "#" : `/dashboard/belajar/${sub.id}`}
                    className={cn(
                        "group block relative overflow-hidden rounded-xl border transition-all duration-300",
                        sub.isLocked 
                            ? "bg-slate-100 border-slate-200 cursor-not-allowed" 
                            : "bg-white border-slate-200 hover:shadow-lg hover:-translate-y-1 hover:border-yellow-400/50"
                    )}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <Badge 
                            variant="outline" 
                            className={cn(
                                "font-mono", 
                                sub.isCompleted ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-600"
                            )}
                        >
                            PART {sub.sub_level_number}
                        </Badge>
                        
                        {sub.isLocked ? (
                            <Lock size={18} className="text-slate-300" />
                        ) : sub.isCompleted ? (
                            <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">
                                <CheckCircle size={14} /> SELESAI
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-blue-600 font-bold text-xs bg-blue-50 px-2 py-1 rounded-full">
                                <PlayCircle size={14} /> MULAI
                            </div>
                        )}
                      </div>

                      <h3 className={cn(
                          "font-bold text-lg mb-2 leading-tight",
                          sub.isLocked ? "text-slate-400" : "text-slate-800 group-hover:text-slate-900"
                      )}>
                        {sub.title}
                      </h3>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                         <span className="flex items-center gap-1">
                             <BookOpen size={14} />
                             Min. Skor: {sub.min_score_to_pass}
                         </span>
                         
                         {sub.score !== undefined && (
                             <span className={cn(
                                 "font-bold",
                                 sub.score >= sub.min_score_to_pass ? "text-green-600" : "text-red-500"
                             )}>
                                 Skor: {sub.score}
                             </span>
                         )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
