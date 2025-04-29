"use client"

import { LoginFormDokter } from "@/components/login-form-dokter";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-sky-50 to-white p-6 md:p-10">
      <div className="w-full max-w-md">
        <LoginFormDokter />
      </div>
    </div>
  );
}