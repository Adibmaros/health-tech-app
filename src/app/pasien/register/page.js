"use client";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUp } from "./lib/action";
import Link from "next/link";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50">
      {pending ? "Mendaftar..." : "Daftar"}
    </button>
  );
};

const initialState = {
  message: "",
};

const RegisterPage = () => {
  const [state, formAction] = useActionState(signUp, initialState);
  console.log(state?.message);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrasi</h2>

        {state.message !== "" && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{state.message}</div>}

        <form action={formAction}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input type="text" id="name" name="name" placeholder="Masukkan nama lengkap" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input type="email" id="email" name="email" placeholder="Masukkan email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input type="password" id="password" name="password" placeholder="Masukkan password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="mb-6">
            <SubmitButton />
          </div>

          <div className="text-center">
            <Link href="/pasien/login" className="text-blue-500 hover:underline">
              Sudah punya akun? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
