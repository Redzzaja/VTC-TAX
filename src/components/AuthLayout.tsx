import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 lg:p-8">
      {/* Centered Card Container */}
      <div className="w-full max-w-7xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[85vh]">
        
        {/* Left Side - Image/Brand */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 bg-slate-900">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/auth-bg.png"
              alt="Authentication Background"
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-950/30" />
            <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />
          </div>

          {/* Content over image */}
          <div className="relative z-10 flex flex-col h-full justify-between text-white">
              <div className="flex justify-between items-start w-full">
                  <div className="text-2xl font-bold tracking-widest drop-shadow-md flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
                        <div className="relative w-6 h-6">
                           <Image
                            src="/favicon.ico"
                            alt="VTC Logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      VTC
                  </div>
              </div>

              <div className="space-y-6 max-w-lg mb-12">
                  <h2 className="text-6xl font-bold leading-tight tracking-tight drop-shadow-lg">
                      Tax Center<br />
                      <span className="text-white/80">Administration</span>
                  </h2>
                  <p className="text-slate-300 text-xl font-light leading-relaxed max-w-md">
                    Efficiently manage tax volunteers, learning modules, and selection processes in one centralized platform.
                  </p>
              </div>

              <div className="text-xs text-white/40 font-medium tracking-widest uppercase">
                &copy; {new Date().getFullYear()} CoreVTC System
              </div>
          </div>
        </div>

        {/* Right Side - Content Container */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 relative bg-white">
          <div className="w-full max-w-md space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
