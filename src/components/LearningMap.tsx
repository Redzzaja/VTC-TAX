"use client";

import { Lock, Trophy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface Level {
  id: number;
  level_number: number;
  title: string;
  description: string;
  is_unlocked: boolean;
  sub_levels?: any[];
}

export default function LearningMap({ levels }: { levels: Level[] }) {
  const safeLevels = Array.isArray(levels) ? levels : [];
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const trophyRef = useRef<HTMLDivElement>(null);
  const [svgPath, setSvgPath] = useState("");

  useEffect(() => {
    function calculatePath() {
      if (!containerRef.current || safeLevels.length === 0) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeTop = containerRect.top;
      const relativeLeft = containerRect.left;
      const centerX = containerRect.width / 2;

      let path = `M ${centerX} 0`; // Start at top center

      // Connect to each node
      safeLevels.forEach((_, index) => {
        const node = nodeRefs.current[index];
        if (node) {
          const nodeRect = node.getBoundingClientRect();
          const nodeX = nodeRect.left - relativeLeft + nodeRect.width / 2;
          const nodeY = nodeRect.top - relativeTop + nodeRect.height / 2;
          
          // Draw a curve to the node
          // Simple straight line for now, or curve
          // Curved approach:
          // prevY to nodeY
          path += ` L ${nodeX} ${nodeY}`;
        }
      });

      // Connect to Trophy
      if (trophyRef.current) {
        const trophyRect = trophyRef.current.getBoundingClientRect();
        const trophyX = trophyRect.left - relativeLeft + trophyRect.width / 2;
        const trophyY = trophyRect.top - relativeTop; // Top of trophy container
        path += ` L ${trophyX} ${trophyY + 20}`; // +20 to go inside a bit
      }

      setSvgPath(path);
    }

    calculatePath();
    window.addEventListener("resize", calculatePath);
    return () => window.removeEventListener("resize", calculatePath);
  }, [safeLevels.length]);

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto py-12 px-6">
      
      {/* Dynamic SVG Path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
        <path
          d={svgPath}
          fill="none"
          stroke="#cbd5e1" // slate-300
          strokeWidth="4"
          strokeDasharray="12 12"
          strokeLinecap="round"
          className="opacity-60"
        />
      </svg>

      <div className="relative z-10 space-y-24">
        {safeLevels.map((level, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div 
                key={level.id} 
                className={cn(
                    "flex items-center w-full relative",
                    isEven ? "justify-start md:justify-end md:pr-10" : "justify-end md:justify-start md:pl-10",
                    "justify-center md:flex-row"
                )}
            >
                 <div className={cn(
                    "flex items-center gap-8 w-full md:w-1/2",
                    isEven ? "md:flex-row-reverse md:mr-[50%]" : "md:flex-row md:ml-[50%]"
                 )}>
                    {/* Node */}
                    <Link 
                        href={level.is_unlocked ? `/dashboard/belajar/${level.id}` : "#"} 
                        className="relative shrink-0 z-20 group"
                        ref={el => { nodeRefs.current[index] = el }}
                    >
                        <div className={cn(
                            "w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center border-[6px] shadow-2xl transition-all duration-300 relative bg-white",
                            level.is_unlocked 
                            ? "border-yellow-400 text-yellow-600 shadow-yellow-200/50 hover:scale-110 hover:-rotate-3" 
                            : "border-slate-100 text-slate-300 bg-slate-50 grayscale cursor-not-allowed"
                        )}>
                             {/* Inner Ring */}
                             <div className={cn(
                                 "absolute inset-1 rounded-full border-2 border-dashed opacity-30",
                                 level.is_unlocked ? "border-yellow-600 spin-slow" : "border-slate-300"
                             )} />

                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-[-2px]">LVL</span>
                            <span className="text-4xl font-black">{level.level_number}</span>
                            
                            {!level.is_unlocked && (
                                <div className="absolute -top-1 -right-1 bg-slate-400 text-white p-2 rounded-full shadow-sm">
                                    <Lock size={16} />
                                </div>
                            )}
                        </div>

                        {/* Tooltip for locked */}
                         {!level.is_unlocked && (
                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                Selesaikan Level Sebelumnya
                            </div>
                         )}
                    </Link>

                    {/* Card Description */}
                    <div className={cn(
                        "hidden md:block bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 max-w-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                        level.is_unlocked ? "opacity-100" : "opacity-50 grayscale"
                     )}>
                        <h3 className="font-bold text-slate-800 text-xl mb-2">{level.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{level.description}</p>
                     </div>
                 </div>
            </div>
          );
        })}
      </div>

       {/* Finish Line */}
      <div className="flex justify-center mt-24 relative z-10" ref={trophyRef}>
         <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-yellow-400 shadow-2xl shadow-slate-900/40 ring-8 ring-slate-50 animate-bounce-slow">
            <Trophy fill="currentColor" size={32} />
         </div>
      </div>
      
      <div className="text-center mt-6 text-slate-400 text-sm font-bold uppercase tracking-widest">
        Grand Master Tax
      </div>
    </div>
  );
}
