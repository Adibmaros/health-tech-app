"use client"

import { LoginFormApoteker } from "@/components/login-form-apoteker";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-6 md:p-10">
      <div className="w-full max-w-md">
        <LoginFormApoteker />
      </div>
    </div>
  );
}