"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/register";
import Link from "next/link";
import Image from "next/image";
import {
  UserPlus,
  User,
  ShieldCheck,
  Key,
  ArrowLeft,
  Loader2,
  ArrowRight,
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const initialState = {
  success: false,
  message: "",
};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <AuthLayout>
      <div className="pb-2 text-center relative">
        <div className="absolute left-0 top-0">
             <Link
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors p-2 hover:bg-slate-100 rounded-lg text-sm font-medium"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Kembali</span>
              </Link>
        </div>

        <div className="mx-auto w-12 h-12 bg-slate-900 rounded-xl shadow-lg flex items-center justify-center mb-3 transform -rotate-3 hover:rotate-0 transition-all duration-300 border border-slate-800">
           <div className="relative w-8 h-8">
             <Image
               src="/favicon.ico"
               alt="VTC Logo"
               fill
               className="object-contain"
             />
           </div>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Buat Akun Baru
        </h1>
      </div>

      {/* Form Section */}
      <div className="pt-0">
        <form action={formAction} className="space-y-3">
           {/* Nama Lengkap */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide ml-1">
                Nama Lengkap
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <User size={16} />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <ShieldCheck size={16} />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="Buat username unik"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <Key size={16} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all"
                />
              </div>
            </div>

          {/* Error/Success Message */}
          {state?.message && (
             <div
                className={`flex items-center gap-3 p-2.5 rounded-lg text-xs font-medium border animate-pulse ${
                  state.success
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-600 border-red-100"
                }`}
              >
                {state.success ? (
                    <span className="flex items-center gap-2">✅ Pendaftaran Berhasil! Silakan Login.</span>
                ) : (
                    <span className="flex items-center gap-2"><ShieldCheck size={16} /> {state.message}</span>
                )}
              </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-1 group"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin text-slate-400" />
                <span className="text-slate-200">Memproses...</span>
              </>
            ) : (
              <>
                 Daftar Akun
                <UserPlus
                  size={18}
                  className="text-yellow-500 group-hover:text-white transition-colors"
                />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-4 text-center pt-4 border-t border-slate-100">
          <p className="text-slate-500 text-xs">
            Sudah memiliki akun?{" "}
            <Link
              href="/"
              className="font-bold text-slate-900 hover:text-slate-700 hover:underline transition-colors decoration-2 underline-offset-4"
            >
              Login disini
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
