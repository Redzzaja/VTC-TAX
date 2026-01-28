"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

const initialState = {
  success: false,
  message: "",
};

export default function LoginPage() {
  // Hook untuk menangani form submission & error state
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          VTC TAX SYSTEM
        </h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
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
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 disabled:opacity-50"
          >
            {isPending ? "Memuat..." : "Masuk Aplikasi"}
          </button>
        </form>
      </div>
    </div>
  );
}
