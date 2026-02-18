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
      {/* Header Section */}
      <div className="bg-slate-50 p-6 text-center border-b border-slate-100 relative -mx-8 -mt-8 mb-8 rounded-t-3xl">
        <Link
          href="/"
          className="absolute left-6 top-6 text-slate-400 hover:text-slate-800 transition-colors p-1 hover:bg-slate-200 rounded-full"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="mx-auto w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 p-2 border border-slate-200">
          <div className="relative w-8 h-8">
            <Image
              src="/favicon.ico"
              alt="VTC Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Buat Akun Baru</h1>
        <p className="text-slate-500 text-xs mt-1">
          Bergabunglah dengan komunitas Relawan Pajak
        </p>
      </div>

      {/* Form Section */}
      <form action={formAction} className="space-y-4">
        {/* Nama Lengkap */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">
            Nama Lengkap
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
              <User size={18} />
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
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">
            Username
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
              <ShieldCheck size={18} />
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
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
              <Key size={18} />
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

        {/* Feedback Message */}
        {state?.message && (
          <div
            className={`flex items-center gap-2 text-xs font-medium p-3 rounded-lg border animate-pulse ${
              state.success
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            <span>{state.success ? "✅" : "⚠️"}</span> {state.message}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin text-slate-400" />
              <span className="text-slate-200">Memproses...</span>
            </>
          ) : (
            <>
              <UserPlus
                size={18}
                className="text-yellow-500 group-hover:text-white transition-colors"
              />{" "}
              Daftar Akun
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center border-t border-slate-100 pt-4">
        <p className="text-slate-500 text-sm">
          Sudah memiliki akun?{" "}
          <Link
            href="/"
            className="font-bold text-slate-900 hover:text-slate-700 hover:underline transition-colors decoration-2 underline-offset-4"
          >
            Login disini
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
