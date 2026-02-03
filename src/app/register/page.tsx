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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500">
        {/* Header Section */}
        <div className="bg-slate-50 p-6 text-center border-b border-slate-100 relative">
          <Link
            href="/"
            className="absolute left-4 top-6 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 p-2">
            <Image
              src="/favicon.ico"
              alt="Logo VTC"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Daftar Akun Baru</h1>
          <p className="text-slate-500 text-xs">
            Bergabunglah dengan komunitas Relawan Pajak
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 pt-6">
          <form action={formAction} className="space-y-4">
            {/* Nama Lengkap */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Nama Lengkap
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                  <ShieldCheck size={18} />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="Buat username unik"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                  <Key size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Feedback Message */}
            {state?.message && (
              <div
                className={`flex items-center gap-2 text-xs font-medium p-3 rounded-lg border animate-pulse ${
                  state.success
                    ? "bg-green-50 text-green-700 border-green-200"
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
              className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <UserPlus size={18} /> Daftar Akun
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
                className="font-bold text-blue-700 hover:text-blue-900 hover:underline transition-colors"
              >
                Login disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
