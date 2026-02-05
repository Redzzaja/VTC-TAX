"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import Link from "next/link";
import Image from "next/image";
import { User, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

const initialState = {
  success: false,
  message: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Decoration (Subtle & Elegant) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-800/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500 relative z-10 border border-slate-800/10">
        {/* Header Section */}
        <div className="p-8 pb-4 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-900 rounded-2xl shadow-lg flex items-center justify-center mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300 border border-slate-800">
            {/* Fallback Icon jika Image tidak load, atau dekorasi logo */}
            <div className="relative w-10 h-10">
              <Image
                src="/favicon.ico"
                alt="VTC Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            VTC TAX SYSTEM
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-px w-8 bg-slate-200"></span>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-medium">
              Tax Center Administration
            </p>
            <span className="h-px w-8 bg-slate-200"></span>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 pt-4">
          <form action={formAction} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="Masukkan username"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {state?.message && (
              <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-lg text-xs font-medium border border-red-100 animate-pulse">
                <ShieldCheck size={16} /> {state.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 group"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin text-slate-400" />
                  <span className="text-slate-200">Memproses...</span>
                </>
              ) : (
                <>
                  Masuk Aplikasi
                  <ArrowRight
                    size={18}
                    className="text-yellow-500 group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-slate-500 text-sm">
              Belum memiliki akun?{" "}
              <Link
                href="/register"
                className="font-bold text-slate-900 hover:text-slate-700 hover:underline transition-colors decoration-2 underline-offset-4"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-6 text-slate-500 text-[10px] uppercase tracking-widest text-center w-full opacity-60">
        &copy; {new Date().getFullYear()} CoreVTC System. All rights reserved.
      </div>
    </div>
  );
}
