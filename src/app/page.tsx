"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import Link from "next/link";
import Image from "next/image";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500">
        {/* Header Section with Logo */}
        <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
          <div className="mx-auto w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-4 p-3 relative">
            <Image
              src="/favicon.ico"
              alt="Logo VTC"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            VTC TAX SYSTEM
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Sistem Informasi Relawan Pajak
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 pt-6">
          <form action={formAction} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="Masukkan username Anda"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-3 text-sm text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-3 text-sm text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {state?.message && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-xs font-medium border border-red-100 animate-pulse">
                <span>⚠️</span> {state.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Memuat...
                </>
              ) : (
                <>
                  Masuk Aplikasi <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Belum memiliki akun?{" "}
              <Link
                href="/register"
                className="font-bold text-blue-700 hover:text-blue-900 hover:underline transition-colors"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-6 text-slate-400 text-xs text-center w-full opacity-60">
        &copy; {new Date().getFullYear()} CoreVTC Tax Center. All rights
        reserved.
      </div>
    </div>
  );
}
