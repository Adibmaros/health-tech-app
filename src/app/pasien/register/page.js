"use client";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUp } from "./lib/action";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-70 font-medium shadow-sm">
      {pending ? "Mendaftar..." : "Daftar Sekarang"}
    </button>
  );
};

const initialState = {
  message: "",
};

const RegisterPage = () => {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-4">
        <Link href="/pasien/login" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Kembali ke Login</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Registrasi Pasien</h2>
            <p className="text-gray-600 mt-2">Daftar untuk membuat akun pasien baru</p>
          </div>

          {state.message !== "" && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-100">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Minimal 8 karakter"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Password harus memiliki minimal 8 karakter</p>
            </div>

            <div className="pt-2">
              <SubmitButton />
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
                <Link href="/pasien/login" className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors">
                  Login disini
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="py-4 text-center text-gray-500 text-sm">© {new Date().getFullYear()} Sistem Pasien. All rights reserved.</div>
    </div>
  );
};

export default RegisterPage;
