"use client";

import { useActionState, useEffect, useState } from "react";
import { registerRelawanAction } from "@/actions/relawan-action";
import { UploadCloud, Send, User, Terminal, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const initialState = {
  success: false,
  message: "",
};

export default function RelawanRegistrationForm() {
  const [state, formAction, isPending] = useActionState(
    registerRelawanAction,
    initialState,
  );

  // Staggered animation state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state.message) {
        // ... (toast logic remains the same)
      if (state.success) {
        toast.success("ACCESS GRANTED", {
          description: state.message,
          duration: 4000,
          className: "font-mono border-green-500/50 bg-black/90 text-green-400"
        });
      } else {
        toast.error("ACCESS DENIED", {
          description: state.message,
          className: "font-mono border-red-500/50 bg-black/90 text-red-400"
        });
      }
    }
  }, [state]);

  const inputClasses = "w-full bg-black/40 border border-[var(--color-border-dim)] px-4 py-3 text-[var(--foreground)] placeholder:text-zinc-600 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all font-mono text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed";
  
  const labelClasses = "block text-[10px] font-mono text-[var(--color-primary)] uppercase tracking-widest mb-1.5 opacity-80";

  return (
    <div className={`relative max-w-4xl mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
      {/* Technical Header */}
      <div className="mb-8 border-l-2 border-[var(--color-primary)] pl-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
        <h1 className="text-4xl md:text-5xl font-bold font-heading uppercase text-white tracking-tight mb-2 flex items-center gap-4">
          <Terminal size={36} className="text-[var(--color-primary)]" />
          Operator // Registration
        </h1>
        <p className="font-mono text-[var(--color-accent)] text-sm tracking-widest">
          UNIT: PAJAK // CLEARANCE: LEVEL 1 // STATUS: OPEN
        </p>
      </div>

      {/* Main Terminal Frame */}
      <div className="backdrop-blur-xl bg-[var(--color-surface)]/80 border border-[var(--color-border-dim)] relative overflow-hidden shadow-2xl">
        
        {/* Decorative Top Bar */}
        <div className="h-8 bg-[var(--color-surface-hover)] border-b border-[var(--color-border-dim)] flex items-center justify-between px-4">
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
            <div className="font-mono text-[10px] text-zinc-500">SYS.VTC.TAX.V4.0.1</div>
        </div>

        <form action={formAction} className="p-6 md:p-8 space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            
            {/* Personal Identification Section */}
            <div className="col-span-full mb-2 flex items-center gap-2 pb-2 border-b border-[var(--color-border-dim)]">
                <div className="w-1 h-4 bg-[var(--color-accent)]" />
                <span className="font-heading font-semibold text-lg tracking-wider text-zinc-300">01 // IDENTIFICATION</span>
            </div>

            <div className="space-y-1 group">
              <label className={labelClasses}>Full Name // Sesuai KTP</label>
              <input name="nama" type="text" required placeholder="ENTER FULL NAME..." className={inputClasses} />
              <div className="h-[1px] w-0 group-hover:w-full bg-[var(--color-primary)] transition-all duration-500" />
            </div>

            <div className="space-y-1 group">
              <label className={labelClasses}>NIM ID // STUDENT NUMBER</label>
              <input name="nim" type="text" required placeholder="XXXXXXXX" className={inputClasses} />
            </div>

            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1 group">
                    <label className={labelClasses}>Comm Link // WhatsApp</label>
                    <input name="whatsapp" type="text" required placeholder="+62..." className={inputClasses} />
                 </div>
                 <div className="space-y-1 group">
                    <label className={labelClasses}>Digital Mail // Email</label>
                    <input name="email" type="email" required placeholder="USER@DOMAIN.AC.ID" className={inputClasses} />
                 </div>
            </div>


             {/* Academic Data Section */}
             <div className="col-span-full mt-6 mb-2 flex items-center gap-2 pb-2 border-b border-[var(--color-border-dim)]">
                <div className="w-1 h-4 bg-[var(--color-accent)]" />
                <span className="font-heading font-semibold text-lg tracking-wider text-zinc-300">02 // ACADEMIC DATA</span>
            </div>

            <div className="space-y-1 group">
              <label className={labelClasses}>Origin // Campus</label>
              <input name="universitas" type="text" required placeholder="UNIVERSITY NAME" className={inputClasses} />
            </div>

            <div className="space-y-1 group">
              <label className={labelClasses}>Major // Department</label>
              <input name="jurusan" type="text" required placeholder="TAXATION / ACCOUNTING" className={inputClasses} />
            </div>

            <div className="col-span-full space-y-1">
              <label className={labelClasses}>Current Level // Semester</label>
              <div className="grid grid-cols-4 gap-4">
                  {[
                      {label: "SEM 3", val: "3"},
                      {label: "SEM 5", val: "5"},
                      {label: "SEM 7", val: "7"},
                      {label: "FINAL", val: "Akhir"}
                  ].map((opt) => (
                      <label key={opt.val} className="cursor-pointer relative group">
                          <input type="radio" name="semester" value={opt.val} className="peer sr-only" required />
                          <div className="border border-[var(--color-border-dim)] bg-black/20 p-3 text-center font-mono text-xs text-zinc-400 peer-checked:border-[var(--color-primary)] peer-checked:text-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/10 transition-all hover:border-zinc-500">
                              {opt.label}
                          </div>
                      </label>
                  ))}
              </div>
            </div>

          </div>

          <div className="space-y-1 mt-8">
            <label className={labelClasses}>Mission Statement // Motivation</label>
             <textarea
                name="alasan"
                rows={4}
                required
                placeholder="// INITIALIZE MOTIVATION PROTOCOL..."
                className={`${inputClasses} font-sans normal-case tracking-normal min-h-[120px]`}
              ></textarea>
          </div>

          {/* Upload Section - Technical Zone */}
          <div className="relative group cursor-pointer overflow-hidden rounded-none border border-dashed border-zinc-700 bg-black/20 hover:bg-[var(--color-primary)]/5 transition-all duration-300">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" required />
            <div className="p-8 flex flex-col items-center justify-center text-center relative z-10">
                <div className="mb-4 p-4 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all">
                    <UploadCloud size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-bold text-lg text-zinc-300 group-hover:text-white transition-colors">
                    UPLOAD DATA PACKET
                </h3>
                <p className="font-mono text-xs text-zinc-500 mt-2">
                    [CV_FILE] + [TRANSCRIPT_FILE] // MAX_SIZE: 2MB
                </p>
                <p className="font-mono text-[10px] text-[var(--color-accent)] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    // WAITING FOR INPUT...
                </p>
            </div>
            
            {/* Scanline Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary)]/20 shadow-[0_0_10px_vars(--color-primary)] animate-[scan_2s_linear_infinite] opacity-0 group-hover:opacity-100 pointer-events-none" />
          </div>

          <div className="flex justify-end pt-6 border-t border-[var(--color-border-dim)]">
            <Button
              type="submit"
              disabled={isPending}
              className="relative overflow-hidden group bg-[var(--color-surface-hover)] hover:bg-[var(--color-primary)] text-white border border-[var(--color-border-bright)] hover:border-[var(--color-primary)] px-8 py-6 rounded-none font-mono text-sm tracking-widest transition-all clip-path-polygon"
            >
                <span className="relative z-10 flex items-center gap-3">
                    {isPending ? (
                        <>PROCESSING <span className="animate-pulse">_</span></>
                    ) : (
                        <>
                            INITIATE_UPLOAD <Send size={16} />
                        </>
                    )}
                </span>
                
                {/* Button Glitch Effect Background */}
                <div className="absolute inset-0 bg-[var(--color-primary)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
            </Button>
          </div>

        </form>
      </div>
      
      {/* Decorative Footer Technical Text */}
      <div className="flex justify-between mt-4 font-mono text-[10px] text-zinc-600 uppercase">
        <span>Secure Connection // TLS 1.3</span>
        <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
      </div>

    </div>
  );
}
