"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/register";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Daftar Akun Baru
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Bergabung dengan VTC Tax System
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              placeholder="Untuk login nanti"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {state?.message && (
            <div
              className={`text-sm text-center p-2 rounded ${state.success ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
            >
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-600">Sudah punya akun? </span>
          <Link
            href="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login disini
          </Link>
        </div>
      </div>
    </div>
  );
}
